# DineIQ Analytics — Master Evaluator Jupyter Notebooks

This directory contains the **two primary, production-grade Jupyter Notebooks** designed for evaluator demonstration and evidence verification, fully implementing the requirements of the DineIQ Software Requirements Specification (SRS).

All previous granular development notebooks have been preserved in the `archive/` subfolder, leaving the root directory clean and focused for evaluation.

---

## The Two Master Notebooks

```
notebooks/
├── 01_DineIQ_Complete_Analytics.ipynb   # Master Analytics, Big Data, ML & Prescriptive Evidence (Sections 1–68)
├── 02_DineIQ_Data_Cleaning.ipynb        # Master Data Quality, 15 Cleaning Rules & Quarantine Audit (Sections 1–36)
├── README.md                            # Directory Guide & Execution Instructions (this file)
└── archive/                             # Granular individual notebooks (00 to 25) preserved for reference
```

---

### Notebook 1: `01_DineIQ_Complete_Analytics.ipynb`
**Title:** DineIQ Analytics — Enterprise Master Analytics & Big Data Evidence  
**Scope:** Covers all analytical, machine learning, and business intelligence requirements in a single, top-to-bottom executable document.

#### Core Analytical Sections (1 to 68):
1. **Introduction & SRS Objectives (Sections 1–2):** Project goals, multi-location hospitality problems, and empirical validation mandates.
2. **Environment & Spark Session (Sections 3–5):** Python 3.14.3, PySpark 4.2.0, Adaptive Query Execution (AQE), Windows 8.3 short-path resolution.
3. **Dataset Ingestion & Integrity (Sections 6–15):** Loading 11 operational tables (1.19M+ rows), explicit PySpark `StructType` schema validation, and PK/FK referential integrity checks.
4. **Data Integration & Joins (Section 16):** PySpark multi-table joins materializing the `fact_order_analytics` distributed view (904,502 fact records).
5. **Exploratory Data Analysis (Section 17):** Revenue distributions, order status breakdowns, hourly dining patterns, and payment method shares.
6. **Feature Engineering (Section 18):** Full derivation of **ALL 22 SRS Features** (menu margins, customer cadence, RFM, promotion sensitivity).
7. **Production Spark SQL Analysis (Section 19):** Declarative SQL queries executing revenue trends, category margins, and location benchmarks.
8. **Menu Profitability & BCG Classification (Sections 20–22):** 10-dimensional menu profitability analysis, 4 BCG categories (*Profit Drivers, Volume Drivers, Hidden Opportunities, Low Performers*), and detection of 10 tricky menu scenarios.
9. **Customer Intelligence & RFM (Sections 23–24):** 10-factor customer segmentation and 5-quintile statistical scoring ($R, F, M \in [1, 5]$).
10. **Market Basket Analysis & Bundles (Sections 25–26):** Apriori association rule mining (Support, Confidence, Lift) for menu bundling.
11. **Peak Periods & Demand Forecasting (Sections 27–28):** Hourly peak kitchen pressure heatmaps and ARIMA / SARIMAX 30-day time-series forecasting.
12. **Wastage, Pricing & Promotions (Sections 29–33):** Financial loss by wastage reason, price elasticity of demand, and misleading promotion trap detection.
13. **Anomalies, Location Benchmarking & Churn (Sections 34–41):** IQR & Z-score outlier detection, branch cost-index benchmarking, and customer churn risk modeling.
14. **Apache Spark MLlib Distributed Pipeline (Sections 42–49):** Distributed model training across Logistic Regression, Decision Tree, Random Forest, and GBT with holdout evaluation.
15. **Independent Python ML Pipeline (Sections 50–57):** Scikit-Learn and XGBoost models trained on clean data with zero data leakage.
16. **Dual-Pipeline Cross-Engine Parity Audit (Sections 58–61):** Comparing distributed Spark MLlib vs Python Scikit-Learn/XGBoost on identical holdout test sets.
17. **Evidence-Based Prescriptions & What-If Simulations (Sections 62–66):** ROI-ranked business recommendations, parametric price/cost/wastage what-if scenario simulations, and executive scorecards.
18. **Limitations, Assumptions & Traceability (Sections 67–68):** Operational boundary conditions and full SRS traceability matrix.

---

### Notebook 2: `02_DineIQ_Data_Cleaning.ipynb`
**Title:** DineIQ Analytics — Enterprise Data Quality & Cleaning Evidence Notebook  
**Scope:** Demonstrates the end-to-end data cleaning, remediation, and quarantine isolation process starting from raw operational feeds.

#### Core Cleaning Sections (1 to 36):
1. **Cleaning Objective & Rules (Sections 1, 7):** Enterprise data governance: raw data immutability, no silent `.dropna()` drops, and explicit remediation actions (`CORRECT`, `STANDARDIZE`, `IMPUTE`, `REMOVE`, `QUARANTINE`).
2. **Raw Dataset Audit (Sections 2–6):** Initial row counts (99,945 raw orders, 1,001,415 items), missing value profiles, and data quality summary table.
3. **Step-by-Step Remediation of ALL 15 SRS Issues (Sections 8–24):**
   - **Rule 01:** Missing values (table numbers imputed, guest customer IDs assigned).
   - **Rule 02:** Duplicate orders quarantined (200 records).
   - **Rule 03:** Duplicate order lines quarantined (1,500 records).
   - **Rule 04:** Invalid menu prices quarantined (8 records).
   - **Rule 05:** Negative order quantities quarantined (50 records).
   - **Rule 06:** Invalid and impossible calendar dates quarantined (25 records, e.g. Feb 31).
   - **Rule 07:** Out-of-bounds ratings quarantined (45 records).
   - **Rule 08:** Missing customer IDs imputed with `CUST-GUEST`.
   - **Rule 09:** Missing menu IDs quarantined (35 records).
   - **Rule 10:** Invalid restaurant IDs quarantined (30 records).
   - **Rule 11:** Impossible wastage quantities quarantined (25 records).
   - **Rule 12:** Incorrect discounts capped at subtotal and financial totals recalculated.
   - **Rule 13:** Cancelled transactions isolated to `orders_cancelled` (9,474 records).
   - **Rule 14:** Inconsistent units standardized.
   - **Rule 15:** Invalid location references in wastage quarantined (30 records).
   - **Cascaded Quarantine:** 95,413 order lines referencing quarantined orders safely isolated.
4. **Quarantine Trail & Manifest (Section 24):** Manifest verification linking quarantined files in `processed_data/quarantine/` with audit metadata.
5. **BEFORE vs AFTER Comparison (Sections 25–26):** Side-by-side comparison tables showing dirty baseline vs clean production counts.
6. **Post-Cleaning Validation & Referential Integrity (Sections 27–28):** Verification of non-negative values, valid dates, and zero orphan foreign keys.
7. **Columnar Parquet Lake Persistence (Sections 29–32):** Exporting Snappy-compressed Parquet tables into `processed_data/cleaned/` and verifying reload speed.
8. **Audit Trail & Traceability (Sections 33–36):** Verification of `cleaning_log.md` and SRS requirement mapping.

---

## How to Run the Notebooks

### Option A: Using Visual Studio Code (Recommended)
1. Open the project folder in VS Code.
2. Open either [`01_DineIQ_Complete_Analytics.ipynb`](file:///c:/Users/HP%20250%20G9/OneDrive/Desktop/techwiz-Inside%20Hunters%20SFC/notebooks/01_DineIQ_Complete_Analytics.ipynb) or [`02_DineIQ_Data_Cleaning.ipynb`](file:///c:/Users/HP%20250%20G9/OneDrive/Desktop/techwiz-Inside%20Hunters%20SFC/notebooks/02_DineIQ_Data_Cleaning.ipynb).
3. In the top-right kernel selector, choose the project Python environment:  
   `.\dineiq_env\Scripts\python.exe` (Python 3.14.3).
4. Click **Run All** to execute all cells. Both notebooks execute in under 45 seconds with 0 errors.

### Option B: Using JupyterLab / Jupyter Notebook
Launch Jupyter from the project root:
```powershell
.\dineiq_env\Scripts\python.exe -m jupyter notebook
```
Navigate to `notebooks/` and select either master notebook.

### Option C: Re-executing via Automation Scripts
Both notebooks can be re-compiled and executed headlessly via their builder scripts:
```powershell
# Re-compile and execute Notebook 1 (Analytics Master)
.\dineiq_env\Scripts\python.exe scripts/build_complete_analytics_notebook.py

# Re-compile and execute Notebook 2 (Data Cleaning Master)
.\dineiq_env\Scripts\python.exe scripts/build_data_cleaning_notebook.py
```
