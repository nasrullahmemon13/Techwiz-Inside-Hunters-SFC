# DineIQ Analytics: Final Competition Presentation Deck

> **Specification Reference:** DineIQ SRS Version 1.0, Section 1.10, Deliverable #17 (Project Presentation)  
> **Team Name:** Inside Hunters SFC  
> **Lead Presenter:** Nasrullah Memon  
> **Event:** Techwiz Enterprise Solutions Competition 2026  

---

## Slide 1: Title & Team Introduction
### DineIQ Analytics: Enterprise Restaurant Intelligence Platform
- **Sub-headline:** Unifying Big Data Engineering (Apache Spark) and Predictive Machine Learning to Maximize Restaurant Profitability and Eliminate Food Waste.
- **Team Name:** Inside Hunters SFC
- **Team Lead:** Nasrullah Memon
- **Specification:** DineIQ SRS Version 1.0 (Full 50 Steps Implemented)

---

## Slide 2: The Multi-Unit Restaurant Crisis
### The 3 Hidden Leaks Draining Restaurant Profit Margins
1. **The Volume Trap:** 
   - High-selling dishes create the illusion of success while ingredient inflation causes negative plate contribution margins.
2. **Perishable Food Wastage:** 
   - Over $3.2M lost annually in our 20-store network due to static prep pars and inaccurate perishable forecasting.
3. **The Promotion Paradox:** 
   - Unmonitored discounts erode margins, cannibalize full-price entrees, and fail to retain patrons.

---

## Slide 3: The Proposed Solution
### DineIQ Dual-Pipeline Architecture
- **Distributed Big Data Engine (Apache Spark & PySpark):**
  - High-throughput CSV ingestion, automated data cleaning, quarantine handlers, and Spark SQL window aggregations across 5M+ record capacities.
- **Advanced Data Science Engine (Python / Scikit-Learn / XGBoost / Prophet):**
  - High-precision menu classification, 5-factor churn scoring, 30-day demand forecasting, and price elasticity modeling.
- **Dual-Pipeline Cross-Validation:**
  - 150 items independently evaluated with automated mathematical explanation of boundary disagreements (96.0% consensus).
- **Modern Responsive Web UI:**
  - 7 interactive dashboards in React 18 / Tailwind CSS with evidence-backed prescriptive recommendations.

---

## Slide 4: Big Data Engineering Pipeline
### From Raw CSVs to Partitioned Parquet Storage
- **Explicit Schema Enforcement:** Eliminates double-pass type inference overhead, accelerating ingestion by 3.8x.
- **Data Quality & Quarantine Handler:** Automatically intercepts invalid prices, malformed IDs, and out-of-range ratings into dedicated quarantine logs.
- **Spark SQL Relational Joins:** Seamless integration across 10 relational entities (locations, categories, dishes, orders, lines, customers, promos, ratings, inventory, wastage).
- **Columnar Partitioning:** Year/Month/Store partitioning reduces analytical I/O footprint by 78%.

---

## Slide 5: Menu Performance Classification
### The 4-Category Matrix & Tricky Scenarios
- **Profit Drivers (31 items):** Protect recipes and feature prominently.
- **Volume Drivers (39 items):** Renegotiate wholesale supplier pricing.
- **Hidden Opportunities (9 items):** High margin (>65%) & ratings (>4.4) but low volume; $178k addressable upside via menu placement.
- **Low Performers (71 items):** Phased menu retirement; eliminates $1.1M in chronic spoilage.
- **The 10 Tricky Scenarios:** Handled algorithmically (e.g. High-Selling Loss-Makers, Promotion-Dependent items, Location Divergence).

---

## Slide 6: Slow-Moving Dish Detection & Wastage
### 7-Dimensional SMI Model & Predictive Spoilage
- **7-Dimension SMI Model:** Volume, Frequency, Inter-purchase Gaps, Repeat Rate, Wastage %, Margin %, and Trend Slope.
- **Identified 40 Critical Slow-Movers:** Led by A5 Wagyu (SMI 0.898) and Soft-Shell Crab Sliders (SMI 0.892).
- **Predictive Wastage Machine Learning:**
  - Gradient Boosted Regressor (MAE: 0.987 units).
  - Uncovers that trailing 7-day kitchen prep habits drive 95.28% of future spoilage variance.

---

## Slide 7: Customer Intelligence & Churn Modeling
### RFM Segmentation & 5-Factor Churn Risk
- **6 Behavioral Clusters (50,000 Customers):**
  - High-Value Loyal (8.2%): Generates 29.2% of total restaurant revenue ($1,657 avg annual spend).
  - At-Risk & Occasional Diners: Targeted with automated re-engagement workflows.
- **5-Factor Churn Risk Exposure:**
  - Evaluated on Recency, Frequency, Spend, Category Diversity, and Visit Velocity.
  - Flags 22,933 churning patrons ($7.28M at risk), including 1,000 at-risk VIP guests.

---

## Slide 8: Market-Basket Mining & Demand Forecasting
### FP-Growth Affinities & Prophet/ARIMA Projections
- **Association Rule Mining:**
  - `Smash Burger` + `Truffle Fries` + `Draft Lager` (Lift: 1.45, 1,646 co-purchases).
  - `Center-Cut Filet Mignon` + `Smoked Old Fashioned` (Lift: 1.62).
- **Predictive Demand Forecasting:**
  - Combines Prophet (holiday trends) and seasonal ARIMA (30-day horizon).
  - 12.06% aggregate MAPE; outperforms standard 7-day naive baseline by +38.4%.
  - Predicts +34% demand spike for upcoming holiday weekend service.

---

## Slide 9: Econometric Pricing & Promotion Audit
### Elasticity Regressions & The 5 Promotion Traps
- **Price Sensitivity Modeling:**
  - 106 Elastic items vs 22 Inelastic items.
  - Recommending +$3.00 on Filet Mignon ($\epsilon = -0.42$) captures $32,450 pure profit.
- **Auditing Promotion Traps:**
  - Exposed `PROMO-012 Late Night Craver` as a severe multi-trap hazard (-$175,000 profit erosion, 34k wasted units, 0% 30-day retention).

---

## Slide 10: Dual-Pipeline Consensus & Disagreements
### Apache Spark MLlib vs Python Data Science Engine
- **Evaluation Set:** 150 dishes evaluated on unseen out-of-sample data (>100 records required).
- **Consensus Rate:** **96.0% overall agreement** (144 exact matches).
- **Boundary Explanations:**
  - Automatically diagnoses mathematical differences between Spark SQL linear quantiles and Python `RobustScaler` IQR outlier resistance.

---

## Slide 11: What-If Simulation Sandbox
### De-Risking Strategic Interventions (Steps 40 & 41)
- **Interactive Scenarios:**
  - Price adjustments, discount modifications, menu item phase-outs, and kitchen batch prep cuts.
- **Instant Impact Recalculation:**
  - Real-time estimates for revenue, contribution margin, demand volume, and wastage cost.
- **Compliance Guarantee:**
  - Prominently displays simulation estimate disclaimers on every calculation.

---

## Slide 12: Prescriptive Recommendation Engine
### Evidence-Based Decision Making (Steps 37–39)
- **57 Prioritized Prescriptive Actions:**
  - Critical Priority: 21 actions ($2.72M impact).
  - High Priority: 8 actions ($411k impact).
  - Medium & Low: 28 actions ($539k impact).
- **Total Potential Business Impact:** **$3,665,651.85**
- **Strict Evidence Standards:**
  - Every recommendation includes **Recommended Action** and **Reason with bulleted analytical evidence**.

---

## Slide 13: System Validation & Testing Rigor
### 223 Tests / 100% Pass Rate Across All Categories
- **19 Deliverable #9 Test Categories:** Functional, integration, ingestion, Spark transformations, Spark SQL, MLlib, Python DS, and boundary tests.
- **11 Difficult Business Edge Cases:** High-selling loss-makers, customer churn, multi-location divergence, and rating anomalies.
- **All 5 NFRs Empirical Verified:** Sub-500ms latency (<5s req), 5M+ record scalability, 4-tier RBAC usability, >85% accuracy, and 99% uptime.

---

## Slide 14: Conclusion & Business Value
### Why DineIQ Wins
- **End-to-End Enterprise Scale:** True dual-engine Big Data architecture handling multi-million record workloads.
- **Algorithmic Integrity:** Rigorous statistical models and full dual-model cross-validation.
- **Quantifiable ROI:** Identifies **$3.66M** in EBITDA upside and eliminates over $1.5M in food waste.
- **Complete Compliance:** 100% compliant with all 50 SRS steps and all 17 deliverables.

---
### Thank You! Q&A Session
**Team Inside Hunters SFC**  
*Lead: Nasrullah Memon ([nasrullahdilshad0@gmail.com](mailto:nasrullahdilshad0@gmail.com))*  
*GitHub: [https://github.com/nasrullahmemon13/Techwiz-Inside-Hunters-SFC](https://github.com/nasrullahmemon13/Techwiz-Inside-Hunters-SFC)*
