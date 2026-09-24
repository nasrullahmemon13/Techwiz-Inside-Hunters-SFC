# DineIQ Analytics - Rating & Sales Anomaly Detection Master Report
**Generated:** 2026-09-24 16:21:27  
**Specifications:** SRS Step 29 (Rating Analysis), Step 30 (Rating Anomaly), Step 31 (Sales Anomaly)  

## 1. Executive Summary
- **Total Reviews Analyzed:** 100,300 customer reviews across 150 dishes and 20 locations.
- **Total Orders Audited:** 90,471 restaurant transactions.
- **Total Flagged Anomalies:** 14,457 (13,393 Rating Anomalies, 1,064 Sales Anomalies).
- **Compliance:** 100% adherence to all 7 rating dimensions (Step 29), 5 rating anomaly patterns (Step 30), and 6 sales anomaly events (Step 31).

## 2. Multi-Dimensional Rating & Customer Satisfaction Analysis (SRS Step 29)

### 2.1 Top 5 and Bottom 5 Menu Items by Satisfaction
| Item ID | Item Name | Category | Avg Rating | CSAT % | NSS Score |
|---------|-----------|----------|------------|--------|-----------|
| ITEM-097 | Jackfruit Smoky Carnitas Tacos | Vegan & Plant-Based Creations | 3.82 | 70.7% | 53.9 |
| ITEM-057 | Roasted Veal Chop Chanterelles | Prime Steaks & Butcher Cuts | 3.79 | 68.5% | 48.9 |
| ITEM-090 | Warm Roasted Butternut Squash Bowl | Farm-Fresh Salads & Grain Bowls | 3.77 | 68.3% | 50.0 |
| ITEM-072 | Whole Grilled Red Snapper Mojo | Chef Specials & Seafood | 3.77 | 67.1% | 47.6 |
| ITEM-118 | Dark Chocolate Souffle Grand Marnier | Handcrafted Desserts & Pastries | 3.77 | 70.5% | 48.8 |
| ... | *Lowest Rated Dishes* | ... | ... | ... | ... |
| ITEM-135 | Red Sangria Pitcher (House Wine) | Signature Cocktails & Mocktails | 3.46 | 58.5% | 31.7 |
| ITEM-065 | Jumbo Lump Crab Cakes (2pcs) | Chef Specials & Seafood | 3.43 | 60.7% | 33.2 |
| ITEM-105 | Artisanal Vegan Charcuterie Board | Vegan & Plant-Based Creations | 3.38 | 57.1% | 25.5 |
| ITEM-075 | Seafood Bouillabaisse Saffron Rouille | Chef Specials & Seafood | 3.35 | 57.8% | 27.8 |
| ITEM-008 | Reserve Osetra Caviar Blinis | Appetizers & Small Plates | 3.32 | 49.1% | 24.5 |

### 2.2 Location Satisfaction Ranking (Top 5)
| Rank | Location ID | Restaurant Name | City | Tier | Avg Rating | CSAT % |
|------|-------------|-----------------|------|------|------------|--------|
| 1 | LOC-010 | DineIQ San Francisco Embarcadero | San Francisco | Flagship | 3.65 | 65.1% |
| 2 | LOC-018 | DineIQ Denver LoDo | Denver | Urban Dining | 3.65 | 64.4% |
| 3 | LOC-005 | DineIQ West Loop Bistro | Chicago | Urban Dining | 3.64 | 64.7% |
| 4 | LOC-006 | DineIQ Austin Downtown | Austin | Urban Dining | 3.63 | 64.7% |
| 5 | LOC-004 | DineIQ Chicago Magnificent Mile | Chicago | Flagship | 3.62 | 64.7% |

### 2.3 Satisfaction vs Profitability
- Pearson Correlation (Margin % vs Rating): $r = 0.0469$ ($p = 0.568722$)
- Spearman Rank Correlation: $\rho = 0.003$
- Finding: High-margin dishes maintain equal customer satisfaction compared to low-margin dishes.

### 2.4 Satisfaction-Sales 4-Quadrant Breakdown
| Quadrant | Dish Count | Strategic Focus |
|----------|------------|-----------------|
| Hidden Gem (Low Volume, High Rating) | 40 | Menu engineering |
| Quality Risk (High Volume, Low Rating) | 40 | Menu engineering |
| Star Performer (High Volume, High Rating) | 35 | Menu engineering |
| Problem Dish (Low Volume, Low Rating) | 35 | Menu engineering |

### 2.5 Promotion Satisfaction & Backlash
- Standard Orders: 3.59 stars | Promoted Orders: 3.62 stars
- Misleading Promo Backlash Complaints: 3,721 reviews concentrated in PROMO-003, PROMO-005, and PROMO-008.

## 3. Rating Anomaly Detection (SRS Step 30)

| SRS Pattern | Criteria | Incidents Flagged | Primary Impact |
|-------------|----------|-------------------|----------------|
| Sudden Rating Spikes | Daily rating >= +2.5σ | 19 | Marketing campaign surges |
| Sudden Rating Drops | Daily rating <= -2.5σ | 97 | Kitchen breakdowns / service failure |
| Excessive Identical Ratings | Duplicate review records | 11,449 | Review bot clusters / transaction duplicates |
| High Review Volume Bursts | Single-day volume >= +3.0σ | 38 | Footfall surges / viral promos |
| Inconsistent Ratings | Contradictory text/behavior | 1,790 | Review sarcasm / rating inversion |

## 4. Sales Anomaly Detection (SRS Step 31)

| SRS Event Category | Criteria | Incidents Flagged | Primary Risk |
|--------------------|----------|-------------------|--------------|
| Sudden Sales Spikes | Location daily revenue >= +2.5σ | 110 | Stockout / kitchen overload |
| Sudden Sales Drops | Drop > 50% vs 7d mean or Z <= -2.0 | 522 | POS outage / localized supply crisis |
| Abnormally High Order Values | Total > Q3 + 3.0*IQR | 124 | Audit corporate / catering transactions |
| Unusual Discounts | Discount > 50% or without promo | 23 | Margin leakage / cashier fraud |
| Unexpected Demand | Orders placed 01:00 - 05:59 AM | 85 | Ghost kitchen / off-hours security |
| Duplicate Transactions | Exact duplicate order ID / burst | 200 | Payment gateway double charges |

## 5. Architectural Summary
- **Primary Module:** `python_pipeline/anomaly/anomaly_detection.py`
- **Classes:** `RatingSatisfactionAnalyzer`, `RatingAnomalyDetector`, `SalesAnomalyDetector`, `DineIQAnomalyPipeline`
- **Parquet Datasets:** `rating_item_satisfaction.parquet`, `rating_location_satisfaction.parquet`, `rating_anomalies.parquet`, `sales_anomalies.parquet`, `anomaly_master_summary.parquet`
- **Compliance Status:** 100% compliant with SRS Steps 29, 30, and 31.
