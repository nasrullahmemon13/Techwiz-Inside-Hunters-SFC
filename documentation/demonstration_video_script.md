# DineIQ Analytics: Official Demonstration Video Script (SRS Deliverable #14)

> **Specification Reference:** DineIQ SRS Version 1.0, Section 1.10, Deliverable #14  
> **Format:** Full Production Walkthrough & Narration Guide for `.mp4` Submission  
> **Target Video Duration:** 15 – 18 Minutes  
> **Team Name:** Inside Hunters SFC  
> **Lead Presenter:** Nasrullah Memon  

---

## Video Production Overview
This script outlines the exact sequence, screen captures, audio voiceover, and live terminal/UI demonstrations required to satisfy all 24 mandated demonstration points under SRS Deliverable #14.

| Scene # | Timecode | Demonstration Segment | Primary Visual / Screen | Key Voiceover Narrative |
|:---:|:---:|:---|:---|:---|
| 1 | 00:00 - 00:45 | Title, Team & Architecture Intro | Title Slide & System Architecture Mermaid Diagram | Welcome to DineIQ Analytics by Team Inside Hunters SFC. An enterprise dual-pipeline Big Data platform built on Apache Spark and Python. |
| 2 | 00:45 - 01:30 | Role-Based Authentication & Login | Web Login Portal (`http://localhost:5173`) | Demonstrating secure JWT login across 4 personas: Admin, Regional Manager, Analyst, and Store Manager. |
| 3 | 01:30 - 02:15 | Dataset Generation Execution | PowerShell CLI running `data_generator.master_generator` | Generating 11 relational tables across 20 stores, 150 dishes, 50k customers, and 100k+ orders with synthetic anomalies. |
| 4 | 02:15 - 03:00 | Big Data Ingestion & Schema Enforce | CLI running `spark_jobs.ingestion.load_csv` | PySpark explicit StructType schema validation, partition handling, and 1M+ order lines loading. |
| 5 | 03:00 - 03:45 | Data Quality & Automated Cleaning | CLI running `spark_jobs.cleaning.cleaning_rules` | Automated detection of missing values, negative prices, range violations, and quarantine handler logging. |
| 6 | 03:45 - 04:30 | Relational Joins & Spark SQL Queries | CLI running `spark_jobs.integration.join_pipeline` | Executing distributed joins across all 10 domain entities; running multi-level Spark SQL window ranking queries. |
| 7 | 04:30 - 05:15 | Feature Engineering & Parquet Export | Parquet Inspector / VSCode Data Viewer | Reviewing 11 menu features, 7 customer features, and RFM metrics saved to partitioned columnar Parquet files. |
| 8 | 05:15 - 06:00 | Menu Profitability Breakdown | Menu Intelligence Dashboard (UI) | Visualizing the 10-dimensional profitability table; demonstrating margin distribution across categories. |
| 9 | 06:00 - 06:45 | Menu 4-Quadrant Classification Matrix | Menu Intelligence Dashboard (UI) | Showing Profit Drivers (31 items), Volume Drivers (39), Hidden Opportunities (9), and Low Performers (71). |
| 10 | 06:45 - 07:30 | Customer Segmentation & RFM Analysis | Customer Intelligence Dashboard (UI) | Exploring the 6 customer segments (Loyal, At-Risk, Occasional, etc.) and RFM quantile distributions. |
| 11 | 07:30 - 08:15 | Market-Basket Analysis (FP-Growth) | Basket Analysis View & Top Combinations | Revealing top association rules, high-lift item pairings (e.g. burger + truffle fries + lager, lift 1.45). |
| 12 | 08:15 - 09:00 | Peak-Period & Channel Analytics | Executive Dashboard (Hourly & Day-of-Week Charts) | Demonstrating lunch (12 PM) and dinner (6 PM) peaks, and weekend revenue clustering (52% of sales). |
| 13 | 09:00 - 09:45 | Demand Forecasting (Prophet & ARIMA) | Forecast Dashboard (UI) | 30-day forward demand projections, actual vs predicted curves, and holiday weekend surge alerts (+34%). |
| 14 | 09:45 - 10:30 | Food Wastage Risk Modeling | Wastage Dashboard (UI) | Analyzing $3.2M chain wastage; Gradient Boosted Regressor (MAE 0.987) predicting high-risk dish spoilage. |
| 15 | 10:30 - 11:15 | Econometric Price Sensitivity Engine | Pricing Intelligence View (UI) | Log-log price elasticity models; identifying 106 elastic items vs 22 inelastic items with pricing power. |
| 16 | 11:15 - 12:00 | Promotion Effectiveness & Trap Audit | Promotion Analytics View (UI) | Auditing 12 promotions against the 5 SRS Promotion Traps; demonstrating margin erosion on PROMO-012. |
| 17 | 12:00 - 12:45 | Operational Anomaly Detection | System Operations & Anomaly Alert View | Flagging 14,457 anomalies: duplicate charges, unauthorized cashier overrides (>60%), and rating drops. |
| 18 | 12:45 - 13:30 | Spark MLlib Model Inference | System Operations / Model Registry | Inspecting distributed Logistic Regression and Random Forest model metrics and saved pipeline artifacts. |
| 19 | 13:30 - 14:15 | Python Data Science Model Inference | Python ML Pipeline Terminal Output | Reviewing XGBoost churn model ROC-AUC (0.91) and Scikit-Learn menu classifier accuracy (88.5%). |
| 20 | 14:15 - 15:00 | Dual-Pipeline Comparison Audit | Dual-Pipeline Comparison Dashboard (UI) | Side-by-side Spark vs Python classification of 150 items; 96.0% agreement; algorithmic disagreement reasons. |
| 21 | 15:00 - 15:45 | Evidence-Backed Recommendation Engine | Executive Dashboard / Prescriptive View | Presenting 57 prioritized actions with exact Step 38 bullet evidence (Action + Reason) and priority tiers. |
| 22 | 15:45 - 16:30 | What-If Scenario Simulation Engine | What-If Simulation Sandbox (UI) | Live simulation of menu price increase and prep reduction; verifying simulation estimate disclaimers. |
| 23 | 16:30 - 17:15 | Difficult Contradictory Business Case | Edge Case Deep-Dive View | Demonstrating the High-Selling Loss-Making dish (Wagyu Burger with mispriced ingredient cost) and resolution. |
| 24 | 17:15 - 18:00 | Report Exporting & Test Suite Pass | Report Download Modal & `pytest` CLI | Exporting CSV/Excel reports and running pytest showing 223/223 tests passing. Closing remarks. |

---

## Detailed Step-by-Step Presenter Narration

### Segment 20: Dual-Pipeline Comparison Demo (Timecode: 14:15)
- **Visual:** Open `http://localhost:5173`, navigate to **Dual-Pipeline Comparison** tab.
- **Presenter (Nasrullah Memon):**
  > "One of the flagship architectural requirements of SRS Deliverable #7 is our Dual-Pipeline Comparison engine. Here on screen, you see our automated comparison of all 150 menu items evaluated independently across Apache Spark MLlib on the left and Python Scikit-Learn on the right. Notice that our overall consensus rate is 96.0%. When we examine the 6 disagreement cases—such as `ITEM-045 Linguine alle Vongole`—DineIQ automatically generates mathematical diagnostics explaining that Python's `RobustScaler` handled sales volume outliers differently from Spark's linear quantile normalization. Both models provide full confidence scores and version tagging, completely eliminating black-box opacity."

### Segment 22: What-If Simulation Demo (Timecode: 15:45)
- **Visual:** Navigate to **What-If Simulation** widget.
- **Presenter:**
  > "Under SRS Steps 40 and 41, restaurant operators can model hypothetical business interventions before risking capital. Let's select scenario #1: 'Increase Menu Price' by +10% on `ITEM-046 Center-Cut Filet Mignon`. The engine immediately recalculates projected demand using our econometric elasticity coefficient of -0.42, showing a contribution margin expansion of +$24,800. Notice that in strict compliance with SRS Step 41, all outputs prominently display the amber banner: *Simulated Outputs are Analytical Estimates Rather Than Actual Historical Results*."

### Segment 23: Difficult Case Demonstration (Timecode: 16:30)
- **Visual:** Navigate to Menu Intelligence, filter by Tricky Scenario: *High-Selling Loss-Making Dish*.
- **Presenter:**
  > "SRS Deliverable #9 requires demonstrating difficult contradictory business cases. Here we examine Dish `ITEM-TEST-BURGER`. It ranks as our #1 volume driver with over 18,000 units sold, giving the illusion of immense success. However, our 10-dimensional profit engine reveals that due to unhedged truffle oil and imported beef wholesale price inflation, each plate loses -$1.20, generating a cumulative operating deficit of -$21,600. The recommendation engine flags this with Critical Priority, instructing kitchen management to re-negotiate procurement or reformulate the recipe rather than continuing to promote a loss-leader."

---
*Script approved for video recording by Team Inside Hunters SFC.*
