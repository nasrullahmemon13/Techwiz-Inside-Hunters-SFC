# DineIQ Analytics: Food Wastage Analysis & Predictive Risk Modeling

**Execution Timestamp:** 2026-09-24 15:43:30
**Total Wastage Incidents Analyzed:** 49,945 records
**Total Financial Loss Evaluated:** $3,247,970.00

## 1. Executive Summary & Step 24 Model Performance

Predictive models were trained using a strict chronological split (unseen 30-day out-of-sample test window):

| Model Type | Target Variable | Primary Metric | Secondary Metric | Out-of-Sample Window |
|---|---|---|---|---|
| **Gradient Boosted Regressor** | Continuous Units Wasted | MAE: **0.987** | RMSE: **1.366** (R²: 0.4143) | Last 30 Days |
| **Gradient Boosted Classifier** | High Wastage Risk (≥3 Units) | ROC-AUC: **0.9659** | F1: **0.7925** (Acc: 93.8%) | Last 30 Days |

### Predictor Feature Importance Ranking (All 9 SRS Variables)

| Rank | Predictor Variable (SRS Required) | Relative Importance (%) | Operational Rationale |
|---:|---|---:|---|
| 1 | `historical_wastage_7d` | **95.28%** | Directly governs kitchen batch prep buffer vs consumption |
| 2 | `popularity_weight` | **1.86%** | Directly governs kitchen batch prep buffer vs consumption |
| 3 | `historical_demand_7d` | **0.79%** | Directly governs kitchen batch prep buffer vs consumption |
| 4 | `preparation_quantity` | **0.60%** | Directly governs kitchen batch prep buffer vs consumption |
| 5 | `location_code` | **0.60%** | Directly governs kitchen batch prep buffer vs consumption |
| 6 | `is_promo_active` | **0.34%** | Directly governs kitchen batch prep buffer vs consumption |
| 7 | `dow_code` | **0.34%** | Directly governs kitchen batch prep buffer vs consumption |
| 8 | `forecast_demand` | **0.20%** | Directly governs kitchen batch prep buffer vs consumption |
| 9 | `season_code` | **0.00%** | Directly governs kitchen batch prep buffer vs consumption |

## 2. Multi-Dimensional Wastage Analysis (Step 23 - All 9 Dimensions)

### 1. By Menu Item (Top 10 Highest Financial Loss Dishes)

| Rank | Menu Item | Category | Wasted Units | Total Loss ($) | Avg Loss / Incident ($) | Wastage Rate (%) |
|---:|---|---|---:|---:|---:|---:|
| 1 | **Butter Poached Maine Lobster Tail** | Chef Specials & Seafood | 9,564 | **$224,754.00** | $165.63 | 45.69% |
| 2 | **Seafood Bouillabaisse Saffron Rouille** | Chef Specials & Seafood | 9,215 | **$152,047.50** | $116.16 | 45.23% |
| 3 | **Seared Diver Scallops Sweet Corn** | Chef Specials & Seafood | 8,933 | **$150,074.40** | $117.52 | 46.26% |
| 4 | **Whole Grilled Red Snapper Mojo** | Chef Specials & Seafood | 8,505 | **$148,837.50** | $121.60 | 41.76% |
| 5 | **Crispy Skin Mediterranean Branzino** | Chef Specials & Seafood | 8,631 | **$138,096.00** | $112.27 | 42.73% |
| 6 | **Seafood Paella Valenciana** | Chef Specials & Seafood | 8,465 | **$135,440.00** | $111.38 | 42.04% |
| 7 | **Grilled Yellowfin Ahi Tuna Steak** | Chef Specials & Seafood | 8,832 | **$130,713.60** | $103.91 | 40.79% |
| 8 | **Jumbo Lump Crab Cakes (2pcs)** | Chef Specials & Seafood | 7,916 | **$118,740.00** | $104.34 | 41.97% |
| 9 | **Linguine alle Vongole (Clams)** | Wood-Fired Pizzas & Pastas | 9,147 | **$109,764.00** | $84.24 | 40.14% |
| 10 | **Wild Alaskan Salmon Tartare** | Appetizers & Small Plates | 9,217 | **$105,995.50** | $81.66 | 41.79% |

### 2. By Menu Category

| Menu Category | Total Loss ($) | Loss Share (%) | Wasted Units | Incidents |
|---|---:|---:|---:|---:|
| **Chef Specials & Seafood** | $1,470,251.50 | **45.27%** | 92,618 | 13,646 |
| **Wood-Fired Pizzas & Pastas** | $387,519.30 | **11.93%** | 37,943 | 5,914 |
| **Appetizers & Small Plates** | $342,840.55 | **10.56%** | 34,688 | 5,562 |
| **Farm-Fresh Salads & Grain Bowls** | $267,331.10 | **8.23%** | 34,362 | 5,639 |
| **Prime Steaks & Butcher Cuts** | $236,913.20 | **7.29%** | 11,485 | 2,496 |
| **Artisanal Burgers & Handhelds** | $220,988.40 | **6.80%** | 24,724 | 4,202 |
| **Handcrafted Desserts & Pastries** | $110,469.00 | **3.40%** | 25,384 | 4,257 |
| **Vegan & Plant-Based Creations** | $108,681.40 | **3.35%** | 17,378 | 3,147 |
| **Specialty Coffee & Beverages** | $88,888.15 | **2.74%** | 27,518 | 4,053 |
| **Signature Cocktails & Mocktails** | $14,087.40 | **0.43%** | 4,718 | 1,029 |

### 3. By Restaurant Location (Top 10 High-Loss Locations)

| Restaurant Name | City | Tier | Total Loss ($) | Wasted Units | Wastage Rate (%) |
|---|---|---|---:|---:|---:|
| **DineIQ Boston Back Bay** | Boston | Historic Urban | $169,904.70 | 16,127 | 15.67% |
| **DineIQ West Loop Bistro** | Chicago | Urban Dining | $168,167.10 | 15,726 | 15.60% |
| **DineIQ San Francisco Embarcadero** | San Francisco | Flagship | $167,616.20 | 15,984 | 15.45% |
| **DineIQ Flagship Downtown** | New York | Flagship | $165,596.15 | 16,054 | 15.40% |
| **DineIQ Los Angeles Beverly** | Los Angeles | Flagship | $165,491.35 | 16,007 | 15.71% |
| **DineIQ Dallas Arts District** | Dallas | Urban Dining | $164,796.50 | 15,611 | 15.03% |
| **DineIQ Houston Galleria** | Houston | Suburban Mall | $163,835.80 | 15,631 | 15.42% |
| **DineIQ Miami South Beach** | Miami | Coastal Boardwalk | $163,460.95 | 15,785 | 15.82% |
| **DineIQ Financial Center** | New York | Urban Corporate | $163,071.25 | 15,370 | 15.27% |
| **DineIQ Austin Downtown** | Austin | Urban Dining | $162,681.55 | 15,331 | 15.15% |

### 4. By Day of Week

| Day of Week | Total Loss ($) | Daily Avg Loss ($) | Loss Share (%) | Daily Avg Wasted Units |
|---|---:|---:|---:|---:|
| **Monday** | $466,821.00 | $8,977.33 | 14.37% | 852.1 |
| **Thursday** | $465,375.75 | $8,949.53 | 14.33% | 844.9 |
| **Tuesday** | $463,813.00 | $8,919.48 | 14.28% | 856.6 |
| **Wednesday** | $471,522.35 | $8,896.65 | 14.52% | 860.5 |
| **Sunday** | $462,481.30 | $8,893.87 | 14.24% | 847.0 |
| **Saturday** | $460,579.00 | $8,857.29 | 14.18% | 851.1 |
| **Friday** | $457,377.60 | $8,795.72 | 14.08% | 848.5 |

### 5. By Time Period (Kitchen Shifts & Root Causes)

| Shift Period | Total Loss ($) | Share (%) | Incidents | Primary Root Cause Driver |
|---|---:|---:|---:|---|
| **Night Closing Shift** | $1,611,922.45 | 49.63% | 24,750 | Overproduction unsold & prep expiration |
| **Afternoon Restock Shift** | $823,723.10 | 25.36% | 12,651 | Overproduction unsold & prep expiration |
| **Lunch Service Shift** | $812,324.45 | 25.01% | 12,544 | Overproduction unsold & prep expiration |

### 6. By Demand Levels (Sales Volume Quartiles)

| Demand Quartile | Snapshots | Avg Daily Sold | Avg Daily Wasted | Wastage Rate (%) | Demand/Waste Ratio |
|---|---:|---:|---:|---:|---:|
| **Low Demand (Q1)** | 6,514 | 25.9 | 1.57 | **5.71%** | 16.5x |
| **Moderate Demand (Q2)** | 6,654 | 49.8 | 1.57 | **3.06%** | 31.7x |
| **High Demand (Q3)** | 6,351 | 76.2 | 1.57 | **2.02%** | 48.6x |
| **Peak Demand (Q4)** | 6,481 | 113.1 | 1.56 | **1.36%** | 72.5x |

### 7. By Inventory Consumption & Stock Status

| Stock Status | Snapshots | Consumption Ratio (%) | Inventory Wastage Rate (%) | Avg Ending Stock |
|---|---:|---:|---:|---:|
| **CRITICAL_OUT_OF_STOCK** | 599 | 96.80% | **3.25%** | 0.0 |
| **OPTIMAL** | 19,411 | 97.57% | **1.08%** | 78.4 |
| **REORDER_TRIGGERED** | 5,990 | 98.05% | **1.65%** | 15.0 |

### 8. By Promotion Activity

| Promo Status | Snapshots | Total Units Sold | Total Units Wasted | Wastage Rate (%) | Overproduction Surge |
|---|---:|---:|---:|---:|---:|
| **Active Promotion** | 8,500 | 561,475 | 13,306 | 2.31% | **1.00x** |
| **Standard Non-Promo** | 17,500 | 1,155,556 | 27,446 | 2.32% | **1.00x** |

### 9. By Preparation Quantity & Over-Prep Index

| Preparation Batch Tier | Snapshots | Avg Batch Prepped | Avg Units Wasted | Over-Prep Index (%) | Prep Waste Rate (%) |
|---|---:|---:|---:|---:|---:|
| **Low Prep (<80)** | 6,592 | 74.8 | 1.58 | **39.72%** | 2.12% |
| **Standard Prep (80-120)** | 6,493 | 113.4 | 1.57 | **43.29%** | 1.38% |
| **High Prep (120-160)** | 6,487 | 145.9 | 1.54 | **46.70%** | 1.05% |
| **Excess Prep (>160)** | 6,428 | 185.6 | 1.58 | **58.26%** | 0.85% |

## 3. High-Risk Operational Early-Warning Alerts (Step 24)

Sample proactive operational mitigation recommendations generated for high-risk item batches:

| Snapshot Date | Location | Menu Item | Prepped | Sold | Wasted (Act) | Predicted Wasted | Risk Prob | Operational Mitigation Strategy |
|---|---|---|---:|---:|---:|---:|---:|---|
| 2025-12-03 | `LOC-001` | **Wild Alaskan Salmon Tartare** | 132 | 112 | 8 | **3.2** | 76.4% | URGENT: Reduce planned morning prep batch by 25%; launch 15% flash happy hour discount to clear inventory. |
| 2025-12-17 | `LOC-001` | **Wild Alaskan Salmon Tartare** | 146 | 115 | 1 | **2.9** | 61.7% | MODERATE: Trim prep buffer by 10%; bundle as lunch cross-sell combo item. |
| 2025-12-24 | `LOC-001` | **Wild Alaskan Salmon Tartare** | 124 | 99 | 7 | **3.0** | 61.4% | MODERATE: Trim prep buffer by 10%; bundle as lunch cross-sell combo item. |
| 2025-12-10 | `LOC-001` | **Soft-Shell Crab Sliders** | 178 | 128 | 2 | **3.2** | 58.7% | MODERATE: Trim prep buffer by 10%; bundle as lunch cross-sell combo item. |
| 2025-12-03 | `LOC-001` | **Spicy Tuna Crispy Rice** | 136 | 64 | 6 | **3.7** | 65.8% | MODERATE: Trim prep buffer by 10%; bundle as lunch cross-sell combo item. |
| 2025-12-24 | `LOC-001` | **Spicy Tuna Crispy Rice** | 186 | 121 | 0 | **3.2** | 62.5% | MODERATE: Trim prep buffer by 10%; bundle as lunch cross-sell combo item. |

