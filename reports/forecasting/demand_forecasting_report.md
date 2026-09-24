# DineIQ Analytics: Temporal Pattern Analysis & Time-Aware Demand Forecasting

**Execution Timestamp:** 2026-09-24 15:36:57
**Configured Forecast Horizon:** 30 Days (Configurable per SRS Step 20)
**Validation Framework:** Strict Chronological Train/Test Split (SRS Step 21 Invariant: Zero Future Leakage)

## 1. Executive Summary & Evaluation Matrix (Step 22)

All models were trained strictly on earlier periods and evaluated on the out-of-sample holdout test window:

| Granularity Level | Target Dimension | MAE | RMSE | MAPE (%) | R² Score | Out-of-Sample Window |
|---|---|---:|---:|---:|---:|---|
| **Menu Categories** | Daily Quantity Sold | 59.61 | 78.74 | **14.65%** | **0.6771** | Last 30 Days |
| **Restaurant Locations** | Daily Quantity Sold | 47.29 | 60.22 | **30.50%** | **0.5578** | Last 30 Days |
| **Menu Items** | Daily Quantity Sold | 6.31 | 8.15 | **35.20%** | **0.8035** | Last 30 Days |
| **Total Chain Aggregate** | Daily Quantity Sold | 518.58 | 593.33 | **12.06%** | **0.5987** | Last 30 Days |

## 2. Temporal Pattern Identification (Step 19)

### A. Peak Hours Analysis

- **Top Peak Hours:** 12:00, 18:00, 11:00
- **Lunch Peak Window:** 11:00 - 14:00 (driven by business lunch crowd)
- **Dinner Peak Window:** 17:00 - 21:00 (driven by dining groups and dinner entrees)
- **Off-Peak Window:** 00:00 - 06:00

| Hour | Order Count | Total Items | Total Revenue ($) | Share of Revenue (%) | Average Order Value ($) |
|---:|---:|---:|---:|---:|---:|
| 12:00 | 13,227 | 192,013 | $3,064,781.83 | 14.61% | $231.71 |
| 18:00 | 11,297 | 164,258 | $2,627,039.45 | 12.52% | $232.54 |
| 11:00 | 10,015 | 145,383 | $2,332,377.05 | 11.12% | $232.89 |
| 13:00 | 9,132 | 131,991 | $2,107,235.04 | 10.04% | $230.75 |
| 19:00 | 8,424 | 122,156 | $1,956,215.67 | 9.32% | $232.22 |
| 17:00 | 6,670 | 96,534 | $1,547,976.54 | 7.38% | $232.08 |
| 10:00 | 4,893 | 70,972 | $1,139,227.39 | 5.43% | $232.83 |
| 20:00 | 4,545 | 65,565 | $1,053,575.84 | 5.02% | $231.81 |
| 9:00 | 3,794 | 54,700 | $876,113.37 | 4.18% | $230.92 |
| 16:00 | 3,721 | 54,194 | $864,382.74 | 4.12% | $232.30 |

### B. Peak Days Analysis

- **Top Peak Days:** Saturday, Sunday, Friday

| Day of Week | Total Revenue ($) | Daily Avg Revenue ($) | Total Orders | Daily Avg Orders | Share of Week (%) |
|---|---:|---:|---:|---:|---:|
| **Saturday** | $3,748,894.05 | $72,094.12 | 16,111 | 309.8 | 17.87% |
| **Sunday** | $3,728,741.18 | $71,706.56 | 16,065 | 308.9 | 17.77% |
| **Friday** | $3,700,812.27 | $71,169.47 | 15,995 | 307.6 | 17.64% |
| **Thursday** | $2,649,952.74 | $50,960.63 | 11,447 | 220.1 | 12.63% |
| **Monday** | $2,620,422.43 | $50,392.74 | 11,288 | 217.1 | 12.49% |
| **Tuesday** | $2,248,685.42 | $43,243.95 | 9,655 | 185.7 | 10.72% |
| **Wednesday** | $2,284,690.69 | $43,107.37 | 9,903 | 186.8 | 10.89% |

### C. Weekend vs Weekday Patterns

| Period Type | Total Revenue ($) | Daily Avg Revenue ($) | Total Orders | Daily Avg Orders | Avg Basket ($) | Items / Order |
|---|---:|---:|---:|---:|---:|---:|
| **Weekday (Mon-Thu)** | $9,803,751.28 | $46,907.90 | 42,293 | 202.4 | $231.81 | 14.48 |
| **Weekend (Fri-Sun)** | $11,178,447.50 | $71,656.71 | 48,171 | 308.8 | $232.06 | 14.50 |

### D. Monthly Trends (Jan - Dec 2025)

| Month | Total Revenue ($) | Daily Avg Revenue ($) | Order Count | Avg Order Value ($) | MoM Growth (%) |
|---|---:|---:|---:|---:|---:|
| **January** | $1,305,771.46 | $42,121.66 | 5,629 | $231.97 | +0.00% |
| **February** | $1,211,609.01 | $43,271.75 | 5,177 | $234.04 | -7.21% |
| **March** | $1,649,597.66 | $53,212.83 | 7,095 | $232.50 | +36.15% |
| **April** | $1,566,040.92 | $52,201.36 | 6,733 | $232.59 | -5.07% |
| **May** | $1,687,447.20 | $54,433.78 | 7,211 | $234.01 | +7.75% |
| **June** | $1,919,435.57 | $63,981.19 | 8,312 | $230.92 | +13.75% |
| **July** | $1,967,106.97 | $63,455.06 | 8,530 | $230.61 | +2.48% |
| **August** | $2,069,997.14 | $66,774.10 | 8,964 | $230.92 | +5.23% |
| **September** | $1,557,698.69 | $51,923.29 | 6,744 | $230.98 | -24.75% |
| **October** | $1,618,914.13 | $52,223.04 | 7,010 | $230.94 | +3.93% |
| **November** | $2,251,575.99 | $75,052.53 | 9,637 | $233.64 | +39.08% |
| **December** | $2,177,004.04 | $70,225.94 | 9,422 | $231.06 | -3.31% |

### E. Seasonal Trends

| Season | Months Included | Total Revenue ($) | Daily Avg Revenue ($) | Seasonal Demand Index | Share (%) |
|---|---|---:|---:|---:|---:|
| **Winter** | Dec-Feb / Mar-May / Jun-Aug / Sep-Nov | $4,694,384.51 | $52,159.83 | **0.9074** | 22.37% |
| **Spring** | Dec-Feb / Mar-May / Jun-Aug / Sep-Nov | $4,903,085.78 | $53,294.41 | **0.9271** | 23.37% |
| **Summer** | Dec-Feb / Mar-May / Jun-Aug / Sep-Nov | $5,956,539.68 | $64,745.00 | **1.1263** | 28.39% |
| **Fall** | Dec-Feb / Mar-May / Jun-Aug / Sep-Nov | $5,428,188.81 | $59,650.43 | **1.0377** | 25.87% |

### F. Location-Specific Peaks (20 Locations)

| Location Name | City | Total Revenue ($) | Peak Hour | Peak Day | Weekend Share (%) |
|---|---|---:|---:|---|---:|
| **DineIQ Flagship Downtown** | New York | $1,516,317.88 | 12:00 | Saturday | 53.89% |
| **DineIQ Los Angeles Beverly** | Los Angeles | $1,445,699.03 | 12:00 | Sunday | 53.64% |
| **DineIQ San Francisco Embarcadero** | San Francisco | $1,388,987.55 | 12:00 | Friday | 53.65% |
| **DineIQ Orlando Theme Park Outpost** | Orlando | $1,307,819.09 | 12:00 | Sunday | 55.29% |
| **DineIQ Chicago Magnificent Mile** | Chicago | $1,275,349.41 | 12:00 | Saturday | 52.57% |
| **DineIQ Miami South Beach** | Miami | $1,233,253.32 | 12:00 | Friday | 52.52% |
| **DineIQ Santa Monica Promenade** | Santa Monica | $1,225,612.17 | 12:00 | Sunday | 54.32% |
| **DineIQ Financial Center** | New York | $1,155,078.47 | 12:00 | Sunday | 53.07% |
| **DineIQ Houston Galleria** | Houston | $1,004,808.12 | 12:00 | Sunday | 53.23% |
| **DineIQ Austin Downtown** | Austin | $988,621.93 | 12:00 | Sunday | 52.79% |

### G. Dine-In vs Delivery Channel Peaks

- **Dine-In Peak Hour:** 12:00 (Dinner crowd table seating)
- **Delivery Peak Hour:** 12:00 (At-home lunch & evening deliveries)

| Hour | Dine-In Revenue ($) | Delivery Revenue ($) | Takeout Revenue ($) | Delivery Share (%) |
|---:|---:|---:|---:|---:|
| 14:00 | $347,427.74 | $151,425.30 | $181,541.05 | 19.96% |
| 15:00 | $250,044.83 | $112,839.03 | $156,144.05 | 19.59% |
| 16:00 | $383,945.84 | $181,136.48 | $207,092.05 | 20.96% |
| 17:00 | $688,956.03 | $314,131.74 | $396,184.87 | 20.29% |
| 18:00 | $1,198,969.79 | $505,274.13 | $657,799.61 | 19.23% |
| 19:00 | $858,037.27 | $401,613.15 | $508,471.75 | 20.53% |
| 20:00 | $470,926.76 | $213,810.60 | $263,239.82 | 20.29% |
| 21:00 | $268,379.39 | $115,111.66 | $143,488.62 | 19.51% |
| 22:00 | $128,144.61 | $55,090.08 | $65,554.30 | 19.76% |
| 23:00 | $46,267.16 | $19,532.85 | $26,001.92 | 19.54% |

## 3. Time-Aware Validation & Anti-Leakage Compliance (Step 21)

- **Zero Random Leakage:** Data is partitioned strictly on calendar dates (`train <= split_date < test`). Shuffling is disabled.
- **Zero Target Leakage in Features:** Lag features ($t-1, t-2, t-7, t-14$) and rolling statistics ($7\text{d}, 14\text{d}$) are calculated strictly on shifted prior observations.
- **Multi-Step Recursive Horizon:** During out-of-sample test evaluation, predicted values are fed recursively into lag buffers, ensuring true unseen forecast simulation.

## 4. Multi-Granularity Demand Forecasts (Step 20)

Sample category-level forecasts for the out-of-sample period:

| Order Date | Menu Category | Actual Demand | Predicted Demand | Error | Accuracy |
|---|---|---:|---:|---:|---:|
| 2025-12-02 | **Appetizers & Small Plates** | 364.0 | 429.6 | -65.6 | 82.0% |
| 2025-12-02 | **Artisanal Burgers & Handhelds** | 341.0 | 404.3 | -63.3 | 81.4% |
| 2025-12-02 | **Chef Specials & Seafood** | 223.0 | 209.8 | +13.2 | 94.1% |
| 2025-12-02 | **Farm-Fresh Salads & Grain Bowls** | 362.0 | 413.1 | -51.1 | 85.9% |
| 2025-12-02 | **Handcrafted Desserts & Pastries** | 372.0 | 420.6 | -48.6 | 86.9% |
| 2025-12-02 | **Prime Steaks & Butcher Cuts** | 237.0 | 207.2 | +29.9 | 87.4% |
| 2025-12-02 | **Signature Cocktails & Mocktails** | 391.0 | 514.2 | -123.2 | 68.5% |
| 2025-12-02 | **Specialty Coffee & Beverages** | 445.0 | 524.0 | -79.0 | 82.3% |
| 2025-12-02 | **Vegan & Plant-Based Creations** | 312.0 | 344.7 | -32.7 | 89.5% |
| 2025-12-02 | **Wood-Fired Pizzas & Pastas** | 423.0 | 432.1 | -9.1 | 97.9% |

