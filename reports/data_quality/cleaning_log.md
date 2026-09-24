# DineIQ Analytics — Data Cleaning Decisions Audit Log (SRS Step 5)

**Execution Timestamp:** 2026-09-24 14:33:51  
**Cleaned Datasets Destination:** `processed_data/cleaned/`  
**Quarantine Destination:** `processed_data/quarantine/`  
**Total Cleaning Decisions Logged:** `16`  

## 1. Executive Cleaning Summary

All problematic records identified in Phase 4 have been cleaned, corrected, removed, or quarantined in strict compliance with SRS Section 2 & Step 5. Per the mandatory requirement that *'All cleaning decisions must be recorded'*, every data-quality transformation applied across the 11 platform tables is detailed below.

| Decision ID | Issue | Action | Entity | Impacted Records | Before -> After | Business Justification |
| :--- | :--- | :--- | :--- | -: | :---: | :--- |
| **RULE-02** | duplicate orders | `DEDUPLICATION` | `orders` | 200 | 100,200 -> 100,000 | Prevent double-counting sales revenue and transaction metrics. |
| **RULE-03** | duplicate order-line records | `DEDUPLICATION` | `order_items` | 1,500 | 1,001,500 -> 1,000,000 | Eliminate redundant order item records inflating quantities. |
| **RULE-06** | invalid dates | `QUARANTINE_AND_REMOVE` | `orders` | 25 | 100,000 -> 99,975 | Exclude future dates and impossible calendar dates from reporting window. |
| **RULE-10** | invalid restaurant IDs | `QUARANTINE_AND_REMOVE` | `orders` | 30 | 99,975 -> 99,945 | Enforce foreign key referential integrity on restaurant location. |
| **RULE-08** | missing customer IDs | `IMPUTATION` | `orders` | 4,008 | 99,945 -> 99,945 | Preserve walk-in guest transactions without breaking customer joins. |
| **RULE-01A** | missing values | `IMPUTATION` | `orders` | 57,694 | 99,945 -> 99,945 | Impute 0 for non-dine-in or unassigned table numbers. |
| **RULE-12** | incorrect discounts | `VALUE_CORRECTION` | `orders` | 40 | 99,945 -> 99,945 | Discount cannot exceed subtotal amount or be negative. |
| **RULE-13** | cancelled transactions | `SEGREGATION_AND_ROUTING` | `orders` | 9,474 | 99,945 -> 90,471 | Exclude cancelled/refunded transactions from sales revenue while keeping operational logs. |
| **RULE-05** | negative quantities | `QUARANTINE_AND_REMOVE` | `order_items` | 50 | 1,000,000 -> 999,950 | Negative item quantities represent corrupt returns and invalidate basket calculations. |
| **RULE-09** | missing menu IDs | `QUARANTINE_AND_REMOVE` | `order_items` | 35 | 999,950 -> 999,915 | Menu item ID is a required foreign key for recipe and costing analytics. |
| **RULE-04** | invalid menu prices | `QUARANTINE_AND_CORRECT` | `menu_items` | 8 | 150 -> 150 | Correct prices to ensure minimum 33% gross profit margin and quarantine original anomalies. |
| **RULE-14** | inconsistent units | `VALUE_NORMALIZATION` | `menu_items` | 12 | 150 -> 150 | Standardize preparation and inventory storage time units. |
| **RULE-07** | invalid ratings | `CLIPPING_AND_QUARANTINE` | `ratings` | 45 | 100,300 -> 100,300 | Clamp ratings to 1..5 Likert boundaries and preserve original anomalies in quarantine. |
| **RULE-11** | impossible wastage quantities | `QUARANTINE_AND_REMOVE` | `wastage` | 25 | 50,000 -> 49,975 | Exclude physically impossible kitchen batch wastage figures. |
| **RULE-15** | invalid location references | `QUARANTINE_AND_REMOVE` | `wastage` | 30 | 49,975 -> 49,945 | Maintain strict foreign key referential integrity on wastage reporting. |
| **RULE-01B** | missing values | `IMPUTATION` | `customers` | 3,468 | 50,000 -> 50,000 | Provide safe non-null defaults for downstream notification and segmentation jobs. |

## 2. Detailed Remediation Decisions by Rule

### 1. RULE-02 — Duplicate Orders
- **Target Entity:** `orders`  
- **Action Type:** `DEDUPLICATION`  
- **Records Impacted:** `200`  
- **Record Count Shift:** `100,200` -> `100,000`  
- **Transformation Expression:**  
  ```python
  df_orders.drop_duplicates(subset=['order_id'], keep='first')
  ```
- **Business & Engineering Rationale:** Prevent double-counting sales revenue and transaction metrics.  

### 2. RULE-03 — Duplicate Order-Line Records
- **Target Entity:** `order_items`  
- **Action Type:** `DEDUPLICATION`  
- **Records Impacted:** `1,500`  
- **Record Count Shift:** `1,001,500` -> `1,000,000`  
- **Transformation Expression:**  
  ```python
  df_items.drop_duplicates(subset=['order_item_id'], keep='first')
  ```
- **Business & Engineering Rationale:** Eliminate redundant order item records inflating quantities.  

### 3. RULE-06 — Invalid Dates
- **Target Entity:** `orders`  
- **Action Type:** `QUARANTINE_AND_REMOVE`  
- **Records Impacted:** `25`  
- **Record Count Shift:** `100,000` -> `99,975`  
- **Transformation Expression:**  
  ```python
  df_orders.filter(order_date.is_valid() & (order_date <= '2025-12-31'))
  ```
- **Business & Engineering Rationale:** Exclude future dates and impossible calendar dates from reporting window.  

### 4. RULE-10 — Invalid Restaurant Ids
- **Target Entity:** `orders`  
- **Action Type:** `QUARANTINE_AND_REMOVE`  
- **Records Impacted:** `30`  
- **Record Count Shift:** `99,975` -> `99,945`  
- **Transformation Expression:**  
  ```python
  df_orders.join(df_rest, 'location_id', 'left_semi')
  ```
- **Business & Engineering Rationale:** Enforce foreign key referential integrity on restaurant location.  

### 5. RULE-08 — Missing Customer Ids
- **Target Entity:** `orders`  
- **Action Type:** `IMPUTATION`  
- **Records Impacted:** `4,008`  
- **Record Count Shift:** `99,945` -> `99,945`  
- **Transformation Expression:**  
  ```python
  df_orders['customer_id'].fillna('CUST-GUEST')
  ```
- **Business & Engineering Rationale:** Preserve walk-in guest transactions without breaking customer joins.  

### 6. RULE-01A — Missing Values
- **Target Entity:** `orders`  
- **Action Type:** `IMPUTATION`  
- **Records Impacted:** `57,694`  
- **Record Count Shift:** `99,945` -> `99,945`  
- **Transformation Expression:**  
  ```python
  df_orders['table_number'].fillna(0)
  ```
- **Business & Engineering Rationale:** Impute 0 for non-dine-in or unassigned table numbers.  

### 7. RULE-12 — Incorrect Discounts
- **Target Entity:** `orders`  
- **Action Type:** `VALUE_CORRECTION`  
- **Records Impacted:** `40`  
- **Record Count Shift:** `99,945` -> `99,945`  
- **Transformation Expression:**  
  ```python
  discount_amount = clip(discount_amount, 0, subtotal_amount); recalculate totals
  ```
- **Business & Engineering Rationale:** Discount cannot exceed subtotal amount or be negative.  

### 8. RULE-13 — Cancelled Transactions
- **Target Entity:** `orders`  
- **Action Type:** `SEGREGATION_AND_ROUTING`  
- **Records Impacted:** `9,474`  
- **Record Count Shift:** `99,945` -> `90,471`  
- **Transformation Expression:**  
  ```python
  Filter orders_clean = df[status == 'COMPLETED']; Route cancelled to orders_cancelled
  ```
- **Business & Engineering Rationale:** Exclude cancelled/refunded transactions from sales revenue while keeping operational logs.  

### 9. RULE-05 — Negative Quantities
- **Target Entity:** `order_items`  
- **Action Type:** `QUARANTINE_AND_REMOVE`  
- **Records Impacted:** `50`  
- **Record Count Shift:** `1,000,000` -> `999,950`  
- **Transformation Expression:**  
  ```python
  df_items.filter(quantity > 0)
  ```
- **Business & Engineering Rationale:** Negative item quantities represent corrupt returns and invalidate basket calculations.  

### 10. RULE-09 — Missing Menu Ids
- **Target Entity:** `order_items`  
- **Action Type:** `QUARANTINE_AND_REMOVE`  
- **Records Impacted:** `35`  
- **Record Count Shift:** `999,950` -> `999,915`  
- **Transformation Expression:**  
  ```python
  df_items.filter(item_id.isNotNull())
  ```
- **Business & Engineering Rationale:** Menu item ID is a required foreign key for recipe and costing analytics.  

### 11. RULE-04 — Invalid Menu Prices
- **Target Entity:** `menu_items`  
- **Action Type:** `QUARANTINE_AND_CORRECT`  
- **Records Impacted:** `8`  
- **Record Count Shift:** `150` -> `150`  
- **Transformation Expression:**  
  ```python
  Recalculate base_price = cost_price * 1.5 where cost > price; update margin_pct
  ```
- **Business & Engineering Rationale:** Correct prices to ensure minimum 33% gross profit margin and quarantine original anomalies.  

### 12. RULE-14 — Inconsistent Units
- **Target Entity:** `menu_items`  
- **Action Type:** `VALUE_NORMALIZATION`  
- **Records Impacted:** `12`  
- **Record Count Shift:** `150` -> `150`  
- **Transformation Expression:**  
  ```python
  prep_time_minutes = 15 where <= 0; shelf_life_days = 30 where > 365
  ```
- **Business & Engineering Rationale:** Standardize preparation and inventory storage time units.  

### 13. RULE-07 — Invalid Ratings
- **Target Entity:** `ratings`  
- **Action Type:** `CLIPPING_AND_QUARANTINE`  
- **Records Impacted:** `45`  
- **Record Count Shift:** `100,300` -> `100,300`  
- **Transformation Expression:**  
  ```python
  df_ratings['overall_rating'] = df_ratings['overall_rating'].clip(1, 5)
  ```
- **Business & Engineering Rationale:** Clamp ratings to 1..5 Likert boundaries and preserve original anomalies in quarantine.  

### 14. RULE-11 — Impossible Wastage Quantities
- **Target Entity:** `wastage`  
- **Action Type:** `QUARANTINE_AND_REMOVE`  
- **Records Impacted:** `25`  
- **Record Count Shift:** `50,000` -> `49,975`  
- **Transformation Expression:**  
  ```python
  df_waste.filter((quantity_wasted > 0) & (quantity_wasted <= 50))
  ```
- **Business & Engineering Rationale:** Exclude physically impossible kitchen batch wastage figures.  

### 15. RULE-15 — Invalid Location References
- **Target Entity:** `wastage`  
- **Action Type:** `QUARANTINE_AND_REMOVE`  
- **Records Impacted:** `30`  
- **Record Count Shift:** `49,975` -> `49,945`  
- **Transformation Expression:**  
  ```python
  df_waste.join(df_rest, 'location_id', 'left_semi')
  ```
- **Business & Engineering Rationale:** Maintain strict foreign key referential integrity on wastage reporting.  

### 16. RULE-01B — Missing Values
- **Target Entity:** `customers`  
- **Action Type:** `IMPUTATION`  
- **Records Impacted:** `3,468`  
- **Record Count Shift:** `50,000` -> `50,000`  
- **Transformation Expression:**  
  ```python
  email.fillna('unregistered@guest.dineiq.com'); phone_number.fillna('N/A')
  ```
- **Business & Engineering Rationale:** Provide safe non-null defaults for downstream notification and segmentation jobs.  

## 3. Quarantine Inventory Manifest

| Quarantine File | Entity | Records | Reason |
| :--- | :--- | -: | :--- |
| `orders_rule_02.csv` | `orders` | 200 | Exact duplicate order_id detected |
| `order_items_rule_03.csv` | `order_items` | 1,500 | Exact duplicate order_item_id detected |
| `orders_rule_06.csv` | `orders` | 25 | Order date is in future or unparseable calendar date |
| `orders_rule_10.csv` | `orders` | 30 | Location ID 'LOC-999' does not exist in master restaurants |
| `order_items_rule_05.csv` | `order_items` | 50 | Quantity <= 0 detected |
| `order_items_rule_09.csv` | `order_items` | 35 | Null item_id prevents menu item association |
| `order_items_cascaded_quarantine.csv` | `order_items` | 95,413 | Parent order was cancelled or quarantined |
| `menu_items_rule_04.csv` | `menu_items` | 8 | Base price <= 0, cost <= 0, or cost > base_price |
| `ratings_rule_07.csv` | `ratings` | 45 | Overall rating outside 1 to 5 Likert scale |
| `wastage_rule_11.csv` | `wastage` | 25 | Quantity wasted > 50 or <= 0 |
| `wastage_rule_15.csv` | `wastage` | 30 | Location ID 'LOC-404' not found in master restaurants |
