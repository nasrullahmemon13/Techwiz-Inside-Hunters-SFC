"""
Generate Pricing History Table
Per SRS Section 2 & Hint specifications.
Injects:
- Changing prices across 12-month timeline (Q1 initial, Q3 inflation adjustment, seasonal seafood surges, promotional markdowns)
- Multi-location pricing differences (locations with high cost_index have distinct location-level pricing adjustments)
- Changing margins reflecting popular low-margin vs profitable low-selling dynamics
"""
import os
import random
from datetime import date, timedelta
import pandas as pd
from config import RAW_DATA_DIR, RANDOM_SEED, START_DATE, END_DATE, ensure_dir

random.seed(RANDOM_SEED)

def generate_pricing_history(output_path: str = None) -> pd.DataFrame:
    """Generate pricing history records across all 150 items and 20 locations."""
    items_path = os.path.join(RAW_DATA_DIR, "menu_items", "menu_items.csv")
    restaurants_path = os.path.join(RAW_DATA_DIR, "restaurants", "restaurants.csv")
    
    if not os.path.exists(items_path):
        raise FileNotFoundError(f"Missing {items_path}. Run generate_menu_items.py first.")
    if not os.path.exists(restaurants_path):
        raise FileNotFoundError(f"Missing {restaurants_path}. Run generate_restaurants.py first.")
        
    df_items = pd.read_csv(items_path)
    df_rest = pd.read_csv(restaurants_path)
    
    records = []
    rec_id = 1
    
    # 1. Global Baseline Pricing for all items (Q1 2025: Jan 1 to Jun 30)
    for _, item in df_items.iterrows():
        item_id = item["item_id"]
        base_p = float(item["base_price"])
        cost_p = float(item["cost_price"])
        profile = str(item.get("complexity_profile", "STANDARD"))
        
        # Phase 1: H1 (2025-01-01 to 2025-06-30)
        records.append({
            "price_history_id": f"PRH-{rec_id:06d}",
            "item_id": item_id,
            "location_id": "ALL",
            "base_price": round(base_p, 2),
            "cost_price": round(cost_p, 2),
            "effective_start_date": "2025-01-01",
            "effective_end_date": "2025-06-30",
            "change_reason": "INITIAL_BASELINE",
            "complexity_profile": profile
        })
        rec_id += 1
        
        # Phase 2: H2 (2025-07-01 to 2025-12-31) - Inflation / Cost adjustments
        if profile == "POPULAR_LOW_MARGIN":
            # Cost rose by 8%, but price only raised by 3% (eroding margin further)
            new_cost = cost_p * 1.08
            new_base = base_p * 1.03
            reason = "SUPPLY_COST_SURGE_UNABSORBED"
        elif profile == "PROFITABLE_LOW_SELLING":
            # Premium pricing increased slightly without demand sensitivity
            new_cost = cost_p * 1.03
            new_base = base_p * 1.07
            reason = "PREMIUM_TIER_OPTIMIZATION"
        elif profile == "HIGH_WASTAGE":
            # Modest price hike to cover perishable spoil risk
            new_cost = cost_p * 1.06
            new_base = base_p * 1.05
            reason = "SPOILAGE_RISK_SURCHARGE"
        else:
            # Standard inflation hike
            new_cost = cost_p * 1.04
            new_base = base_p * 1.05
            reason = "ANNUAL_INFLATION_ADJUSTMENT"
            
        records.append({
            "price_history_id": f"PRH-{rec_id:06d}",
            "item_id": item_id,
            "location_id": "ALL",
            "base_price": round(new_base, 2),
            "cost_price": round(new_cost, 2),
            "effective_start_date": "2025-07-01",
            "effective_end_date": "2025-12-31",
            "change_reason": reason,
            "complexity_profile": profile
        })
        rec_id += 1

    # 2. Location-Specific Pricing Overrides (Multi-location differences)
    # Tier Flagship and High Cost Index locations have localized price premiums
    for _, loc in df_rest.iterrows():
        loc_id = loc["location_id"]
        cost_index = float(loc["cost_index"])
        
        # Flagship or high-rent locations (cost_index >= 1.25)
        if cost_index >= 1.25:
            # Premium items and beverages get 10-15% location premium
            premium_items = df_items[df_items["complexity_profile"].isin(["PROFITABLE_LOW_SELLING", "STANDARD"])].sample(n=25, random_state=RANDOM_SEED)
            for _, item in premium_items.iterrows():
                base_p = float(item["base_price"]) * (cost_index * 0.95) # markup
                cost_p = float(item["cost_price"]) * (cost_index * 0.98)
                records.append({
                    "price_history_id": f"PRH-{rec_id:06d}",
                    "item_id": item["item_id"],
                    "location_id": loc_id,
                    "base_price": round(base_p, 2),
                    "cost_price": round(cost_p, 2),
                    "effective_start_date": "2025-04-01",
                    "effective_end_date": "2025-12-31",
                    "change_reason": "METROPOLITAN_PREMIUM_RATE",
                    "complexity_profile": str(item["complexity_profile"])
                })
                rec_id += 1
                
        # Express or suburban locations (cost_index < 1.05) - Value promotions
        elif cost_index < 1.05:
            value_items = df_items[df_items["complexity_profile"] == "POPULAR_LOW_MARGIN"].head(10)
            for _, item in value_items.iterrows():
                base_p = float(item["base_price"]) * 0.92 # discount
                cost_p = float(item["cost_price"])
                records.append({
                    "price_history_id": f"PRH-{rec_id:06d}",
                    "item_id": item["item_id"],
                    "location_id": loc_id,
                    "base_price": round(base_p, 2),
                    "cost_price": round(cost_p, 2),
                    "effective_start_date": "2025-05-01",
                    "effective_end_date": "2025-09-30",
                    "change_reason": "SUBURBAN_VALUE_PROMOTION",
                    "complexity_profile": "POPULAR_LOW_MARGIN"
                })
                rec_id += 1

    df = pd.DataFrame(records)
    
    if output_path is None:
        target_dir = os.path.join(RAW_DATA_DIR, "pricing_history")
        ensure_dir(target_dir)
        output_path = os.path.join(target_dir, "pricing_history.csv")
        
    df.to_csv(output_path, index=False, encoding="utf-8")
    print(f"[OK] Generated {len(df)} pricing history records -> {output_path}")
    print("--- Pricing History Breakdown by Change Reason ---")
    print(df["change_reason"].value_counts().to_string())
    return df

if __name__ == "__main__":
    generate_pricing_history()
