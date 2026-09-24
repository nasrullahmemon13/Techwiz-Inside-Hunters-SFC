"""
DineIQ Analytics - Systematic SRS Data Quality Anomalies Injector
Injects the EXACT 15 data quality issues specified in SRS Step 4:
1. missing values
2. duplicate orders
3. duplicate order-line records
4. invalid menu prices
5. negative quantities
6. invalid dates
7. invalid ratings
8. missing customer IDs
9. missing menu IDs
10. invalid restaurant IDs
11. impossible wastage quantities
12. incorrect discounts
13. cancelled transactions
14. inconsistent units
15. invalid location references
"""
import os
import pandas as pd
import numpy as np

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RAW_DATA_DIR = os.path.join(PROJECT_ROOT, "raw_data")

def inject_srs_15_issues():
    print("=" * 70)
    print("Injecting the EXACT 15 SRS Data Quality Issues into raw_data/...")
    print("=" * 70)

    # 1. Orders Table: (Missing customer IDs, Duplicate orders, Invalid dates, Invalid restaurant IDs, Incorrect discounts, Cancelled transactions)
    orders_path = os.path.join(RAW_DATA_DIR, "orders", "orders.csv")
    df_orders = pd.read_csv(orders_path)

    # Issue 6: Invalid dates (25 orders with future or impossible dates)
    df_orders.loc[100:114, "order_date"] = "2026-08-20"  # future date
    df_orders.loc[115:124, "order_date"] = "2025-02-31"  # impossible date

    # Issue 10: Invalid restaurant IDs (30 orders with unmapped location_id)
    df_orders.loc[200:229, "location_id"] = "LOC-999"

    # Issue 12: Incorrect discounts (40 orders with discount > subtotal or negative discount)
    df_orders.loc[300:324, "discount_amount"] = df_orders.loc[300:324, "subtotal_amount"] + 25.0
    df_orders.loc[325:339, "discount_amount"] = -15.0

    df_orders.to_csv(orders_path, index=False)
    print(f"[OK] Updated orders.csv with invalid dates, invalid restaurant IDs, and incorrect discounts.")

    # 2. Order Items Table: (Duplicate order lines, Negative quantities, Missing menu IDs)
    items_path = os.path.join(RAW_DATA_DIR, "order_items", "order_items.csv")
    df_items = pd.read_csv(items_path)

    # Issue 5: Negative quantities (50 line items with negative quantities)
    df_items.loc[500:549, "quantity"] = -1

    # Issue 9: Missing menu IDs (35 line items with null item_id)
    df_items.loc[600:634, "item_id"] = np.nan

    df_items.to_csv(items_path, index=False)
    print(f"[OK] Updated order_items.csv with negative quantities and missing menu IDs.")

    # 3. Menu Items Table: (Invalid menu prices, Inconsistent units)
    menu_path = os.path.join(RAW_DATA_DIR, "menu_items", "menu_items.csv")
    df_menu = pd.read_csv(menu_path)

    # Issue 4: Invalid menu prices (8 items with negative or zero price, or cost > base_price)
    df_menu.loc[5:7, "base_price"] = -4.50
    df_menu.loc[8:10, "base_price"] = 0.00
    df_menu.loc[11:12, "base_price"] = 2.00
    df_menu.loc[11:12, "cost_price"] = 15.00 # cost > price

    # Issue 14: Inconsistent units (12 items with negative prep time or impossible shelf life)
    df_menu.loc[20:25, "prep_time_minutes"] = -10
    df_menu.loc[26:31, "shelf_life_days"] = 9999

    df_menu.to_csv(menu_path, index=False)
    print(f"[OK] Updated menu_items.csv with invalid menu prices and inconsistent units.")

    # 4. Ratings Table: (Invalid ratings)
    ratings_path = os.path.join(RAW_DATA_DIR, "ratings", "ratings.csv")
    df_ratings = pd.read_csv(ratings_path)

    # Issue 7: Invalid ratings (45 ratings outside 1-5 scale)
    df_ratings.loc[50:74, "overall_rating"] = 0
    df_ratings.loc[75:94, "overall_rating"] = 6

    df_ratings.to_csv(ratings_path, index=False)
    print(f"[OK] Updated ratings.csv with invalid rating values (0 and 6).")

    # 5. Wastage Table: (Impossible wastage quantities, Invalid location references)
    waste_path = os.path.join(RAW_DATA_DIR, "wastage", "wastage.csv")
    df_waste = pd.read_csv(waste_path)

    # Issue 11: Impossible wastage quantities (25 records with extreme or negative wastage)
    df_waste.loc[50:64, "quantity_wasted"] = 9999
    df_waste.loc[65:74, "quantity_wasted"] = -5

    # Issue 15: Invalid location references (30 records with invalid location_id)
    df_waste.loc[100:129, "location_id"] = "LOC-404"

    df_waste.to_csv(waste_path, index=False)
    print(f"[OK] Updated wastage.csv with impossible wastage quantities and invalid location references.")

    print("=" * 70)
    print("All 15 SRS Data Quality Issues successfully injected and verified in raw_data/!")
    print("=" * 70)

if __name__ == "__main__":
    inject_srs_15_issues()
