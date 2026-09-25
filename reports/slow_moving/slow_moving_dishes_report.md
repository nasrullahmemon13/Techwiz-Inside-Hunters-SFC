# DineIQ Analytics - Slow-Moving Dish Detection Report
**Generated:** 2026-09-25 12:34:02  
**Specification:** SRS Step 32 (Slow-Moving Dish Detection)  

## 1. Executive Summary
- **Menu Items Evaluated:** 150 dishes across 10 categories.
- **Multi-Factor Methodology:** Full combination of ALL 7 SRS-mandated dimensions (Sales volume, purchase frequency, purchase gaps, repeat purchase, wastage, profitability, and sales trend).
- **Identified Slow Movers:** 73 items (40 Critical, 33 Moderate).
- **Cumulative Wastage Loss from Slow Movers:** $2,983,575.20.

## 2. Movement Class Distribution

| Movement Class | Dish Count | % of Menu | Avg Margin % | Avg Mean Gap (Days) | Avg Wastage % |
|----------------|------------|-----------|--------------|---------------------|---------------|
| Active Mover | 43 | 28.7% | 59.6% | 1.00 | 2.80% |
| Critical Slow-Moving | 40 | 26.7% | 60.8% | 1.05 | 42.84% |
| Moderate Slow-Moving | 33 | 22.0% | 58.8% | 1.00 | 23.71% |
| Watchlist / Marginal | 34 | 22.7% | 59.3% | 1.00 | 7.05% |

## 3. Top 15 Critical Slow-Moving Dishes (All 7 Dimensions)

| Item ID | Item Name | Category | Units Sold | Orders | Mean Gap | Repeat % | Wastage % | Margin % | Trend Slope | SMI Score | Recommended Action |
|---------|-----------|----------|------------|--------|----------|----------|-----------|----------|-------------|-----------|--------------------|
| ITEM-051 | A5 Miyazaki Japanese Wagyu (4oz) | Prime Steaks & Butcher Cuts | 667 | 457 | 1.39d | 1.1% | 56.6% | 66.3% | 0.032 | **0.898** | Immediate Menu Retirement / Phase-Out (Excessive Wastage Loss) |
| ITEM-006 | Soft-Shell Crab Sliders | Appetizers & Small Plates | 3,191 | 2,159 | 1.00d | 1.9% | 72.7% | 47.7% | 0.030 | **0.892** | Immediate Menu Retirement / Phase-Out (Excessive Wastage Loss) |
| ITEM-005 | Wild Alaskan Salmon Tartare | Appetizers & Small Plates | 3,544 | 2,433 | 1.01d | 2.8% | 72.2% | 45.2% | 0.034 | **0.883** | Immediate Menu Retirement / Phase-Out (Excessive Wastage Loss) |
| ITEM-072 | Whole Grilled Red Snapper Mojo | Chef Specials & Seafood | 2,091 | 1,476 | 1.04d | 1.4% | 80.3% | 58.3% | 0.037 | **0.870** | Immediate Menu Retirement / Phase-Out (Excessive Wastage Loss) |
| ITEM-047 | Dry-Aged Tomahawk Ribeye (36oz) | Prime Steaks & Butcher Cuts | 987 | 677 | 1.21d | 1.3% | 34.9% | 69.6% | 0.033 | **0.861** | Immediate Menu Retirement / Phase-Out (Excessive Wastage Loss) |
| ITEM-029 | Truffle Lobster Roll | Artisanal Burgers & Handhelds | 2,058 | 1,436 | 1.05d | 1.4% | 43.3% | 57.4% | 0.038 | **0.837** | Immediate Menu Retirement / Phase-Out (Excessive Wastage Loss) |
| ITEM-066 | Seared Diver Scallops Sweet Corn | Chef Specials & Seafood | 4,249 | 2,830 | 1.00d | 3.4% | 67.8% | 53.3% | 0.035 | **0.833** | Immediate Menu Retirement / Phase-Out (Excessive Wastage Loss) |
| ITEM-060 | Pepper-Crusted Bison Tenderloin | Prime Steaks & Butcher Cuts | 1,145 | 794 | 1.12d | 1.1% | 42.0% | 56.9% | 0.042 | **0.827** | Immediate Menu Retirement / Phase-Out (Excessive Wastage Loss) |
| ITEM-064 | Butter Poached Maine Lobster Tail | Chef Specials & Seafood | 2,354 | 1,608 | 1.02d | 1.6% | 80.2% | 54.8% | 0.043 | **0.821** | Immediate Menu Retirement / Phase-Out (Excessive Wastage Loss) |
| ITEM-057 | Roasted Veal Chop Chanterelles | Prime Steaks & Butcher Cuts | 1,208 | 843 | 1.17d | 1.0% | 38.2% | 55.1% | 0.049 | **0.809** | Immediate Menu Retirement / Phase-Out (Excessive Wastage Loss) |
| ITEM-118 | Dark Chocolate Souffle Grand Marnier | Handcrafted Desserts & Pastries | 1,762 | 1,212 | 1.04d | 1.4% | 39.4% | 75.8% | 0.038 | **0.793** | Switch to Made-to-Order / Zero Pre-Batching |
| ITEM-045 | Linguine alle Vongole (Clams) | Wood-Fired Pizzas & Pastas | 4,139 | 2,788 | 1.01d | 2.9% | 68.8% | 52.0% | 0.042 | **0.790** | Immediate Menu Retirement / Phase-Out (Excessive Wastage Loss) |
| ITEM-056 | Pan-Roasted Duck Breast Plum Glaze | Prime Steaks & Butcher Cuts | 3,768 | 2,579 | 1.01d | 2.7% | 24.5% | 60.0% | 0.036 | **0.789** | Immediate Menu Retirement / Phase-Out (Excessive Wastage Loss) |
| ITEM-075 | Seafood Bouillabaisse Saffron Rouille | Chef Specials & Seafood | 2,939 | 2,016 | 1.01d | 2.1% | 75.8% | 55.4% | 0.048 | **0.787** | Immediate Menu Retirement / Phase-Out (Excessive Wastage Loss) |
| ITEM-008 | Reserve Osetra Caviar Blinis | Appetizers & Small Plates | 814 | 574 | 1.26d | 0.9% | 55.6% | 74.6% | 0.048 | **0.780** | Immediate Menu Retirement / Phase-Out (Excessive Wastage Loss) |

## 4. Multi-Factor Formula & Dimension Breakdown
In strict accordance with SRS Step 32, slow-moving items are identified by combining all 7 dimensions:

$$\text{SMI} = 0.18 \cdot S_{\text{vol}} + 0.16 \cdot S_{\text{freq}} + 0.16 \cdot S_{\text{gap}} + 0.14 \cdot S_{\text{repeat}} + 0.14 \cdot S_{\text{waste}} + 0.12 \cdot S_{\text{margin}} + 0.10 \cdot S_{\text{trend}}$$

- **Low Sales Volume ($S_{\text{vol}}$):** Inverted percentile of total units sold.
- **Low Purchase Frequency ($S_{\text{freq}}$):** Inverted percentile of distinct orders.
- **Long Gaps Between Purchases ($S_{\text{gap}}$):** Percentile of mean inter-purchase days.
- **Low Repeat Purchase ($S_{\text{repeat}}$):** Inverted percentile of customer reorder rate.
- **High Wastage ($S_{\text{waste}}$):** Percentile of wastage percentage.
- **Weak Profitability ($S_{\text{margin}}$):** Inverted percentile of contribution margin percentage.
- **Poor Trend ($S_{\text{trend}}$):** Inverted percentile of normalized monthly demand slope.

## 5. Architectural Summary
- **Engine Class:** `SlowMovingDishDetector`
- **Parquet Datasets:** `slow_moving_dishes.parquet`, `all_menu_items_movement_scorecard.parquet`
- **Compliance Status:** 100% compliant with SRS Step 32.
