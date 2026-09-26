# DineIQ Analytics: Complete SRS Gap Audit (Phase 1 Deliverable)

> **Specification Reference:** DineIQ SRS Version 1.0 (Steps 1–50, Functional Requirements i–lxvi, NFRs 1–5, Deliverables 1–17)  
> **Audit Execution Date:** September 26, 2026  
> **Audited By:** Team Inside Hunters SFC  
> **Audit Status:** Strict Evaluation Complete — Ready for Phase 2 Approval  

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
  - **Required Fix:** The Executive Dashboard must explicitly display an active filter/scope indicator: *"Showing 90,471 Cleaned & Completed Transactions (from 100,200 Total Raw Orders)"* so evaluators understand the exact accounting reconciliation.

---

## 2. Master SRS Gap Audit Matrix

| Requirement | SRS ID | Existing Implementation | Frontend | API | Backend | Data Source | Test | Evidence | Status | Problem | Required Fix |
|:---|:---:|:---|:---:|:---|:---|:---|:---|:---|:---:|:---|:---|
| **User Login & Authentication** | `FR-i`, `Step 1` | JWT Auth in `src/routes.py` with 4 roles | Missing | `POST /api/v1/auth/login`, `GET /api/v1/auth/me` | `src/auth.py`, `src/routes.py` | SQLite/Postgres `users`, `roles` | `tests/test_srs_crud_routes.py` | 5 pre-seeded test accounts, JWT issuance | **PARTIAL** | Backend API works but React UI has no login page or AuthContext | Build `/login` React page, AuthContext, token storage, and session guard |
| **Role-Based Access Control** | `FR-ii` | RBAC decorators for 4 roles | Missing | FastAPI route dependencies | `src/routes.py` | SQLite/Postgres `roles` | `tests/test_srs_crud_routes.py` | Role-based 403 enforcement | **PARTIAL** | RBAC enforced in FastAPI, but React has no RoleGuard or role-based sidebar rendering | Build `RoleGuard.jsx`, `ProtectedRoute.jsx`, filter sidebar items by role |
| **Restaurant Location CRUD** | `FR-iii`, `Step 1` | CRUD API for 20 stores | Missing | `GET/POST /api/v1/locations`, `PUT/DELETE .../{id}` | `src/routes.py` | SQLite/Postgres `restaurants` | `tests/test_srs_crud_routes.py` | 20 stores listed, create/update/delete tested | **PARTIAL** | Complete FastAPI CRUD exists, but React frontend has no Location Management screen | Build `/management/locations` with searchable table, add modal, edit drawer, delete confirm |
| **Menu Categories Management** | `FR-iv`, `Step 1` | Category list & creation API | Missing | `GET/POST /api/v1/menu/categories` | `src/routes.py` | SQLite/Postgres `menu_categories` | `tests/test_srs_crud_routes.py` | 10 categories returned | **PARTIAL** | API exists; React has no category management view | Build `/management/categories` grid and creation modal |
| **Menu Items CRUD & Status** | `FR-iv`, `Step 1` | 150 items CRUD with cost, margin, availability | Missing | `GET/POST /api/v1/menu/items`, `PUT .../{id}`, `PATCH .../availability` | `src/routes.py` | SQLite/Postgres `menu_items` | `tests/test_srs_crud_routes.py` | Availability toggle and item edits verified | **PARTIAL** | API exists; React has no operational menu management page | Build `/management/menu-items` table with cost, price, margin, veg/alcohol pills, availability toggle |
| **Pricing History Management** | `FR-v`, `Step 1` | Historical price tracking API | Missing | `GET/POST /api/v1/pricing-history` | `src/routes.py` | SQLite/Postgres `pricing_history` | `tests/test_srs_crud_routes.py` | 546 historical price changes tracked | **PARTIAL** | API exists; React has no historical pricing timeline | Build `/management/pricing-history` timeline view and change log |
| **Customer Data Management** | `FR-vi`, `Step 1` | 50k customer profiles API | Missing | `GET/POST /api/v1/customers`, `GET/PUT .../{id}` | `src/routes.py` | SQLite/Postgres `customers` | `tests/test_srs_crud_routes.py` | Anonymized profile lookups | **PARTIAL** | API exists; React has no customer lookup/detail page | Build `/management/customers` searchable table and customer detail drawer |
| **Order Management & Lines** | `FR-vii`, `Step 1` | Headers + lines with channels | Missing | `GET/POST /api/v1/orders`, `GET .../{id}`, `PATCH .../status` | `src/routes.py` | SQLite/Postgres `orders`, `order_items` | `tests/test_srs_crud_routes.py` | Channel and line item retrieval | **PARTIAL** | API exists; React has no Order Explorer screen | Build `/management/orders` table with channel badges, order line expansion, status updates |
| **Promotion Management** | `FR-viii`, `Step 1` | Campaign periods, discounts | Missing | `GET/POST /api/v1/promotions`, `PUT .../{id}` | `src/routes.py` | SQLite/Postgres `promotions` | `tests/test_srs_crud_routes.py` | 12 promotion campaigns | **PARTIAL** | API exists; React has no promotion management UI | Build `/management/promotions` campaign cards and add/edit form |
| **Rating Records Management** | `FR-ix`, `Step 1` | Rating submissions linked to items/stores | Missing | `GET/POST /api/v1/ratings` | `src/routes.py` | SQLite/Postgres `ratings` | `tests/test_srs_crud_routes.py` | Ratings linked to item and restaurant | **PARTIAL** | API exists; React has no ratings review table | Build `/management/ratings` guest review feed with star ratings and sentiment badges |
| **Inventory Management** | `FR-x`, `Step 1` | Stock, unit, threshold, replenishment | Missing | `GET/POST /api/v1/inventory`, `PUT .../{id}` | `src/routes.py` | SQLite/Postgres `inventory` | `tests/test_srs_crud_routes.py` | 26k inventory tracking records | **PARTIAL** | API exists; React has no inventory stock workbench | Build `/management/inventory` with low-stock alerts, progress bars, and restock actions |
| **Operational Wastage Log** | `FR-xi`, `Step 1` | Daily wastage logging with reasons | Missing | `GET/POST /api/v1/wastage`, `DELETE .../{id}` | `src/routes.py` | SQLite/Postgres `wastage` | `tests/test_srs_crud_routes.py` | Wastage incident logging | **PARTIAL** | Operational CRUD API exists; React only has analytical wastage dashboard | Build `/management/wastage` operational incident logging interface |
| **Big Data CSV Ingestion** | `FR-xii`, `Step 3` | PySpark explicit StructType schema loader | Missing | Internal Spark Job | `spark_jobs/ingestion/load_csv.py` | `raw_data/*.csv` | `tests/test_spark_ingestion.py` | 1,001,500 lines loaded in 3.4s | **PARTIAL** | PySpark script works, but no Data Ingestion monitoring UI | Build `/data-engineering/ingestion` showing file sizes, partition counts, schema status |
| **Schema Validation Engine** | `FR-xiii`, `Step 3` | Null, type, range, FK checks | Missing | Internal Spark Job | `spark_jobs/ingestion/schema_validation.py` | CSV/Parquet Schemas | `tests/data/test_data_validation.py` | Schema enforcement logs | **PARTIAL** | Validations execute via CLI/tests; no UI dashboard | Build `/data-engineering/schema-validation` showing column contracts and validation results |
| **Data Quality Assessment** | `FR-xiv`, `Step 4` | Missing, duplicates, negative prices, invalid dates | Missing | `reports/data_quality/dq_report.json` | `spark_jobs/cleaning/data_quality_report.py` | Raw CSV files | `tests/test_data_quality_report.py` | `reports/data_quality/cleaning_log.md` | **PARTIAL** | Backend report generated, but no interactive Data Quality UI | Build `/data-engineering/data-quality` with KPI cards (Total, Valid, Quarantined) and drill-down |
| **Data Cleaning & Quarantine** | `FR-xv`, `Step 5` | Interception and quarantine of malformed rows | Missing | Internal Spark Job | `spark_jobs/cleaning/cleaning_rules.py`, `quarantine_handler.py` | `processed_data/quarantine/` | `tests/test_cleaning_pipeline.py` | Quarantined records logged | **PARTIAL** | Cleaning works, but no before/after validation screen in UI | Build `/data-engineering/data-cleaning` before/after comparison table |
| **Spark Relational Integration** | `FR-xvi`, `Step 6` | Distributed joins across all 10 domain entities | Missing | Internal Spark Job | `spark_jobs/integration/join_pipeline.py` | Spark TempViews | `tests/test_join_pipeline.py` | Relational join parquet outputs | **PARTIAL** | Joins execute in Spark, but no visual join verification in UI | Build `/data-engineering/data-integration` relationship graph and join metrics |
| **Spark SQL Processing** | `FR-xvi`, `Step 6` | Window aggregations & rankings | Missing | Internal Spark Queries | `spark_jobs/integration/join_pipeline.py` | Spark SQL TempViews | `tests/test_srs_deliverable_9_categories.py` | Multi-level window queries | **PARTIAL** | Spark SQL embedded in Python; no standalone `.sql` files in `spark_sql/` and no UI | Create real `.sql` files in `spark_sql/` and build `/data-engineering/spark-sql` page |
| **Columnar Parquet Storage** | `FR-xvii, xviii`, `Step 2` | Snappy compressed partitions by Year/Month/Store | Missing | Parquet Files | `parquet_data/partitioned/` | 20 location partitions | `tests/data/test_storage_integration.py` | Verified 78% storage reduction | **PASS** | Fully implemented in backend storage; UI exposure via System Ops | Connect Parquet partition telemetry to Data Engineering UI |
| **All 22 Feature Engineering** | `FR-xix`, `Step 7` | 11 menu features + 11 customer/behavioral features | Missing | Feature Parquet | `spark_jobs/feature_engineering/save_to_parquet.py` | `parquet_data/features/` | `tests/test_feature_engineering.py` | All 22 features verified in Parquet | **PASS** | Implemented in PySpark; needs interactive Feature Catalog UI | Build `/data-engineering/feature-engineering` catalog with formulas and source columns |
| **Exploratory Data Analysis** | `Step 8` | Comprehensive 13-dimension EDA | Missing | CLI Script | `python_pipeline/statistical_analysis.py` | Parquet datasets | `tests/test_eda_notebook.py` | `notebooks/01_eda.ipynb` | **PARTIAL** | Script exists and 1 notebook exists; no interactive EDA screen in UI | Build `/analytics/eda` screen displaying top/lowest selling, highest revenue, and margins |
| **Menu Profitability (10 Dims)** | `FR-xx`, `Step 9` | 10-dimensional unit and dollar margins | Menu Dashboard | `GET /api/v1/menu-intelligence` | `python_pipeline/menu_classification_python.py` | `menu_classification.parquet` | `tests/test_menu_classification.py` | 10 metrics calculated | **PASS** | Working in backend and partially in React UI | Preserve existing card; add location filter and CSV drilldown |
| **Menu 4-Quadrant BCG Matrix** | `FR-xxi`, `Step 10` | Profit Driver, Volume Driver, Hidden Opp, Low Performer | Menu Dashboard | `GET /api/v1/menu-intelligence` | `python_pipeline/menu_classification_python.py` | `menu_classification.parquet` | `tests/test_menu_classification.py` | 31 Profit Drivers, 39 Volume, 9 Hidden, 71 Low | **PASS** | Working in backend and React UI | Preserve scatter plot; add tricky case badges |
| **10 Tricky Menu Cases** | `Step 11` | High-selling loss-makers, excessive waste populars | Menu Dashboard | `GET /api/v1/menu-intelligence` | `python_pipeline/menu_classification_python.py` | `menu_classification.parquet` | `tests/test_srs_11_difficult_cases.py` | 10 tricky scenarios flagged | **PASS** | Working in backend and React UI | Preserve existing table; add server action recommendations |
| **Peak-Period Detection** | `FR-xxii`, `Step 19` | Peak hours (12 PM, 6 PM), weekend clusters (52%) | Executive Dashboard | `GET /api/v1/dashboard/executive` | `python_pipeline/channels/channel_analysis.py` | `orders.parquet` | `tests/test_executive_dashboard.py` | Peak hours identified | **PARTIAL** | Embedded in Executive Dashboard; no dedicated Peak Period view | Build `/analytics/peak-periods` with 24-hr heatmap and dine-in vs delivery peak comparison |
| **Customer Segmentation (6 Groups)** | `FR-xxiii`, `Step 15` | High-Value Loyal, Frequent, Promo-Driven, At-Risk, New, Occasional | Customer Dashboard | `GET /api/v1/customer-intelligence/segments` | `spark_jobs/customer_segmentation.py` | `customer_segments.parquet` | `tests/test_customer_segmentation.py` | 50,000 customers segmented | **PASS** | Working in backend and React UI | Preserve distribution chart; link directly to customer management |
| **RFM Analysis** | `FR-xxiv`, `Step 16` | Recency, Frequency, Monetary quintiles (1-5) | Customer Dashboard | `GET /api/v1/customer-intelligence` | `spark_jobs/feature_engineering/rfm_features.py` | `rfm_features.parquet` | `tests/test_customer_segmentation.py` | RFM scores assigned | **PARTIAL** | Embedded in Customer Dashboard; lacks individual customer RFM score explorer | Build `/analytics/rfm-analysis` table showing exact R, F, M scores and segment mapping |
| **Market-Basket Analysis** | `FR-xxv, xxvi`, `Step 17` | FP-Growth Support, Confidence, Lift across 90k orders | Missing | Missing Endpoint | `python_pipeline/basket_analysis/apriori_rules.py` | `basket_analysis_report.json` | `tests/test_basket_analysis.py` | Top rules mined (Lift up to 1.62) | **PARTIAL** | Python script and report exist; no FastAPI endpoint or React screen | Add `GET /api/v1/analytics/basket-analysis` and build `/analytics/basket-analysis` UI |
| **Bundle Recommendations** | `FR-xxvii`, `Step 18` | Combo meal pairing, cross-sell/upsell suggestions | Missing | Missing Endpoint | `python_pipeline/basket_analysis/apriori_rules.py` | `basket_analysis_report.json` | `tests/test_basket_analysis.py` | Burger + Fries + Beer bundle | **PARTIAL** | Recommendations exist in backend; no UI screen | Add bundle viewer to Market Basket UI with association-rule evidence |
| **Predictive Demand Forecasting** | `FR-xxviii, xxix, lvi`, `Steps 20-22, 46` | Prophet + seasonal ARIMA 30d forecast, MAE/RMSE/MAPE | Missing | Missing Endpoint | `python_pipeline/forecasting/demand_forecast.py` | `item_demand_forecast.parquet` | `tests/test_demand_forecasting.py` | 12.06% aggregate MAPE beats baseline | **PARTIAL** | Working backend model and parquet output; no dedicated Forecast Dashboard in React | Add `GET /api/v1/analytics/demand-forecasting` and build `/analytics/demand-forecasting` UI |
| **Wastage Intelligence** | `FR-xxx`, `Step 23` | Food waste by item, category, location, shift | Wastage Dashboard | `GET /api/v1/wastage/trends`, `GET .../items` | `python_pipeline/wastage/wastage_risk_model.py` | `wastage_by_item.parquet` | `tests/test_wastage_dashboard.py` | $3.2M loss breakdown | **PASS** | Working in backend and React UI | Preserve existing charts; add made-to-order prep par button |
| **Wastage Risk Prediction** | `FR-xxxi, lv`, `Steps 24, 45` | Gradient Boosted Classifier/Regressor predicting high-waste | Wastage Dashboard | `GET /api/v1/wastage/predictions` | `python_pipeline/wastage/wastage_risk_model.py` | `wastage_risk_predictions.parquet` | `tests/test_wastage_risk.py` | ROC-AUC 0.9659, MAE 0.987 | **PASS** | Working in backend and React UI | Preserve table; link to inventory planning |
| **Price-Sensitivity Intelligence** | `FR-xxxii`, `Steps 25-26` | Log-log price elasticity regressions, 3 sensitivity tiers | Missing | Missing Endpoint | `python_pipeline/pricing/price_sensitivity.py` | `price_sensitivity_report.json` | `tests/test_price_sensitivity.py` | 106 Elastic vs 22 Inelastic SKUs | **PARTIAL** | Python script and report exist; no FastAPI endpoint or React screen | Add `GET /api/v1/analytics/price-intelligence` and build `/analytics/price-intelligence` UI |
| **Promotion Effectiveness** | `FR-xxxiii`, `Step 27` | ROI, AOV, order volume, repeat purchase | Missing | Missing Endpoint | `python_pipeline/promotion/promotion_effectiveness.py`| `promotion_effectiveness_report.json` | `tests/test_promotion_effectiveness.py`| 12 promotions evaluated | **PARTIAL** | Python script and report exist; no FastAPI endpoint or React screen | Add `GET /api/v1/analytics/promotion-effectiveness` and build `/analytics/promotion-intelligence` UI |
| **Promotion Trap Detection** | `FR-xxxiv`, `Step 28` | 5 distinct traps (margin collapse, excess waste, churn) | Missing | Missing Endpoint | `python_pipeline/promotion/promotion_effectiveness.py`| `promotion_effectiveness_report.json` | `tests/test_promotion_effectiveness.py`| PROMO-012 triggers 5 traps | **PARTIAL** | Python script detects traps; no UI screen | Include Trap Alert banners in Promotion Intelligence UI |
| **Rating Analysis** | `FR-xxxv`, `Step 29` | Ratings vs items, locations, profitability, volume | Missing | Missing Endpoint | `python_pipeline/ratings/rating_analysis.py` | `rating_and_satisfaction_report.json` | `tests/test_rating_analysis.py` | 100,300 ratings analyzed | **PARTIAL** | Script exists; no dedicated Rating Analytics UI | Add `GET /api/v1/analytics/rating-analysis` and build `/analytics/rating-analysis` UI |
| **Rating Anomaly Detection** | `FR-xxxvi`, `Step 30` | Sudden spikes/drops, identical rating bursts | Partial (Widget) | `GET /api/v1/dashboard/executive` | `python_pipeline/anomaly/anomaly_detection.py` | `rating_anomalies.parquet` | `tests/test_anomaly_detection.py` | 13,393 rating anomalies flagged | **PARTIAL** | Embedded in Executive Dashboard widget; lacks full dedicated Anomaly screen | Build `/analytics/anomaly-detection` with dedicated Rating Anomalies tab |
| **Sales Anomaly Detection** | `FR-xxxvii`, `Step 31` | Duplicate transactions, extreme overrides (>60%) | Partial (Widget) | `GET /api/v1/dashboard/executive` | `python_pipeline/anomalies/sales_anomaly.py` | `sales_anomalies.parquet` | `tests/test_sales_anomaly.py` | 200 duplicate charges intercepted | **PARTIAL** | Embedded in Executive Dashboard widget; lacks full dedicated Anomaly screen | Build `/analytics/anomaly-detection` with dedicated Sales Anomalies tab |
| **Slow-Moving Dish Detection** | `Step 32` | 7-dimension SMI formula score | Menu Dashboard | `GET /api/v1/menu-intelligence/slow-moving` | `python_pipeline/slow_moving/slow_moving_detector.py` | `slow_moving_dishes.parquet` | `tests/test_slow_moving_dishes.py` | 40 Critical, 33 Moderate movers | **PASS** | Working in backend and Menu Intelligence UI | Preserve existing table; add retirement action button |
| **Multi-Location Intelligence** | `FR-xxxviii, xxxix`, `Steps 33-34`| 20-store benchmarking, 85 conflicting dish classes | Missing | Missing Endpoint | `python_pipeline/locations/location_intelligence.py` | `location_comparison_matrix.parquet`| `tests/test_location_intelligence.py`| NYC vs Orlando divergent dishes | **PARTIAL** | Script exists; no dedicated Location Intelligence UI | Add `GET /api/v1/analytics/location-intelligence` and build `/analytics/location-intelligence` UI |
| **Ordering Channel Intelligence**| `FR-xl`, `Step 35` | Dine-in, Takeaway, Delivery, Drive-Thru comparison | Partial (Widget) | `GET /api/v1/dashboard/executive` | `python_pipeline/channels/channel_analysis.py` | `orders.parquet` | `tests/test_ordering_channels.py` | 5 channels evaluated | **PARTIAL** | Embedded in Executive Dashboard; no dedicated Channel screen | Add `GET /api/v1/analytics/channel-intelligence` and build `/analytics/channel-intelligence` UI |
| **Customer Churn Risk Scoring** | `FR-xli`, `Step 36` | 5-factor churn scoring, VIP churn risk roster | Customer Dashboard | `GET /api/v1/customer-intelligence/at-risk` | `python_pipeline/churn/customer_churn_risk.py` | `customer_churn_risk.parquet` | `tests/test_customer_churn_risk.py` | 22,933 churning patrons ($7.28M) | **PASS** | Working in backend and Customer Dashboard | Preserve roster; add dedicated Churn Analysis UI for all 5 factors |
| **Spark MLlib Models** | `FR-xlii, xlvi`, `Step 12` | Logistic Regression, Decision Tree, Random Forest | System Dashboard | `GET /api/v1/models/versions` | `spark_jobs/mllib_models/train_models.py` | `models/spark/` | `tests/test_mllib_models.py` | 3 algorithms trained & compared | **PASS** | Working in backend and System Ops dashboard | Preserve model registry; add confusion matrix popup |
| **Independent Python ML** | `FR-xliii, xlvi`, `Step 13` | XGBoost, Scikit-Learn, Prophet, Statsmodels | System Dashboard | `GET /api/v1/models/versions` | `python_pipeline/run_pipeline.py` | `models/python/` | `tests/test_python_pipeline.py` | Truly independent pipeline | **PASS** | Working in backend and System Ops dashboard | Preserve model registry |
| **Dual-Pipeline Comparison** | `FR-xliv, xlv, lvii`, `Steps 14, 47`| Spark vs Python 150 items, 96.0% match, boundary reasons | Missing | Missing Endpoint | `python_pipeline/dual_pipeline_comparator.py` | `dual_pipeline_comparison_report.md`| `tests/test_dual_pipeline_comparison.py`| 144 matches, 6 explained diffs | **PARTIAL** | Comparator engine works and report exists; no UI screen | Add `GET /api/v1/analytics/dual-pipeline-comparison` and build dedicated dashboard |
| **Recommendation Engine** | `FR-xlvii-l`, `Steps 37-39` | 57 actions, 9 categories, exact bullet evidence, priority | Partial (Widget) | `GET /api/v1/dashboard/executive` | `python_pipeline/recommendation/recommendation_engine.py` | `recommendations.parquet` | `tests/test_recommendation_engine.py` | $3.66M addressable impact | **PARTIAL** | Executive dashboard shows 8 cards; dedicated Recommendation Center missing | Add `GET /api/v1/recommendations` and build dedicated `/decision-support/recommendations` UI |
| **What-If Scenario Simulation** | `FR-li`, `Steps 40-41` | 8 scenarios, impact recalculation, estimate disclaimer | Missing | Missing Endpoint | `src/what_if_engine.py` | In-memory WhatIfEngine | `tests/test_what_if_engine.py` | All 8 scenarios simulated | **PARTIAL** | Python simulation engine works; no dedicated React sandbox screen | Add `POST /api/v1/what-if/simulate` and build dedicated `/decision-support/what-if` UI |
| **Executive Dashboard** | `FR-lii`, `Step 42` | Total revenue, profit, orders, AOV, active/repeat, waste | Executive Dashboard | `GET /api/v1/dashboard/executive` | `backend/services/dashboard_service.py` | Cleaned parquet datasets | `tests/test_executive_dashboard.py` | Working dashboard | **PARTIAL** | Hard-coded labels (`YoY %`, `Healthy Margin`, `99.2% Fulfilled`); missing filter indicator | Remove hardcoded strings, calculate dynamically, add active filter scope |
| **Search & Global Filtering** | `FR-lviii`, `Step 48` | 11 filter dimensions (date, store, item, cat, channel, etc) | Global Modal | `GET /api/v1/search/filter`, `GET .../options` | `backend/routers/search_filter.py` | Query parameter parser | `tests/test_search_reports_export.py` | 11 filter criteria parsed | **PARTIAL** | Modal exists, but active filter state is not displayed on dashboard headers | Add global active filter chip bar across all dashboards |
| **Downloadable Reports** | `FR-lix`, `Step 49` | 12 analytical reports in Markdown/PDF/CSV | Modal | `GET /api/v1/reports`, `GET .../{key}/download` | `backend/routers/reports.py` | Pre-computed report files | `tests/test_search_reports_export.py` | 12 reports downloadable | **PARTIAL** | Modal exists; lacks dedicated Reports Center with in-browser previews | Build `/reports/reports-center` with full report previews |
| **Data Export Center** | `FR-lx`, `Step 50` | Role-authorized CSV/Excel dataset exports | Modal | `GET /api/v1/export/datasets`, `GET .../{key}` | `backend/routers/exports.py` | Parquet / SQLite serializers | `tests/test_search_reports_export.py` | Role-checked export downloads | **PARTIAL** | Modal exists; lacks dedicated Data Export Center page | Build `/reports/export-center` with export format toggles and audit logging |
| **Database Storage Architecture**| `FR-lxi` | SQLite/Postgres + Parquet + NoSQL JSON exports | Admin Dashboard | `GET /api/v1/system/storage-metrics` | `python_pipeline/storage_manager.py` | Relational & Parquet DBs | `tests/data/test_storage_integration.py` | Storage metrics verified | **PASS** | Working in backend and System Ops dashboard | Maintain PostgreSQL + Parquet architecture; document MongoDB export |
| **Model Version Tracking** | `FR-lxii` | Model versions, confidence tags, prediction logging | System Dashboard | `GET/POST /api/v1/models/versions` | `src/model_version_tracker.py` | `model_versions` table | `tests/test_srs_platform_core.py` | Tagged prediction logs | **PASS** | Working in backend and System Ops dashboard | Preserve model registry view |
| **Audit Trail Logging** | `FR-lxiii` | Immutable audit log of jobs, predictions, exports, actions | System Dashboard | `GET/POST /api/v1/audit-trail` | `src/audit_logger.py` | `audit_log` table | `tests/test_srs_platform_core.py` | 201 audit entries recorded | **PASS** | Working in backend and System Ops dashboard | Preserve audit trail table; add action type filter |
| **Centralized Error Handling**| `FR-lxiv` | User-friendly errors, error codes, suggested actions | Global Middleware | `src/error_handlers.py` | `src/error_handlers.py` | FastAPI Exception Handlers | `tests/test_srs_platform_core.py` | Tested across 4 error categories | **PASS** | Fully implemented and backward-compatible | Preserve error handler middleware |
| **Spark Job Monitoring** | `FR-lxv` | Distributed job stages, throughput, triggers | System Dashboard | `GET /api/v1/spark/jobs`, `POST .../trigger` | `src/spark_monitor.py` | `spark_jobs` table | `tests/test_srs_platform_core.py` | 25 Spark jobs tracked | **PASS** | Working in backend and System Ops dashboard | Preserve job monitoring view |
| **Responsive Web Interface** | `FR-lxvi` | Mobile, tablet, desktop responsive CSS layout | All Pages | Frontend CSS | `frontend/src/` | React 18 / Tailwind | `tests/test_nfr_verification.py` | Responsive cards & charts | **PARTIAL** | Dashboards are responsive, but flat top navbar breaks on mobile | Build collapsible Left Sidebar and responsive mobile drawer |
| **Jupyter Notebooks Portfolio**| `Deliverable #2` | 26 executable notebooks (`00` to `25`) | Missing | File System | `notebooks/` | Interactive Python/PySpark | `tests/test_eda_notebook.py` | Only `01_eda.ipynb` exists | **FAIL** | 25 of 26 required notebooks are missing | Author all 25 missing notebooks covering each analytical domain |

---

## 3. Specific Audit Questions Answered

### A. What is already correctly implemented?
1. **Big Data Datasets:** 100,200 unique orders and 1,001,500 order lines exist in `raw_data/` and `parquet_data/orders/` and `parquet_data/order_items/`.
2. **Feature Engineering:** All 22 required analytical features are computed and stored in `parquet_data/features/menu_features.parquet` and `parquet_data/features/customer_master_features.parquet`.
3. **Data Quality & Cleaning:** Automated data quality report and quarantine handlers intercept invalid prices, missing customer IDs, and invalid quantities.
4. **Parquet Columnar Storage:** Year/Month/Store partitioned datasets exist in `parquet_data/partitioned/` with snappy compression.
5. **Menu Classification (Step 9–11):** 10-dimensional profitability calculations, 4-category classification (31 Profit Drivers, 39 Volume Drivers, 9 Hidden Opportunities, 71 Low Performers), and 10 tricky scenarios.
6. **Customer RFM Segmentation (Step 15–16):** 6 customer segments evaluated over 50,000 customers.
7. **Wastage Machine Learning (Step 23–24):** Gradient Boosted Regressor (MAE 0.987) and Classifier (ROC-AUC 0.9659).
8. **Independent Dual ML Pipelines:** Apache Spark MLlib pipelines and Python Data Science pipelines trained independently.
9. **Automated Test Suite:** 223 automated pytest tests passing across all test categories and 11 difficult cases.
10. **Backend Error Handling & Model Versioning:** Centralized error handlers with suggested actions and immutable audit logging.

### B. What is partially implemented?
1. **Executive Dashboard:** Working, but has hardcoded badge labels (`+8.4% YoY`, `Healthy Margin`, `99.2% Fulfilled`, `High Retention`) and lacks an explicit indicator explaining that 90,471 orders represent the cleaned/completed transaction scope.
2. **Search & Global Filtering:** Modal exists, but active filters are not displayed on top headers or propagated cleanly to all analytical queries.
3. **Downloadable Reports & Data Export:** Modals exist, but dedicated full-page Reports and Export Centers are missing.
4. **Recommendation Engine & Anomaly Detection:** Logic and reports exist, but they are only displayed as small widgets inside the Executive Dashboard rather than dedicated workspaces.
5. **Data Management Modules:** Complete FastAPI CRUD endpoints exist for all 10 entities, but zero React management interfaces exist.
6. **Responsive Layout:** Dashboards are responsive, but the top navbar becomes cluttered and lacks a collapsible left sidebar.

### C. What is completely missing?
1. **Application Shell & Sidebar:** No collapsible Left Sidebar, Breadcrumb navigation, or User Profile dropdown.
2. **Authentication UI:** No Login page, Register page, `AuthContext`, or `RoleGuard` in React.
3. **Data Management UI Screens:** Missing all 10 management interfaces (Locations, Categories, Menu Items, Pricing History, Customers, Orders, Promotions, Ratings, Inventory, Wastage Log).
4. **Dedicated Analytical UI Screens:** Missing Demand Forecast Dashboard, Dual-Pipeline Comparison Dashboard, Market-Basket Analysis, Price Intelligence, Promotion Intelligence, Anomaly Detection workspace, Location Intelligence, Channel Intelligence, and Churn Risk workbench.
5. **Decision Support UI Screens:** Missing dedicated Recommendation Center and What-If Simulation Sandbox.
6. **Spark SQL Standalone Queries:** No `.sql` files exist in `spark_sql/` (queries were embedded in PySpark Python strings).
7. **Jupyter Notebooks Portfolio:** 25 of the 26 required notebooks are missing from `notebooks/`.

### D. What is hard-coded/fake?
- In `frontend/src/dashboards/ExecutiveDashboard.jsx`:
  - Line 150: `badgeText="+8.4% YoY"` (hardcoded string)
  - Line 154: `secondaryStat="20 Locations"` (hardcoded string)
  - Line 162: `badgeText="Healthy Margin"` (hardcoded string)
  - Line 174: `badgeText="99.2% Fulfilled"` (hardcoded string)
  - Line 178: `secondaryStat="~248 orders/day"` (hardcoded string)
  - Line 186: `badgeText="3.8 items/ticket"` (hardcoded string)
  - Line 190: `secondaryStat="Dine-in: $294.60"` (hardcoded string)
  - Line 198: `badgeText="82.2% Active"` (hardcoded string)
  - Line 202: `secondaryStat="50,000 Total Base"` (hardcoded string)
  - Line 210: `badgeText="High Retention"` (hardcoded string)
  - Line 214: `secondaryStat=">= 2 Orders in 2025"` (hardcoded string)
  - Line 222: `badgeText="Step 23-24 Tracked"` (hardcoded string)
  - Line 234: `badgeText={`R = ${forecast_demand.forecast_model_r2}`}` (encoding glitch)

### E. What UI pages are missing?
- `/login` & `/register`
- `/management/locations`
- `/management/categories`
- `/management/menu-items`
- `/management/pricing-history`
- `/management/customers`
- `/management/orders`
- `/management/promotions`
- `/management/ratings`
- `/management/inventory`
- `/management/wastage`
- `/data-engineering/ingestion`
- `/data-engineering/schema-validation`
- `/data-engineering/data-quality`
- `/data-engineering/data-cleaning`
- `/data-engineering/data-integration`
- `/data-engineering/feature-engineering`
- `/data-engineering/spark-sql`
- `/analytics/eda`
- `/analytics/peak-periods`
- `/analytics/rfm-analysis`
- `/analytics/basket-analysis`
- `/analytics/demand-forecasting`
- `/analytics/price-intelligence`
- `/analytics/promotion-intelligence`
- `/analytics/rating-analysis`
- `/analytics/anomaly-detection`
- `/analytics/location-intelligence`
- `/analytics/channel-intelligence`
- `/analytics/churn-analysis`
- `/analytics/dual-pipeline-comparison`
- `/decision-support/recommendations`
- `/decision-support/what-if`
- `/reports/reports-center`
- `/reports/export-center`
- `/admin/users`

### F. What APIs are missing?
1. `GET /api/v1/analytics/demand-forecasting` (30d forward curves, MAE/RMSE/MAPE)
2. `GET /api/v1/analytics/dual-pipeline-comparison` (150-item Spark vs Python table, disagreement diagnostics)
3. `GET /api/v1/analytics/basket-analysis` (FP-Growth rules, support, confidence, lift, bundle combos)
4. `GET /api/v1/analytics/price-intelligence` (log-log elasticity regressions, sensitivity tiers)
5. `GET /api/v1/analytics/promotion-effectiveness` (12 promo ROI, 5 Promotion Traps, cannibalization)
6. `GET /api/v1/analytics/anomaly-detection` (rating and sales anomaly feeds with evidence)
7. `GET /api/v1/analytics/location-intelligence` (20-store standardized benchmarking, divergent dish classes)
8. `GET /api/v1/analytics/channel-intelligence` (Dine-in, Takeaway, Delivery, Drive-Thru comparison)
9. `GET /api/v1/analytics/churn-risk` (5-factor churn risk scores and VIP churn roster)
10. `GET /api/v1/recommendations` (57 evidence-backed prioritized actions)
11. `POST /api/v1/what-if/simulate` (8-scenario business simulator returning estimates)
12. `GET/POST /api/v1/users`, `PUT /api/v1/users/{id}` (user administration and role assignment)

### G. What Spark work is missing?
- Standalone `.sql` query files in `spark_sql/` covering complex joins, window rankings, location comparisons, and profitability aggregations.
- Data Ingestion & Data Quality telemetry views exposed to the frontend.

### H. What Python ML work is missing?
- Standalone REST service exposure for Demand Forecasting, Market Basket, Price Sensitivity, and Dual-Pipeline comparator so the React frontend can consume them directly.

### I. What notebooks are missing?
- 25 of 26 notebooks in `notebooks/` (`00_dataset_overview.ipynb`, `01_data_quality.ipynb`, `02_data_cleaning_validation.ipynb`, `03_eda.ipynb`, ..., `25_final_model_evaluation.ipynb`).

### J. What tests are missing?
- UI component integration tests and end-to-end user journey tests (Login → Management CRUD → Analytics → Recommendations → What-If → Reports).

### K. What dataset requirements fail?
- None in the raw/parquet data:
  - Orders: 100,200 ($\ge 100,000$ required) -> **PASS**
  - Order lines: 1,001,500 ($\ge 1,000,000$ required) -> **PASS**
  - Customers: 50,000 ($\ge 50,000$ required) -> **PASS**
  - Menu Items: 150 ($\ge 150$ required) -> **PASS**
  - Categories: 10 ($\ge 10$ required) -> **PASS**
  - Locations: 20 ($\ge 20$ required) -> **PASS**
  - Ratings: 100,300 ($\ge 100,000$ required) -> **PASS**
  - Wastage: 50,000 ($\ge 50,000$ required) -> **PASS**
  - History: 12 months -> **PASS**
- **Action Required:** Document in `reports/dataset_requirement_validation.md` and display scope in UI.

### L. What SRS requirements fail?
- **FR-i & FR-ii (Authentication & RBAC):** Failed in UI (no login/role guards in React).
- **FR-iii to FR-xi (Data Management):** Failed in UI (no CRUD screens in React).
- **FR-xxv to FR-xxvii (Basket Analysis):** Failed in UI (no screen in React).
- **FR-xxviii & FR-xxix (Demand Forecasting):** Failed in UI (no dashboard in React).
- **FR-xxxii (Price Sensitivity):** Failed in UI (no screen in React).
- **FR-xxxiii & FR-xxxiv (Promotion Traps):** Failed in UI (no screen in React).
- **FR-xxxvi & FR-xxxvii (Anomalies):** Partial in UI (only widget in Executive Dashboard).
- **FR-xxxviii & FR-xxxix (Locations):** Failed in UI (no screen in React).
- **FR-xl (Channels):** Partial in UI (only donut in Executive Dashboard).
- **FR-xliv & FR-xlv (Dual-Pipeline Comparison):** Failed in UI (no dashboard in React).
- **FR-xlvii to FR-l (Recommendation Center):** Partial in UI (only widget in Executive Dashboard).
- **FR-li (What-If Analysis):** Failed in UI (no sandbox screen in React).
- **Deliverable #2 (Notebooks):** Failed (25 notebooks missing).

---
*Audit Document certified by Team Inside Hunters SFC.*
