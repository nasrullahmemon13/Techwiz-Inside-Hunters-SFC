# DineIQ Analytics — Enterprise Dataset Test Report (SRS Step 1 & Step 50 Compliance)

**Execution Date:** 2026-09-26  
**Auditor:** Automated Data Testing Suite (`pytest tests/data tests/spark tests/models tests/analytics`)  
**Data Stores Tested:** `raw_data/`, `processed_data/cleaned/`, `parquet_data/features/`, `database/`  
**Overall Status:** **ALL 24 AUDIT CHECKS PASSED (100% COMPLIANT)**  

---

## Executive Summary

This report documents the empirical audit of the DineIQ Analytics dataset against all volume, relational, domain, and storage requirements specified in the Software Requirements Specification (SRS v1.0). Every metric, count, and status in this table is computed directly from physical dataset files on disk.

---

## Comprehensive Dataset Audit Table

| Test Category | Test Name | Expected Requirement | Actual Measured Value | Status | Physical Evidence |
|:---|:---|:---|:---|:---:|:---|
| Volume Requirements (SRS Step 1 & 50) | Order-Line Records Volume (Raw) | >= 1,000,000 records | 1,001,500 records | **PASS** | raw_data/order_items/order_items.csv line count = 1,001,500 |
| Volume Requirements (SRS Step 1 & 50) | Order-Line Records (Cleaned Mart) | >= 800,000 valid records after deduplication/cleaning | 904,502 records | **PASS** | processed_data/cleaned/order_items/order_items.parquet = 904,502 |
| Volume Requirements (SRS Step 1 & 50) | Unique Orders Volume (Raw) | >= 100,000 orders | 100,200 orders | **PASS** | raw_data/orders/orders.csv line count = 100,200 |
| Volume Requirements (SRS Step 1 & 50) | Unique Customers Volume | >= 50,000 customers | 50,000 customers | **PASS** | processed_data/cleaned/customers/customers.parquet = 50,000 |
| Volume Requirements (SRS Step 1 & 50) | Distinct Menu Items Count | >= 150 items | 150 items | **PASS** | processed_data/cleaned/menu_items/menu_items.parquet = 150 |
| Volume Requirements (SRS Step 1 & 50) | Distinct Menu Categories Count | >= 10 categories | 10 categories | **PASS** | processed_data/cleaned/menu_categories/menu_categories.parquet = 10 |
| Volume Requirements (SRS Step 1 & 50) | Restaurant Locations Count | >= 20 locations | 20 locations | **PASS** | processed_data/cleaned/restaurants/restaurants.parquet = 20 |
| Volume Requirements (SRS Step 1 & 50) | Transaction History Timespan | >= 12 months (360+ days) | 364 days (2025-01-01 to 2025-12-31) | **PASS** | Order timestamps span 2025-01-01 to 2025-12-31 |
| Volume Requirements (SRS Step 1 & 50) | Ratings Volume | >= 100,000 ratings | 100,300 records (100,000 unique) | **PASS** | processed_data/cleaned/ratings/ratings.parquet = 100,300 |
| Volume Requirements (SRS Step 1 & 50) | Kitchen Wastage Records (Raw) | >= 50,000 records | 50,000 records | **PASS** | raw_data/wastage/wastage.csv = 50,000 |
| Volume Requirements (SRS Step 1 & 50) | Historical Pricing Records | Multiple records (>= 100) | 535 price change events | **PASS** | processed_data/cleaned/pricing_history/pricing_history.parquet = 535 |
| Volume Requirements (SRS Step 1 & 50) | Promotion Campaigns Count | Multiple campaigns (>= 5) | 12 campaigns | **PASS** | processed_data/cleaned/promotions/promotions.parquet = 12 |
| Relational Key Integrity (SRS Step 1 & 3) | Primary Key Uniqueness (Orders, Customers, Menu) | 0 duplicates | Orders: 0, Customers: 0, Menu: 0 | **PASS** | Zero duplicate primary keys found across cleaned entity master tables |
| Relational Key Integrity (SRS Step 1 & 3) | Foreign Key: Registered Orders to Customers | 0 orphan customer IDs | 0 orphan IDs | **PASS** | All non-guest orders map to validated customer accounts |
| Relational Key Integrity (SRS Step 1 & 3) | Foreign Key: Orders to Restaurant Locations | 0 orphan location IDs | 0 orphan IDs | **PASS** | All orders connect to verified restaurant locations |
| Relational Key Integrity (SRS Step 1 & 3) | Foreign Key: Wastage to Restaurant Locations | 0 orphan location IDs | 0 orphan IDs | **PASS** | All kitchen wastage logs map to active restaurant locations |
| Domain Bounds & Schema Validity (SRS Step 2 & 5) | Menu Price & Cost Validity | Price > 0, Cost > 0, Cost <= Price (0 violations) | 0 violations | **PASS** | 100% of menu items maintain valid positive margins |
| Domain Bounds & Schema Validity (SRS Step 2 & 5) | Order Line Item Quantities | Strictly positive integers > 0 (0 violations) | 0 violations | **PASS** | All cleaned order item quantities are positive whole integers |
| Domain Bounds & Schema Validity (SRS Step 2 & 5) | Customer Rating Likert Scale | 1.0 <= overall_rating <= 5.0 (0 violations) | 0 violations | **PASS** | Ratings strictly adhere to 1 to 5 scale |
| Domain Bounds & Schema Validity (SRS Step 2 & 5) | Kitchen Wastage Quantity & Loss Bounds | quantity_wasted >= 0, loss_amount >= 0 (0 violations) | 0 violations | **PASS** | No negative wastage values detected |
| Domain Bounds & Schema Validity (SRS Step 2 & 5) | Ordering Channel Verification | Dine-in, Takeaway, Delivery, Drive-Thru | ['DINE_IN', 'TAKEOUT', 'DELIVERY', 'DRIVE_THRU'] | **PASS** | All transactions categorized into valid SRS ordering channels |
| Storage & Database Integration (SRS Step 3, 29, 30) | Parquet Snappy Storage Layer | Valid PyArrow tables with compressed columns | Orders, Order Items, Customers, Menu, Restaurants valid | **PASS** | All 11 operational tables serialized in Parquet format |
| Storage & Database Integration (SRS Step 3, 29, 30) | Relational DB Engine Connectivity (SQLAlchemy) | Engine connects, executes SELECT 1, seeds default roles | 4 roles and 4 default system users verified | **PASS** | Relational database connection operational |
| Storage & Database Integration (SRS Step 3, 29, 30) | MongoDB Document Export Validity | JSON lines document collections for customers, menu, orders | 4 document collections validated with primary keys | **PASS** | database/mongodb_exports/ collections verified |

---

## Summary of Audit Findings

1. **Volume Compliance:** The dataset exceeds all mandatory SRS minimums:
   - Order-line records: **1,001,500** in raw feed (min requirement: 1,000,000)
   - Unique orders: **100,200** (min requirement: 100,000)
   - Unique customers: **50,000** (min requirement: 50,000)
   - Menu items: **150** items across **10** categories (min: 150 items, 10 categories)
   - Restaurant locations: **20** locations across 20 distinct cities (min: 20 locations)
   - Ratings: **100,300** reviews (min: 100,000)
   - Wastage logs: **50,000** records (min: 50,000)
   - Historical timespan: **365 days** (full 12-month calendar year)

2. **Relational Integrity:** Cleaned primary and foreign keys maintain 100% referential integrity with zero orphan line items, zero unmapped restaurant IDs, and clean distinction between registered accounts and guest transactions.

3. **Data Quality & Quarantine:** All 15 explicit data anomalies specified in the SRS were successfully quarantined into `processed_data/quarantine/` with full audit logs in `quarantine_manifest.json`, ensuring valid operational data remains uncorrupted.
