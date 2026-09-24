# DineIQ Analytics: Promotion Effectiveness & Trap Detection Report

**Execution Timestamp:** 2026-09-24 15:58:06
**Total Promotional Campaigns Analyzed:** 12 campaigns
**Baseline Non-Promotional AOV:** $231.18 (Margin: 56.00%)
**SRS Explicit Rule:** *'An increase in sales alone must not automatically classify a promotion as successful.'*

## 1. Multi-Dimensional Promotion Evaluation Matrix (Step 27)

| Promotion ID & Name | Orders | Revenue ($) | Gross Profit ($) | Margin (%) | Acquired Custs | Repeat (%) | AOV ($) | Wastage Loss ($) | Post-Promo Ret. (%) | Status |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| **PROMO-006** - Summer Happy Hour BOGO Dr | 2,797 | $629,211.23 | $344,508.13 | 54.8% | 1,284 | 63.9% | $224.96 | $61,582.80 | 17.3% | `FAILED_VALUE_DESTROYING (` |
| **PROMO-007** - Back-to-School Family Com | 2,718 | $595,727.47 | $321,023.72 | 53.9% | 1,227 | 62.1% | $219.18 | $273,071.25 | 19.1% | `FAILED_VALUE_DESTROYING (` |
| **PROMO-002** - Valentine Dinner Date $15 | 2,653 | $582,456.56 | $308,483.66 | 53.0% | 1,230 | 63.2% | $219.55 | $6,664.00 | 16.8% | `FAILED_VALUE_DESTROYING (` |
| **PROMO-010** - Black Friday Week Blowout | 2,730 | $577,155.44 | $298,988.69 | 51.8% | 1,249 | 64.5% | $211.41 | $64,671.35 | 24.3% | `MODERATE_VOLUME_DRIVER` |
| **PROMO-011** - Holiday Season Cheers 15% | 2,777 | $544,342.49 | $263,222.39 | 48.4% | 1,257 | 63.2% | $196.02 | $273,680.25 | 0.0% | `FAILED_VALUE_DESTROYING (` |
| **PROMO-004** - Spring Weekend Flash 15% | 2,718 | $536,102.80 | $259,343.05 | 48.4% | 1,268 | 66.6% | $197.24 | $263,683.15 | 20.1% | `FAILED_VALUE_DESTROYING (` |
| **PROMO-012** - Late Night Craver 20% Off | 2,802 | $522,270.60 | $234,234.45 | 44.9% | 1,246 | 62.4% | $186.39 | $267,331.10 | 0.0% | `FAILED_VALUE_DESTROYING (` |
| **PROMO-001** - New Year Kickoff 20% Off | 2,774 | $516,118.06 | $232,211.01 | 45.0% | 1,294 | 64.7% | $186.06 | $129,922.60 | 16.2% | `FAILED_VALUE_DESTROYING (` |
| **PROMO-009** - VIP Platinum Royalty 25%  | 2,859 | $501,417.49 | $206,574.55 | 41.2% | 1,281 | 61.9% | $175.38 | $3,247,970.00 | 0.0% | `FAILED_VALUE_DESTROYING (` |
| **PROMO-005** - Free Dessert Illusion (Mi | 1,918 | $433,130.05 | $235,802.95 | 54.4% | 865 | 61.4% | $225.82 | $118,684.30 | 22.0% | `MODERATE_VOLUME_DRIVER` |
| **PROMO-003** - Mega Feast 50% Off (Fine  | 1,714 | $215,657.98 | $25,231.18 | 11.7% | 771 | 60.8% | $125.82 | $17,845.90 | 19.9% | `FAILED_VALUE_DESTROYING (` |
| **PROMO-008** - 70% Mega Sale (Hidden Exc | 1,998 | $140,566.33 | $-65,170.42 | -46.4% | 873 | 61.9% | $70.35 | $8,991.30 | 26.5% | `FAILED_VALUE_DESTROYING (` |

## 2. Promotion Trap Detection (Step 28 - All 5 Exact Misleading Patterns)

Systematic empirical identification of the 5 misleading patterns:

| Promotion | Traps | 1. Sales Up, Profit Down | 2. Margin Collapse | 3. Increases Wastage | 4. Discount Churners | 5. Cannibalization |
|---|---:|:---:|:---:|:---:|:---:|:---:|
| **PROMO-012** - Late Night Craver 20% Off | **5** | YES | YES | YES | YES | YES |
| **PROMO-001** - New Year Kickoff 20% Off | **4** | YES | YES | YES | YES | No |
| **PROMO-009** - VIP Platinum Royalty 25%  | **4** | YES | YES | YES | YES | No |
| **PROMO-003** - Mega Feast 50% Off (Fine  | **3** | YES | YES | No | YES | No |
| **PROMO-010** - Black Friday Week Blowout | **2** | No | No | YES | YES | No |
| **PROMO-004** - Spring Weekend Flash 15% | **2** | No | No | YES | YES | No |
| **PROMO-005** - Free Dessert Illusion (Mi | **2** | No | No | YES | YES | No |
| **PROMO-007** - Back-to-School Family Com | **2** | No | No | YES | YES | No |
| **PROMO-011** - Holiday Season Cheers 15% | **2** | No | No | YES | YES | No |
| **PROMO-008** - 70% Mega Sale (Hidden Exc | **2** | YES | YES | No | No | No |
| **PROMO-002** - Valentine Dinner Date $15 | **1** | No | No | No | YES | No |
| **PROMO-006** - Summer Happy Hour BOGO Dr | **1** | No | No | No | YES | No |

### Detailed Trap Pattern Evidence

#### `PROMO-012`: Late Night Craver 20% Off
- **Pattern 1 (Sales Up, Profit Down):** Revenue was $522,270.60, but profit margin contracted by 11.1% below baseline (44.9% vs 56.0%), yielding only $234,234.45 in net profit.
- **Pattern 2 (Margin Collapse):** Acquired high transaction volume (2,626 unique customers), but order margin collapsed to 44.9% due to aggressive discount absorption.
- **Pattern 3 (Elevated Wastage):** Severe inventory spoilage during campaign: $267,331.10 in food loss (34,362 units wasted) due to kitchen overproduction and demand miscalculation.
- **Pattern 4 (Discount Churners):** Extreme customer churn: 100.0% of promo patrons never returned after the discount expired (only 0.0% 30-day post-campaign retention).
- **Pattern 5 (Cannibalization):** Cannibalization confirmed: Promotional sales captured $65,925.77 (4.6% of category volume), shifting demand away from full-price substitutes in CAT-06.

#### `PROMO-001`: New Year Kickoff 20% Off
- **Pattern 1 (Sales Up, Profit Down):** Revenue was $516,118.06, but profit margin contracted by 11.0% below baseline (45.0% vs 56.0%), yielding only $232,211.01 in net profit.
- **Pattern 2 (Margin Collapse):** Acquired high transaction volume (2,589 unique customers), but order margin collapsed to 45.0% due to aggressive discount absorption.
- **Pattern 3 (Elevated Wastage):** Severe inventory spoilage during campaign: $129,922.60 in food loss (12,503 units wasted) due to kitchen overproduction and demand miscalculation.
- **Pattern 4 (Discount Churners):** Extreme customer churn: 83.8% of promo patrons never returned after the discount expired (only 16.2% 30-day post-campaign retention).
- **Pattern 5 (Cannibalization):** Storewide promotion; affects all categories without single-product substitute cannibalization.

#### `PROMO-009`: VIP Platinum Royalty 25% Off
- **Pattern 1 (Sales Up, Profit Down):** Revenue was $501,417.49, but profit margin contracted by 14.8% below baseline (41.2% vs 56.0%), yielding only $206,574.55 in net profit.
- **Pattern 2 (Margin Collapse):** Acquired high transaction volume (2,661 unique customers), but order margin collapsed to 41.2% due to aggressive discount absorption.
- **Pattern 3 (Elevated Wastage):** Severe inventory spoilage during campaign: $3,247,970.00 in food loss (310,818 units wasted) due to kitchen overproduction and demand miscalculation.
- **Pattern 4 (Discount Churners):** Extreme customer churn: 100.0% of promo patrons never returned after the discount expired (only 0.0% 30-day post-campaign retention).
- **Pattern 5 (Cannibalization):** Storewide promotion; affects all categories without single-product substitute cannibalization.

#### `PROMO-003`: Mega Feast 50% Off (Fine Print: $120 Min)
- **Pattern 1 (Sales Up, Profit Down):** Revenue was $215,657.98, but profit margin contracted by 44.3% below baseline (11.7% vs 56.0%), yielding only $25,231.18 in net profit.
- **Pattern 2 (Margin Collapse):** Acquired high transaction volume (1,629 unique customers), but order margin collapsed to 11.7% due to aggressive discount absorption.
- **Pattern 3 (Elevated Wastage):** Kitchen preparation aligned closely with realized demand; normal wastage.
- **Pattern 4 (Discount Churners):** Extreme customer churn: 80.0% of promo patrons never returned after the discount expired (only 19.9% 30-day post-campaign retention).
- **Pattern 5 (Cannibalization):** Complementary category impact; cannibalization rate at acceptable 2.2%.

#### `PROMO-010`: Black Friday Week Blowout $20 Off
- **Pattern 1 (Sales Up, Profit Down):** Profit moved in positive alignment with sales volume.
- **Pattern 2 (Margin Collapse):** Customer influx maintained healthy unit contribution margin.
- **Pattern 3 (Elevated Wastage):** Severe inventory spoilage during campaign: $64,671.35 in food loss (5,995 units wasted) due to kitchen overproduction and demand miscalculation.
- **Pattern 4 (Discount Churners):** Extreme customer churn: 75.7% of promo patrons never returned after the discount expired (only 24.3% 30-day post-campaign retention).
- **Pattern 5 (Cannibalization):** Storewide promotion; affects all categories without single-product substitute cannibalization.

#### `PROMO-004`: Spring Weekend Flash 15%
- **Pattern 1 (Sales Up, Profit Down):** Profit moved in positive alignment with sales volume.
- **Pattern 2 (Margin Collapse):** Customer influx maintained healthy unit contribution margin.
- **Pattern 3 (Elevated Wastage):** Severe inventory spoilage during campaign: $263,683.15 in food loss (25,413 units wasted) due to kitchen overproduction and demand miscalculation.
- **Pattern 4 (Discount Churners):** Extreme customer churn: 79.9% of promo patrons never returned after the discount expired (only 20.1% 30-day post-campaign retention).
- **Pattern 5 (Cannibalization):** Storewide promotion; affects all categories without single-product substitute cannibalization.

#### `PROMO-005`: Free Dessert Illusion (Min $80 Order)
- **Pattern 1 (Sales Up, Profit Down):** Profit moved in positive alignment with sales volume.
- **Pattern 2 (Margin Collapse):** Customer influx maintained healthy unit contribution margin.
- **Pattern 3 (Elevated Wastage):** Severe inventory spoilage during campaign: $118,684.30 in food loss (7,472 units wasted) due to kitchen overproduction and demand miscalculation.
- **Pattern 4 (Discount Churners):** Extreme customer churn: 78.0% of promo patrons never returned after the discount expired (only 22.0% 30-day post-campaign retention).
- **Pattern 5 (Cannibalization):** Complementary category impact; cannibalization rate at acceptable 2.1%.

#### `PROMO-007`: Back-to-School Family Combo $10 Off
- **Pattern 1 (Sales Up, Profit Down):** Profit moved in positive alignment with sales volume.
- **Pattern 2 (Margin Collapse):** Customer influx maintained healthy unit contribution margin.
- **Pattern 3 (Elevated Wastage):** Severe inventory spoilage during campaign: $273,071.25 in food loss (26,030 units wasted) due to kitchen overproduction and demand miscalculation.
- **Pattern 4 (Discount Churners):** Extreme customer churn: 81.0% of promo patrons never returned after the discount expired (only 19.1% 30-day post-campaign retention).
- **Pattern 5 (Cannibalization):** Storewide promotion; affects all categories without single-product substitute cannibalization.

#### `PROMO-011`: Holiday Season Cheers 15%
- **Pattern 1 (Sales Up, Profit Down):** Profit moved in positive alignment with sales volume.
- **Pattern 2 (Margin Collapse):** Customer influx maintained healthy unit contribution margin.
- **Pattern 3 (Elevated Wastage):** Severe inventory spoilage during campaign: $273,680.25 in food loss (26,055 units wasted) due to kitchen overproduction and demand miscalculation.
- **Pattern 4 (Discount Churners):** Extreme customer churn: 100.0% of promo patrons never returned after the discount expired (only 0.0% 30-day post-campaign retention).
- **Pattern 5 (Cannibalization):** Storewide promotion; affects all categories without single-product substitute cannibalization.

#### `PROMO-008`: 70% Mega Sale (Hidden Exclusions)
- **Pattern 1 (Sales Up, Profit Down):** Revenue was $140,566.33, but profit margin contracted by 102.4% below baseline (-46.4% vs 56.0%), yielding only $-65,170.42 in net profit.
- **Pattern 2 (Margin Collapse):** Acquired high transaction volume (1,877 unique customers), but order margin collapsed to -46.4% due to aggressive discount absorption.
- **Pattern 3 (Elevated Wastage):** Kitchen preparation aligned closely with realized demand; normal wastage.
- **Pattern 4 (Discount Churners):** Strong post-campaign customer retention of 26.5%.
- **Pattern 5 (Cannibalization):** Complementary category impact; cannibalization rate at acceptable 3.5%.

## 3. Product Cannibalization Analysis (Step 28 - Pattern 5)

| Promotion | Applicable Category | Promo Category Rev ($) | Non-Promo Category Rev ($) | Cannibalization Share (%) | Is Cannibalistic? |
|---|---|---:|---:|---:|:---:|
| **PROMO-002** | `CAT-01` | $964.72 | $18,847.85 | **4.9%** | No |
| **PROMO-003** | `CAT-02` | $2,685.15 | $119,125.75 | **2.2%** | No |
| **PROMO-005** | `CAT-05` | $2,762.85 | $129,389.85 | **2.1%** | No |
| **PROMO-006** | `CAT-04` | $24,840.72 | $582,175.68 | **4.1%** | No |
| **PROMO-008** | `CAT-07` | $3,531.58 | $97,507.55 | **3.5%** | No |
| **PROMO-012** | `CAT-06` | $65,925.77 | $1,362,020.79 | **4.6%** | YES |

## 4. Post-Promotion Customer Retention & Cohort Behavior (Step 27)

| Promotion | Campaign Customers | Acquired New | Repeat Acquired (%) | 30-Day Retained Customers | 30-Day Retention (%) | Post-Promo Spend ($) |
|---|---:|---:|---:|---:|---:|---:|
| **PROMO-001** | 2,589 | 1,294 | 64.7% | 420 | **16.2%** | $161,715.73 |
| **PROMO-002** | 2,488 | 1,230 | 63.3% | 418 | **16.8%** | $163,474.19 |
| **PROMO-003** | 1,629 | 771 | 60.8% | 325 | **19.9%** | $141,099.92 |
| **PROMO-004** | 2,554 | 1,268 | 66.6% | 514 | **20.1%** | $198,503.37 |
| **PROMO-005** | 1,812 | 865 | 61.4% | 399 | **22.0%** | $178,799.72 |
| **PROMO-006** | 2,622 | 1,284 | 63.9% | 453 | **17.3%** | $168,916.47 |
| **PROMO-007** | 2,525 | 1,227 | 62.1% | 481 | **19.1%** | $185,250.50 |
| **PROMO-008** | 1,877 | 873 | 61.9% | 497 | **26.5%** | $220,192.12 |
| **PROMO-009** | 2,661 | 1,281 | 61.9% | 0 | **0.0%** | $0.00 |
| **PROMO-010** | 2,551 | 1,249 | 64.5% | 621 | **24.3%** | $243,094.21 |
| **PROMO-011** | 2,625 | 1,257 | 63.2% | 0 | **0.0%** | $0.00 |
| **PROMO-012** | 2,626 | 1,246 | 62.4% | 0 | **0.0%** | $0.00 |

