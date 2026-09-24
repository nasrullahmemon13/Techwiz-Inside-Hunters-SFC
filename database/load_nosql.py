"""
DineIQ Analytics - NoSQL Database Loader (MongoDB / PyMongo)
Per SRS Section 2 & Step 2 requirements:
- Ingests structured and nested document models into MongoDB collections:
  * restaurants
  * menu_items
  * customers
  * orders (hierarchical nested documents with embedded items array)
- Supports live Atlas connection or exports mongoimport-ready JSON documents.
"""
import os
import sys
import json
import time
import pandas as pd
from dotenv import load_dotenv

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
RAW_DATA_DIR = os.path.join(PROJECT_ROOT, "raw_data")
MONGO_EXPORT_DIR = os.path.join(CURRENT_DIR, "mongodb_exports")

load_dotenv(os.path.join(PROJECT_ROOT, ".env"))

def prepare_nested_orders(limit: int = 5000):
    """Create hierarchical order documents with embedded order_items array."""
    orders_csv = os.path.join(RAW_DATA_DIR, "orders", "orders.csv")
    items_csv = os.path.join(RAW_DATA_DIR, "order_items", "order_items.csv")

    df_orders = pd.read_csv(orders_csv).head(limit)
    df_items = pd.read_csv(items_csv)

    # Filter items matching orders
    order_ids = set(df_orders["order_id"])
    df_items = df_items[df_items["order_id"].isin(order_ids)]

    # Group items by order_id
    grouped_items = {}
    for _, row in df_items.iterrows():
        o_id = row["order_id"]
        item_doc = {
            "order_item_id": row["order_item_id"],
            "item_id": row["item_id"],
            "quantity": int(row["quantity"]),
            "unit_price": float(row["unit_price"]),
            "subtotal": float(row["subtotal"]),
            "item_discount": float(row["item_discount"]),
            "item_total": float(row["item_total"])
        }
        grouped_items.setdefault(o_id, []).append(item_doc)

    order_docs = []
    for _, o in df_orders.iterrows():
        doc = {k: (None if pd.isna(v) else v) for k, v in o.to_dict().items()}
        doc["items"] = grouped_items.get(o["order_id"], [])
        order_docs.append(doc)

    return order_docs

def load_nosql_database(max_orders: int = 2500):
    start_time = time.time()
    os.makedirs(MONGO_EXPORT_DIR, exist_ok=True)

    print("=" * 65)
    print("DineIQ Analytics - NoSQL Database (MongoDB) Ingestion Pipeline")
    print("=" * 65)

    # 1. Prepare Document Models
    print("Preparing MongoDB document collections...")
    df_rest = pd.read_csv(os.path.join(RAW_DATA_DIR, "restaurants", "restaurants.csv"))
    rest_docs = [{k: (None if pd.isna(v) else v) for k, v in r.items()} for r in df_rest.to_dict(orient="records")]

    df_menu = pd.read_csv(os.path.join(RAW_DATA_DIR, "menu_items", "menu_items.csv"))
    menu_docs = [{k: (None if pd.isna(v) else v) for k, v in m.items()} for m in df_menu.to_dict(orient="records")]

    df_cust = pd.read_csv(os.path.join(RAW_DATA_DIR, "customers", "customers.csv")).head(5000)
    cust_docs = [{k: (None if pd.isna(v) else v) for k, v in c.items()} for c in df_cust.to_dict(orient="records")]

    order_docs = prepare_nested_orders(limit=max_orders)
    print(f"Prepared documents: {len(rest_docs)} restaurants, {len(menu_docs)} menu items, {len(cust_docs)} customers, {len(order_docs)} nested orders.")

    # 2. Always export JSON line-delimited files for mongoimport / local storage
    for col_name, docs in [("restaurants", rest_docs), ("menu_items", menu_docs), ("customers", cust_docs), ("orders", order_docs)]:
        export_file = os.path.join(MONGO_EXPORT_DIR, f"{col_name}.json")
        with open(export_file, "w", encoding="utf-8") as f:
            for d in docs:
                f.write(json.dumps(d) + "\n")
        print(f"  [Export] Saved {len(docs)} documents -> {export_file}")

    # 3. Attempt Live MongoDB Ingestion if configured
    uri = os.getenv("MONGODB_URI", "")
    db_name = os.getenv("MONGODB_DATABASE", "dineiq_analytics")

    if not uri or "<db_password>" in uri:
        print("\n[NOTE] MongoDB Atlas password not yet set in .env (contains '<db_password>').")
        print("To load into live Atlas:")
        print("1. Update MONGODB_URI in .env with your cluster password.")
        print("2. Re-run: python database/load_nosql.py")
        print(f"All documents have been saved locally in: {MONGO_EXPORT_DIR}")
        return

    try:
        from pymongo import MongoClient
        print(f"\nConnecting to MongoDB Atlas: {uri.split('@')[-1]}...")
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        client.admin.command("ping")
        db = client[db_name]
        print(f"[CONNECTED] Connected to MongoDB database '{db_name}'.")

        # Ingest collections
        for col_name, docs in [("restaurants", rest_docs), ("menu_items", menu_docs), ("customers", cust_docs), ("orders", order_docs)]:
            col = db[col_name]
            col.delete_many({}) # Clear existing
            col.insert_many(docs)
            print(f"  [OK] Ingested {len(docs)} documents into collection '{col_name}'.")

        print(f"\n[SUCCESS] Live NoSQL database ingestion complete in {time.time() - start_time:.1f}s!")
    except Exception as e:
        print(f"[WARNING] MongoDB Atlas connection error: {e}")
        print(f"Local JSON collections remain available in {MONGO_EXPORT_DIR}")

if __name__ == "__main__":
    load_nosql_database()
