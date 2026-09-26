# DineIQ Analytics - Sales Anomaly Detection Report
**Generated:** 2026-09-26 09:51:33  
**Specification:** SRS Step 31 (Sales Anomaly Detection)  

## 1. Executive Summary
- **Detection Scope:** 90,471 validated restaurant transactions and 200 quarantined orders across 20 locations.
- **Total Flagged Anomalies:** 1,064 unusual transaction events.
- **Coverage:** 100% adherence to all 6 SRS Step 31 event categories.

## 2. Anomaly Breakdown by SRS Event Category

| SRS Event Category | Description & Threshold | Flagged Incidents | Primary Risk / Impact |
|--------------------|-------------------------|-------------------|-----------------------|
| Sudden Sales Spikes | Location daily revenue >= +2.5σ | 110 | Kitchen overload, inventory runout risk |
| Sudden Sales Drops | Daily revenue drop > 50% vs 7d mean or Z <= -2.0 | 522 | POS outage, localized supply disruption |
| Abnormally High Order Values | Total amount > Q3 + 3.0*IQR | 124 | Fraud audit, corporate catering verification |
| Unusual Discounts | Discount > 50% or discount without promo ID | 23 | Unauthorized discount leakage, cashier error |
| Unexpected Demand | Off-peak orders between 01:00 - 05:59 AM | 85 | Ghost kitchen delivery, off-hours operational risk |
| Duplicate Transactions | Exact duplicate order ID or identical order burst | 200 | Double billing, transaction gateway retry loop |

## 3. High-Priority Case Evidence

### 3.1 Top Sudden Sales Spikes
| Location ID | Date | Orders | Daily Revenue | Z-Score |
|-------------|------|--------|---------------|---------|
| LOC-018 | 2025-11-29 | 28 | $8,323.62 | +5.11 |
| LOC-013 | 2025-11-16 | 35 | $10,862.59 | +4.33 |
| LOC-002 | 2025-11-09 | 33 | $9,786.28 | +4.23 |
| LOC-020 | 2025-11-07 | 25 | $7,628.41 | +4.04 |
| LOC-009 | 2025-08-02 | 24 | $8,221.27 | +4.03 |

### 3.2 Abnormally High Order Values (Whale Orders)
| Order ID | Date | Customer ID | Location ID | Total Amount |
|----------|------|-------------|-------------|--------------|
| ORD-008913 | 2025-11-24 | CUST-46279 | LOC-012 | $1183.04 |
| ORD-087028 | 2025-03-01 | CUST-32259 | LOC-014 | $1163.41 |
| ORD-010865 | 2025-02-12 | CUST-GUEST | LOC-002 | $1137.36 |
| ORD-067459 | 2025-11-08 | CUST-21718 | LOC-002 | $1127.05 |
| ORD-029458 | 2025-11-28 | CUST-37392 | LOC-013 | $1096.94 |

### 3.3 Unusual Discounts
| Order ID | Date | Subtotal | Discount Amount | Promotion ID | Description |
|----------|------|----------|-----------------|--------------|-------------|
| ORD-000320 | 2025-04-21 | $412.44 | $412.44 | nan | Order ORD-000320: $412.44 discount (Excessive discount (100.0%), Discount without valid promotion ID) |
| ORD-000304 | 2025-09-01 | $406.49 | $406.49 | nan | Order ORD-000304: $406.49 discount (Excessive discount (100.0%), Discount without valid promotion ID) |
| ORD-000312 | 2025-02-08 | $391.66 | $391.66 | nan | Order ORD-000312: $391.66 discount (Excessive discount (100.0%), Discount without valid promotion ID) |
| ORD-000324 | 2025-05-03 | $353.74 | $353.74 | nan | Order ORD-000324: $353.74 discount (Excessive discount (100.0%), Discount without valid promotion ID) |
| ORD-000321 | 2025-08-03 | $319.96 | $319.96 | PROMO-007 | Order ORD-000321: $319.96 discount (Excessive discount (100.0%)) |

### 3.4 Duplicate Transactions
| Order ID | Date | Customer ID | Location ID | Amount | Type |
|----------|------|-------------|-------------|--------|------|
| ORD-075722 | 2025-04-17 | CUST-37825 | LOC-017 | $254.97 | Duplicate Transaction (Quarantined Exact Match) |
| ORD-080185 | 2025-02-01 | CUST-26819 | LOC-002 | $341.96 | Duplicate Transaction (Quarantined Exact Match) |
| ORD-019865 | 2025-10-25 | CUST-48614 | LOC-008 | $130.12 | Duplicate Transaction (Quarantined Exact Match) |
| ORD-076700 | 2025-11-06 | CUST-24500 | LOC-010 | $144.51 | Duplicate Transaction (Quarantined Exact Match) |
| ORD-092992 | 2025-05-02 | CUST-12388 | LOC-006 | $250.81 | Duplicate Transaction (Quarantined Exact Match) |

## 4. Architectural Summary
- **Engine Class:** `SalesAnomalyDetector`
- **Parquet Datasets:** `sales_anomalies.parquet`, `sales_anomaly_summary.parquet`
- **Compliance Status:** 100% compliant with SRS Step 31.
