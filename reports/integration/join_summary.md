# DineIQ Analytics - Step 6: Data Integration & Join Pipeline Summary

**Execution Timestamp:** 2026-09-24  
**Engine:** Apache Spark 4.2.0 (PySpark on Java 17 LTS OpenJDK)  
**Input Data:** `processed_data/cleaned/` (Cleaned & De-duplicated tables)  
**Output Data:** `processed_data/joined/`  

---

## 1. Executive Summary

SRS Step 6 requires the end-to-end data integration of all restaurant domain entities using Apache Spark SQL and PySpark DataFrames. All **EXACT 10 relational relationships** designated by the SRS specification have been implemented, tested, and validated.

Furthermore, a denormalized **Master Analytical Order Cube** linking orders, line items, customers, locations, menu items, categories, and promotions was compiled into both **Snappy-compressed columnar Parquet** and standard **CSV** formats, unlocking high-performance downstream data science and machine learning tasks.

---

## 2. Relational Join Execution Matrix (The Exact 10 SRS Relationships)

| # | Relationship | Join Type | Primary / Foreign Key | Joined Rows | Latency (s) | Business Analytical Utility |
|---|---|---|---|---:|---:|---|
| **1** | **Orders - Customers** | `LEFT JOIN` | `customer_id` | **90,471** | 0.229s | Customer segmentation, RFM & churn risk analysis |
| **2** | **Orders - OrderItems** | `INNER JOIN` | `order_id` | **904,502** | 0.024s | Basket size, ticket items, line-item aggregations |
| **3** | **OrderItems - MenuItems** | `INNER JOIN` | `item_id` | **904,502** | 0.037s | Item popularity, category margins, complexity analysis |
| **4** | **MenuItems - Categories** | `INNER JOIN` | `category_id` | **150** | 0.020s | Target margin tracking vs actual realized margins |
| **5** | **Orders - Locations** | `INNER JOIN` | `location_id` | **90,471** | 0.019s | Geo-spatial demand, urban vs suburban branch metrics |
| **6** | **Orders - Promotions** | `LEFT JOIN` | `promotion_id` | **90,471** | 0.010s | Campaign ROI, promo lift, misleading discount audit |
| **7** | **MenuItems - PricingHistory** | `INNER JOIN` | `item_id` | **535** | 0.013s | Dynamic pricing elasticity & historical margin shifts |
| **8** | **MenuItems - Ratings** | `INNER JOIN` | `item_id` | **100,300** | 0.016s | Customer satisfaction, sentiment, rating anomalies |
| **9** | **MenuItems - Inventory** | `INNER JOIN` | `item_id` | **26,000** | 0.015s | Daily stock levels, reorder alerts, stockout trends |
| **10** | **MenuItems - Wastage** | `INNER JOIN` | `item_id` | **49,945** | 0.015s | Food waste financial loss, shelf-life risk analysis |

---

## 3. Master Analytical Order Cube Architecture

- **Total Denormalized Records:** `904,502` line-item order events
- **Columns:** 30 comprehensive dimensional and metric attributes
- **Calculated Metrics Added:**
  - `total_item_cost`: `quantity * cost_price`
  - `item_subtotal`: `quantity * unit_price`
  - `gross_profit`: `item_total - total_item_cost`
- **Output Locations:**
  - Parquet (Columnar, Snappy): `processed_data/joined/master_analytical_cube/master_analytical_cube.parquet` (18.26 MB)
  - CSV (Tabular text): `processed_data/joined/master_analytical_cube/master_analytical_cube.csv` (267.1 MB)
- **Representative Samples:**
  - `processed_data/joined/orders_customers_sample/` (5,000 records)
  - `processed_data/joined/menu_wastage_sample/` (5,000 records)

---

## 4. Verification & Automated Testing

A dedicated test suite in `tests/test_join_pipeline.py` provides 12 automated unit and integration tests verifying:
1. Master cube file existence in Parquet and CSV formats.
2. Volume threshold verification (`>= 900,000` records).
3. Schema completeness across all 30 dimensional features.
4. Primary/Foreign Key relational integrity across all 10 SRS join pairs.
5. Calculated revenue, cost, and gross margin integrity.

All 25 tests across the DineIQ test suite pass with 100% success rate.
