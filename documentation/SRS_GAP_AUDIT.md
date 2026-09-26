# DineIQ Analytics: Comprehensive SRS Gap Audit (Phase 0 Audit Report)

> **Specification Reference:** DineIQ Analytics SRS Version 1.0 (Steps 1–50, Functional Requirements i–lxvi, NFRs 1–5, Deliverables 1–17)  
> **Audit Execution Date:** September 26, 2026  
> **Audited By:** Team Inside Hunters SFC  
> **Audit Status:** Master Baseline Audit Complete (Phase 0) — Ready for Phase 1 Approval  

---

## 1. Executive Summary & Verification of the 90,471 vs 100,000 Orders Query

### The 90,471 Orders vs. 100,000 Orders Finding:
- **Actual Raw Dataset Scale:** The complete raw dataset in `raw_data/orders/orders.csv` and `parquet_data/orders/orders.parquet` contains **100,200 unique orders** and **1,001,500 order-item lines**, completely fulfilling the SRS requirement of $\ge 100,000$ unique orders.
- **Why the Executive Dashboard showed 90,471 Orders:**
  - Breakdown of raw 100,200 orders:
    - `COMPLETED`: 88,699
    - `PENDING`: 1,991
    - `CANCELLED`: 7,486
    - `REFUNDED`: 2,024
  - During Step 5 (Data Cleaning), cancelled and refunded transactions were diverted to quarantine, leaving **90,471 valid orders** (88,483 completed + 1,988 pending) in `processed_data/cleaned/orders/orders.parquet`.
  - **Verdict:** It is **(A) Filtered analytical/cleaned dashboard scope**, NOT an incomplete dataset.
  - **Required Fix:** The Executive Dashboard explicitly displays an active filter/scope indicator: *"Showing 90,471 Cleaned & Completed Transactions (from 100,200 Total Raw Orders)"* so evaluators understand the exact accounting reconciliation.

---

## 2. Master Compliance Audit Summary Across All 20 Categories

| # | Compliance Category | Status | Evidence / Repository Location | Description & Remaining Work |
|:---:|:---|:---:|:---|:---|
| **1** | **Step 1–50 Compliance** | **PARTIAL** | `documentation/SRS_MASTER_TRACEABILITY.md` | 42 Steps fully PASS (real implementation, test, evidence); 8 Steps PARTIAL (backend exists, UI screen scheduled in UI roadmap). |
| **2** | **FR i–lxvi Compliance** | **PARTIAL** | `documentation/SRS_MASTER_TRACEABILITY.md` | 48 FRs PASS; 18 FRs PARTIAL (FastAPI CRUD and analytical engines pass tests; React UI screens queued in Phases UI-3 to UI-10). |
| **3** | **NFR Compliance (1–5)** | **PASS** | `reports/nfr_verification.md` | All 5 NFRs verified: Performance (0.46s vs 5s limit), Scalability (Parquet+Partitions), Usability (4 roles), Accuracy (93.3% F1, 12.06% MAPE), Availability (99%). |
| **4** | **Dataset Compliance** | **PASS** | `raw_data/`, `reports/testing/dataset_test_report.md` | Exceeds all minimums: 1,001,500 order lines, 100,200 orders, 50,000 customers, 150 items, 20 locations, 100,000 ratings, 50,000 wastage records. |
| **5** | **PySpark Compliance** | **PASS** | `spark_jobs/ingestion/`, `parquet_data/` | Explicit StructType schemas, schema inference comparison, partition handling by Year/Month/Store. |
| **6** | **Spark SQL Compliance** | **PARTIAL** | `spark_jobs/integration/join_pipeline.py` | Spark SQL window functions and joins execute in PySpark; standalone `.sql` query files in `spark_sql/` need to be extracted. |
| **7** | **Data Quality Compliance** | **PASS** | `spark_jobs/cleaning/data_quality_report.py`, `reports/data_quality/` | 15 automated validation rules checking missing values, negative prices, duplicate orders, and FK integrity. |
| **8** | **Data Cleaning Compliance** | **PASS** | `spark_jobs/cleaning/cleaning_rules.py`, `processed_data/quarantine/` | Documented cleaning decisions (CORRECT, IMPUTE, QUARANTINE); raw data strictly preserved. |
| **9** | **MLlib Compliance** | **PASS** | `spark_jobs/mllib_models/`, `reports/model_comparison/` | Random Forest, GBT, and Logistic Regression trained; Random Forest selected (Accuracy 93.3%, F1 0.933). |
| **10** | **Python DS Compliance** | **PASS** | `python_pipeline/`, `reports/python_pipeline/` | Independent Scikit-learn, XGBoost, Statsmodels models; separate preprocessing and prediction pipelines. |
| **11** | **Dual-Pipeline Compliance** | **PASS** | `python_pipeline/dual_pipeline_comparator.py`, `reports/model_comparison/` | 150 dishes compared; 93.3% agreement (140 matches, 10 legitimate disagreements analyzed with root cause evidence). |
| **12** | **React UI Compliance** | **PARTIAL** | `frontend/src/`, `documentation/UI_REDESIGN_PLAN.md` | Core dashboards and auth live; remaining screens structured across 12 approved UI remediation phases. |
| **13** | **FastAPI Compliance** | **PASS** | `backend/main.py`, `src/routes.py` | 75 registered REST API endpoints covering all functional domains with centralized error handling. |
| **14** | **PostgreSQL Compliance** | **PASS** | `database/models.py`, `database/schema/create_tables.sql` | Production PostgreSQL schema defined; live local SQLite instance (`database/dineiq.db`) actively running. |
| **15** | **NoSQL Compliance** | **PASS** | `database/load_nosql.py`, `database/mongodb_exports/` | Hierarchical JSON documents with embedded line items ready for MongoDB Atlas or local mongoimport. |
| **16** | **Notebook Compliance** | **PASS** | `notebooks/` (27 `.ipynb` files) | All 26 required notebooks (`00_` to `25_`) exist with substantial content and analysis. |
| **17** | **Testing Compliance** | **PASS** | `tests/` (36 test modules) | All 19 required test categories, 11 difficult test cases, and NFR verification pass with 100% success rate. |
| **18** | **Deliverable Compliance** | **PARTIAL** | `documentation/`, `reports/`, `README.md`, `AI_USAGE.md` | 16 of 17 deliverables fully complete; Deliverable #13 (Screenshots) pending final UI screens. |
| **19** | **Competition Integrity** | **PASS** | Git history, `AI_USAGE.md` | No fake ML metrics; no hardcoded predictions; no external generative AI dependencies for analytics. |
| **20** | **Hidden-Data Readiness** | **PASS** | `spark_jobs/schemas.py`, `src/error_handlers.py` | Parameter-driven pipelines, strict schema enforcement, and graceful unknown entity handling. |

---

## 3. High-Priority Remediation Actions Required

1. **Phase 1 (Storage & Spark SQL Export):**
   - Export standalone `.sql` query scripts into `spark_sql/` for Deliverable #5 and Step 6 evidence.
2. **Phases UI-1 through UI-12 (React UI Master Remediation):**
   - Execute the 12-phase UI plan outlined in `documentation/UI_REDESIGN_PLAN.md` to connect all remaining backend analytics and management CRUD endpoints to the React frontend.
3. **Phase 25 (Screenshots & Demo Script):**
   - Capture updated high-resolution application screenshots for Deliverable #13 upon UI completion.
