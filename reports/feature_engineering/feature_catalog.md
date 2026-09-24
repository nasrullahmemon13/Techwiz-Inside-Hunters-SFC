# DineIQ Analytics - Step 7: Feature Engineering Catalog

**Execution Timestamp:** 2026-09-24 14:46:29
**Engine:** PySpark 4.2.0 & PyArrow Parquet
**Total Features Engineered:** 22 exact SRS features

## 1. Feature Definition & Distribution Summary

| Feature Name | Domain | Storage Mart | Data Type | Min | Max | Mean / Top | Status |
|---|---|---|---|---|---|---|---|
| `item_revenue` | Menu Item | `menu_features` | `float64` | 17784.0 | 417790.69 | 139881.33 | Verified |
| `cost` | Menu Item | `menu_features` | `float64` | 3705.0 | 257723.5 | 61557.81 | Verified |
| `contribution_margin` | Menu Item | `menu_features` | `float64` | -39007.5 | 177031.0 | 78323.51 | Verified |
| `profit_percentage` | Menu Item | `menu_features` | `float64` | -30.43 | 89.41 | 59.67 | Verified |
| `order_frequency` | Menu Item | `menu_features` | `int64` | 457.0 | 13670.0 | 5784.79 | Verified |
| `item_popularity` | Menu Item | `menu_features` | `int64` | 667.0 | 21480.0 | 8739.39 | Verified |
| `repeat_purchase_rate` | Menu Item | `menu_features` | `float64` | 0.01 | 0.12 | 0.05 | Verified |
| `average_rating` | Menu Item | `menu_features` | `float64` | 3.32 | 3.82 | 3.62 | Verified |
| `rating_trend` | Menu Item | `menu_features` | `float64` | -0.69 | 1.2 | 0.01 | Verified |
| `wastage_percentage` | Menu Item | `menu_features` | `object` | N/A | N/A | 147 unique | Verified |
| `price_change_percentage` | Menu Item | `menu_features` | `float64` | -44.15 | 95.65 | 1.05 | Verified |
| `basket_size` | Customer | `customer_master_features` | `float64` | 0.0 | 39.0 | 11.91 | Verified |
| `discount_percentage` | Customer | `customer_master_features` | `float64` | 0.0 | 100.0 | 2.41 | Verified |
| `promotion_dependency` | Customer | `customer_master_features` | `float64` | 0.0 | 1.0 | 0.28 | Verified |
| `peak_hour_frequency` | Customer | `customer_master_features` | `float64` | 0.0 | 1.0 | 0.48 | Verified |
| `weekend_order_ratio` | Customer | `customer_master_features` | `float64` | 0.0 | 1.0 | 0.29 | Verified |
| `channel_preference` | Customer | `customer_master_features` | `str` | N/A | N/A | 5 unique | Verified |
| `location_performance` | Customer | `customer_master_features` | `float64` | 0.0 | 271.8 | 221.27 | Verified |
| `customer_recency` | Customer | `customer_master_features` | `int32` | 0.0 | 365.0 | 163.14 | Verified |
| `customer_frequency` | Customer | `customer_master_features` | `int64` | 0.0 | 10.0 | 1.74 | Verified |
| `customer_monetary_value` | Customer | `customer_master_features` | `float64` | 0.0 | 3114.52 | 467.72 | Verified |
| `average_order_value` | Customer | `customer_master_features` | `float64` | 0.0 | 1096.94 | 221.22 | Verified |

## 2. Parquet Storage Outputs

| Feature Store File | Format | Row Count | File Size (KB) |
|---|---|---:|---:|
| `menu_features.parquet` | Snappy Columnar Parquet | 150 | 25.76 KB |
| `menu_features.csv` | UTF-8 Delimited CSV | 150 | 22.91 KB |
| `customer_features.parquet` | Snappy Columnar Parquet | 50,000 | 829.6 KB |
| `customer_features.csv` | UTF-8 Delimited CSV | 50,000 | 4052.82 KB |
| `rfm_features.parquet` | Snappy Columnar Parquet | 50,000 | 1034.41 KB |
| `rfm_features.csv` | UTF-8 Delimited CSV | 50,000 | 3269.04 KB |
| `customer_master_features.parquet` | Snappy Columnar Parquet | 50,000 | 1429.44 KB |
| `customer_master_features.csv` | UTF-8 Delimited CSV | 50,000 | 6090.42 KB |
