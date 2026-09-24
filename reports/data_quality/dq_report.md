# DineIQ Analytics — Data Quality & Integrity Report (SRS Step 4)

**Generated:** 2026-09-24 14:31:05  
**Platform Version:** DineIQ Big Data & Data Science v1.0  
**Overall Platform Data Quality Score:** `98.08%`  

## 1. Executive Summary

The DineIQ Data Quality profiling engine scanned **4,006,500 total attribute records** across all 11 platform tables. A total of **15 exact data quality issues** specified in the SRS were identified, quantified, and cataloged. **4 Critical**, **6 High**, **4 Medium**, and **1 Low** severity issues were detected.

| Metric | Value |
| :--- | :--- |
| **Overall Data Quality Score** | **98.08%** |
| **Total Violations Flagged** | **76,843** |
| **Critical Severity Issues** | 4 |
| **High Severity Issues** | 6 |
| **Medium Severity Issues** | 4 |
| **Low Severity Issues** | 1 |

## 2. The 15 SRS Data Quality Issues Audit Table

| # | Issue Name | Category | Table | Column(s) | Violations | Total Records | Error Rate (%) | Severity |
| :-: | :--- | :--- | :--- | :--- | -: | -: | -: | :---: |
| 1 | **missing values** | Completeness | `customers / orders` | `email, phone_number, table_number` | 61,316 | 200,200 | 30.627% | `Medium` |
| 2 | **duplicate orders** | Uniqueness | `orders` | `order_id` | 200 | 100,200 | 0.2% | `Critical` |
| 3 | **duplicate order-line records** | Uniqueness | `order_items` | `order_item_id` | 1,500 | 1,001,500 | 0.15% | `Critical` |
| 4 | **invalid menu prices** | Validity | `menu_items` | `base_price, cost_price` | 8 | 150 | 5.333% | `High` |
| 5 | **negative quantities** | Validity | `order_items` | `quantity` | 50 | 1,001,500 | 0.005% | `High` |
| 6 | **invalid dates** | Validity | `orders` | `order_date` | 25 | 100,200 | 0.025% | `High` |
| 7 | **invalid ratings** | Validity | `ratings` | `overall_rating` | 45 | 100,300 | 0.045% | `Medium` |
| 8 | **missing customer IDs** | Completeness | `orders` | `customer_id` | 4,017 | 100,200 | 4.009% | `Low` |
| 9 | **missing menu IDs** | Completeness | `order_items` | `item_id` | 35 | 1,001,500 | 0.003% | `Critical` |
| 10 | **invalid restaurant IDs** | Integrity | `orders` | `location_id` | 30 | 100,200 | 0.03% | `Critical` |
| 11 | **impossible wastage quantities** | Validity | `wastage` | `quantity_wasted` | 25 | 50,000 | 0.05% | `High` |
| 12 | **incorrect discounts** | Consistency | `orders` | `discount_amount, subtotal_amount` | 40 | 100,200 | 0.04% | `High` |
| 13 | **cancelled transactions** | Operational | `orders` | `order_status` | 9,510 | 100,200 | 9.491% | `Medium` |
| 14 | **inconsistent units** | Consistency | `menu_items` | `prep_time_minutes, shelf_life_days` | 12 | 150 | 8.0% | `Medium` |
| 15 | **invalid location references** | Integrity | `wastage` | `location_id` | 30 | 50,000 | 0.06% | `High` |

## 3. Deep-Dive Analysis & Recommended Remediation

### 1. Missing Values (`DQ-001`)
- **Category:** Completeness  
- **Impacted Table / Columns:** `customers / orders` -> `email, phone_number, table_number`  
- **Detected Violations:** `61,316` out of `200,200` records (`30.627%` error rate)  
- **Severity:** `Medium`  
- **Detailed Finding:** Identified 1,478 missing customer emails, 1,990 missing phone numbers, and 57,848 unrecorded dine-in table numbers.  
- **Remediation Strategy (ETL Cleanse):** Impute fallback values ('GUEST', 'UNKNOWN_TABLE') and preserve nulls in non-mandatory contact fields.  

### 2. Duplicate Orders (`DQ-002`)
- **Category:** Uniqueness  
- **Impacted Table / Columns:** `orders` -> `order_id`  
- **Detected Violations:** `200` out of `100,200` records (`0.2%` error rate)  
- **Severity:** `Critical`  
- **Detailed Finding:** Detected 200 exact duplicate order headers injected for Spark deduplication validation.  
- **Remediation Strategy (ETL Cleanse):** Apply PySpark dropDuplicates(subset=['order_id']) keeping the first valid occurrence.  

### 3. Duplicate Order-Line Records (`DQ-003`)
- **Category:** Uniqueness  
- **Impacted Table / Columns:** `order_items` -> `order_item_id`  
- **Detected Violations:** `1,500` out of `1,001,500` records (`0.15%` error rate)  
- **Severity:** `Critical`  
- **Detailed Finding:** Found 1,500 duplicate order line records causing inflated item subtotal calculations.  
- **Remediation Strategy (ETL Cleanse):** Apply dropDuplicates(subset=['order_item_id']) prior to financial aggregation.  

### 4. Invalid Menu Prices (`DQ-004`)
- **Category:** Validity  
- **Impacted Table / Columns:** `menu_items` -> `base_price, cost_price`  
- **Detected Violations:** `8` out of `150` records (`5.333%` error rate)  
- **Severity:** `High`  
- **Detailed Finding:** Identified 8 menu items with negative prices, zero prices, or negative margins where cost exceeds selling price.  
- **Remediation Strategy (ETL Cleanse):** Quarantine negative prices and recalibrate selling price based on category target margin (cost / (1 - margin)).  

### 5. Negative Quantities (`DQ-005`)
- **Category:** Validity  
- **Impacted Table / Columns:** `order_items` -> `quantity`  
- **Detected Violations:** `50` out of `1,001,500` records (`0.005%` error rate)  
- **Severity:** `High`  
- **Detailed Finding:** Found 50 order items with negative quantities (-1) representing erroneous returns or data entry bugs.  
- **Remediation Strategy (ETL Cleanse):** Filter or convert to absolute values if confirmed return or route to returns quarantine table.  

### 6. Invalid Dates (`DQ-006`)
- **Category:** Validity  
- **Impacted Table / Columns:** `orders` -> `order_date`  
- **Detected Violations:** `25` out of `100,200` records (`0.025%` error rate)  
- **Severity:** `High`  
- **Detailed Finding:** Identified 25 orders with future dates (e.g. 2026-08-20) or impossible calendar dates (2025-02-31).  
- **Remediation Strategy (ETL Cleanse):** Quarantine invalid dates and parse with Spark to_date(..., 'yyyy-MM-dd') rejecting non-conforming rows.  

### 7. Invalid Ratings (`DQ-007`)
- **Category:** Validity  
- **Impacted Table / Columns:** `ratings` -> `overall_rating`  
- **Detected Violations:** `45` out of `100,300` records (`0.045%` error rate)  
- **Severity:** `Medium`  
- **Detailed Finding:** Found 45 ratings outside the allowed 1 to 5 Likert rating scale (scores of 0 or 6).  
- **Remediation Strategy (ETL Cleanse):** Clip ratings to boundaries [1, 5] or discard corrupted records during sentiment ETL.  

### 8. Missing Customer Ids (`DQ-008`)
- **Category:** Completeness  
- **Impacted Table / Columns:** `orders` -> `customer_id`  
- **Detected Violations:** `4,017` out of `100,200` records (`4.009%` error rate)  
- **Severity:** `Low`  
- **Detailed Finding:** Identified 4,017 orders without customer ID (anonymous walk-in/guest transactions).  
- **Remediation Strategy (ETL Cleanse):** Assign surrogate guest customer ID 'CUST-GUEST' to enable cohort tracking without dropping orders.  

### 9. Missing Menu Ids (`DQ-009`)
- **Category:** Completeness  
- **Impacted Table / Columns:** `order_items` -> `item_id`  
- **Detected Violations:** `35` out of `1,001,500` records (`0.003%` error rate)  
- **Severity:** `Critical`  
- **Detailed Finding:** Detected 35 order-line items with missing/null item IDs, preventing item-level margin analysis.  
- **Remediation Strategy (ETL Cleanse):** Quarantine records with null item_id for pos log reconciliation.  

### 10. Invalid Restaurant Ids (`DQ-010`)
- **Category:** Integrity  
- **Impacted Table / Columns:** `orders` -> `location_id`  
- **Detected Violations:** `30` out of `100,200` records (`0.03%` error rate)  
- **Severity:** `Critical`  
- **Detailed Finding:** Found 30 orders referencing invalid restaurant IDs ('LOC-999') not present in the master restaurants table.  
- **Remediation Strategy (ETL Cleanse):** Filter out non-matching foreign keys using Left Anti Join quarantine before location reporting.  

### 11. Impossible Wastage Quantities (`DQ-011`)
- **Category:** Validity  
- **Impacted Table / Columns:** `wastage` -> `quantity_wasted`  
- **Detected Violations:** `25` out of `50,000` records (`0.05%` error rate)  
- **Severity:** `High`  
- **Detailed Finding:** Found 25 wastage records with impossible quantities (e.g. 9,999 units or negative wastage).  
- **Remediation Strategy (ETL Cleanse):** Cap wastage quantities using interquartile range (IQR) or quarantine records exceeding max daily production limit.  

### 12. Incorrect Discounts (`DQ-012`)
- **Category:** Consistency  
- **Impacted Table / Columns:** `orders` -> `discount_amount, subtotal_amount`  
- **Detected Violations:** `40` out of `100,200` records (`0.04%` error rate)  
- **Severity:** `High`  
- **Detailed Finding:** Identified 40 orders where discount amount exceeded total order subtotal or was negative.  
- **Remediation Strategy (ETL Cleanse):** Recalculate discount based on promotion cap: discount = least(discount_amount, subtotal_amount, max_discount).  

### 13. Cancelled Transactions (`DQ-013`)
- **Category:** Operational  
- **Impacted Table / Columns:** `orders` -> `order_status`  
- **Detected Violations:** `9,510` out of `100,200` records (`9.491%` error rate)  
- **Severity:** `Medium`  
- **Detailed Finding:** Identified 9,510 cancelled and refunded transactions mixed into raw sales data.  
- **Remediation Strategy (ETL Cleanse):** Separate cancelled orders into operational cancellation audit tables and exclude from net revenue metrics.  

### 14. Inconsistent Units (`DQ-014`)
- **Category:** Consistency  
- **Impacted Table / Columns:** `menu_items` -> `prep_time_minutes, shelf_life_days`  
- **Detected Violations:** `12` out of `150` records (`8.0%` error rate)  
- **Severity:** `Medium`  
- **Detailed Finding:** Found 12 menu items with negative prep time (-10 min) or unrealistically high shelf life (9,999 days).  
- **Remediation Strategy (ETL Cleanse):** Impute median category prep time and clamp shelf life to standard culinary thresholds (1 to 90 days).  

### 15. Invalid Location References (`DQ-015`)
- **Category:** Integrity  
- **Impacted Table / Columns:** `wastage` -> `location_id`  
- **Detected Violations:** `30` out of `50,000` records (`0.06%` error rate)  
- **Severity:** `High`  
- **Detailed Finding:** Detected 30 wastage records referencing unmapped location ID 'LOC-404'.  
- **Remediation Strategy (ETL Cleanse):** Route unmapped location logs to inventory staging buffer and send alerts for master location mapping.  

## 4. Remediation & Spark Cleaning Roadmap

1. **Deduplication Phase:** Execute `dropDuplicates(['order_id'])` and `dropDuplicates(['order_item_id'])` to eliminate duplicate revenue counting.
2. **Referential Integrity Quarantine:** Filter records with unmapped `location_id` or `item_id` using PySpark Left Anti Joins into `processed_data/quarantine/`.
3. **Value Clipping & Date Normalization:** Filter or correct future dates, negative quantities, invalid prices, and Likert ratings outside [1, 5].
4. **Imputation & Default Handling:** Fill null customer references with guest surrogates (`CUST-GUEST`) and clamp discounts to order subtotal caps.
