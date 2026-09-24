# DineIQ Analytics: Price Sensitivity & Econometric Demand Elasticity

**Execution Timestamp:** 2026-09-24 15:48:43
**Total Menu Items Analyzed:** 150 items
**Historical Price Change Events Evaluated:** 185 events

## 1. Executive Summary & Step 26 Classification Tiers

All 150 items were classified into the exact 3 SRS-mandated sensitivity tiers supported by historical pricing and order behavior:

| Price Sensitivity Tier | Item Count | Share (%) | Mean Price ($) | Mean Elasticity (Ed) | Commercial Pricing Strategy |
|---|---:|---:|---:|---:|---|
| **Highly Price Sensitive** | 106 | 70.7% | $20.27 | 2.250 | ELASTIC: Avoid unbundled price increases; utilize ... |
| **Moderately Price Sensitive** | 22 | 14.7% | $20.63 | 0.642 | BALANCED: Implement modest 3-5% price adjustments ... |
| **Low Price Sensitivity** | 22 | 14.7% | $24.29 | 0.141 | INELASTIC: Prime margin harvesting candidate; stro... |

## 2. Multi-Variable Relationship Analysis (Step 25)

### A. 7-Variable Pearson Correlation Matrix

| Variable | Price | Demand | Revenue | Contrib. Margin | Discount | Rating | Repeat Purchase |
|---|---:|---:|---:|---:|---:|---:|---:|
| **price** | 1.000 | -0.569 | 0.150 | 0.140 | 0.412 | 0.046 | -0.561 |
| **demand** | -0.569 | 1.000 | 0.432 | 0.205 | -0.152 | -0.093 | 0.994 |
| **revenue** | 0.150 | 0.432 | 1.000 | 0.722 | -0.001 | -0.120 | 0.451 |
| **contribution_margin** | 0.140 | 0.205 | 0.722 | 1.000 | -0.013 | -0.083 | 0.231 |
| **discount** | 0.412 | -0.152 | -0.001 | -0.013 | 1.000 | 0.118 | -0.147 |
| **rating** | 0.046 | -0.093 | -0.120 | -0.083 | 0.118 | 1.000 | -0.093 |
| **repeat_purchase** | -0.561 | 0.994 | 0.451 | 0.231 | -0.147 | -0.093 | 1.000 |

### B. Econometric Log-Log Regression Model

- **Overall Price Elasticity of Demand ($\beta_1$):** **-0.1522** ($p = 0.0029$)
- **Rating Sensitivity ($\beta_3$):** **+0.1655** (higher ratings offset negative price resistance)
- **Repeat Purchase Sensitivity ($\beta_4$):** **+21.1745** (loyal customer repeat behavior buffers demand)
- **Model Fit ($R^2$):** **0.8726** (F-statistic = 197.18)

## 3. Items with Significant Demand Shifts After Price Changes (Step 25)

Event study comparing 60 days before vs 60 days after price changes (Welch's t-test, $p < 0.05$, $|\%\Delta Q| \ge 8\%$):

| Menu Item | Category | Change Date | Old Price ($) | New Price ($) | %Δ Price | Pre-Demand | Post-Demand | %Δ Demand | Elasticity (Ed) | p-value |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| **DineIQ Smash Double Cheeseburger** | Artisanal Burgers & Handhelds | `2025-05-01` | $13.99 | $12.87 | -8.0% | 49.5 | 55.3 | **+11.7%** | **-1.461** | 0.0411 |
| **Steakhouse Flat Iron Chimichurri** | Prime Steaks & Butcher Cuts | `2025-07-01` | $26.50 | $27.83 | +5.0% | 28.0 | 31.5 | **+12.7%** | **2.520** | 0.0488 |
| **Nitro Cold Brew Sweet Cream** | Specialty Coffee & Beverages | `2025-07-01` | $5.99 | $6.29 | +5.0% | 43.0 | 48.5 | **+12.8%** | **2.561** | 0.0348 |
| **Classic Fish & Chips Tartar** | Chef Specials & Seafood | `2025-07-01` | $19.99 | $20.59 | +3.0% | 40.9 | 46.3 | **+13.4%** | **4.481** | 0.0201 |
| **Crispy Buttermilk Chicken Sandwich** | Artisanal Burgers & Handhelds | `2025-05-01` | $14.50 | $13.34 | -8.0% | 43.3 | 49.2 | **+13.7%** | **-1.717** | 0.0189 |
| **Margherita Sourdough Pizza** | Wood-Fired Pizzas & Pastas | `2025-05-01` | $15.99 | $14.71 | -8.0% | 45.6 | 52.0 | **+13.9%** | **-1.743** | 0.0220 |
| **Caramel Macchiato Sea Salt** | Specialty Coffee & Beverages | `2025-07-01` | $5.99 | $6.29 | +5.0% | 44.1 | 50.4 | **+14.1%** | **2.809** | 0.0212 |
| **Creamy Cashew Alfredo Tagliatelle** | Vegan & Plant-Based Creations | `2025-07-01` | $19.00 | $19.95 | +5.0% | 19.7 | 22.5 | **+14.3%** | **2.856** | 0.0458 |
| **Strawberry Basil Smash Lemonade (Mocktail)** | Signature Cocktails & Mocktails | `2025-07-01` | $8.50 | $8.93 | +5.1% | 27.2 | 31.1 | **+14.4%** | **2.847** | 0.0220 |
| **Classic Moscow Mule Copper Mug** | Signature Cocktails & Mocktails | `2025-07-01` | $13.50 | $14.18 | +5.0% | 34.5 | 39.5 | **+14.5%** | **2.879** | 0.0346 |

## 4. Category-Level Price Sensitivity Summary (Step 26)

| Menu Category | Items | Mean Price ($) | Mean Elasticity (Ed) | Highly Sensitive | Moderately Sensitive | Low Sensitivity |
|---|---:|---:|---:|---:|---:|---:|
| **Prime Steaks & Butcher Cuts** | 15 | $49.83 | 0.832 | 9 | 3 | 3 |
| **Vegan & Plant-Based Creations** | 15 | $16.80 | 1.374 | 8 | 1 | 6 |
| **Wood-Fired Pizzas & Pastas** | 15 | $22.20 | 1.692 | 10 | 1 | 4 |
| **Appetizers & Small Plates** | 15 | $17.32 | 1.734 | 10 | 4 | 1 |
| **Farm-Fresh Salads & Grain Bowls** | 15 | $15.03 | 1.807 | 14 | 1 | 0 |
| **Chef Specials & Seafood** | 15 | $34.93 | 1.816 | 12 | 1 | 2 |
| **Artisanal Burgers & Handhelds** | 15 | $17.50 | 1.836 | 8 | 5 | 2 |
| **Handcrafted Desserts & Pastries** | 15 | $11.70 | 1.837 | 12 | 1 | 2 |
| **Specialty Coffee & Beverages** | 15 | $6.20 | 2.029 | 13 | 1 | 1 |
| **Signature Cocktails & Mocktails** | 15 | $17.60 | 2.089 | 10 | 4 | 1 |

