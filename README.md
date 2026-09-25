# DineIQ Analytics: Enterprise Restaurant Intelligence Platform

> **Big Data & Data Science Restaurant Analytics Platform**  
> Developed by **Team Inside Hunters SFC** per DineIQ Software Requirements Specification (SRS) Version 1.0.  
> **Repository:** [https://github.com/nasrullahmemon13/Techwiz-Inside-Hunters-SFC](https://github.com/nasrullahmemon13/Techwiz-Inside-Hunters-SFC)

---

## Table of Contents
1. [Platform Overview & Architecture](#platform-overview--architecture)
2. [Prerequisites & System Requirements](#prerequisites--system-requirements)
3. [Step-by-Step Execution Instructions (SRS Deliverable #11)](#step-by-step-execution-instructions-srs-deliverable-11)
   - [1. How to Install the Project](#1-how-to-install-the-project)
   - [2. How to Log In](#2-how-to-log-in)
   - [3. How to Generate the Dataset](#3-how-to-generate-the-dataset)
   - [4. How to Load the Dataset](#4-how-to-load-the-dataset)
   - [5. How to Run Spark Processing](#5-how-to-run-spark-processing)
   - [6. How to Execute Spark SQL](#6-how-to-execute-spark-sql)
   - [7. How to Train Spark Models](#7-how-to-train-spark-models)
   - [8. How to Train Python Models](#8-how-to-train-python-models)
   - [9. How to Compare Model Results](#9-how-to-compare-model-results)
   - [10. How to Perform Menu Analysis](#10-how-to-perform-menu-analysis)
   - [11. How to View Customer Segments](#11-how-to-view-customer-segments)
   - [12. How to Perform Basket Analysis](#12-how-to-perform-basket-analysis)
   - [13. How to Generate Forecasts](#13-how-to-generate-forecasts)
   - [14. How to Analyze Wastage](#14-how-to-analyze-wastage)
   - [15. How to Perform What-If Analysis](#15-how-to-perform-what-if-analysis)
   - [16. How to View Recommendations](#16-how-to-view-recommendations)
   - [17. How to Access Dashboards](#17-how-to-access-dashboards)
   - [18. How to Export Reports](#18-how-to-export-reports)
   - [19. How to Execute Automated Tests](#19-how-to-execute-automated-tests)
4. [Role-Based Access Control (RBAC) Matrix](#role-based-access-control-rbac-matrix)
5. [Project Deliverables Directory](#project-deliverables-directory)
6. [Team Contribution & Verification](#team-contribution--verification)

---

## Platform Overview & Architecture
DineIQ Analytics is a unified Big Data and Machine Learning platform engineered to optimize operational decision-making for multi-unit restaurant enterprises. The architecture features a dual-pipeline engine:
1. **Big Data Engine (Apache Spark / PySpark / Spark SQL / Spark MLlib):** Scalable ingestion, data cleaning, quarantine handling, window aggregations, and distributed model training designed for 5,000,000+ records.
2. **Data Science Engine (Python / Scikit-Learn / XGBoost / Prophet / ARIMA / FP-Growth):** Deep econometric pricing sensitivity analysis, high-dimensional customer segmentation, time-series forecasting, and predictive wastage modeling.
3. **Core Services & API Gateway (FastAPI / SQLAlchemy / SQLite & PostgreSQL):** RESTful endpoints with JWT authentication, role-based access control, audit logging, model versioning, and what-if simulation engines.
4. **Modern Responsive Web Interface (React 18 / Vite / Tailwind CSS / Recharts):** 7 comprehensive business dashboards delivering real-time telemetry and prescriptive recommendations.

---

## Prerequisites & System Requirements
- **Operating System:** Windows 10/11, Ubuntu Linux 20.04/22.04 LTS, or macOS 12+ (Apple Silicon / Intel).
- **Python Version:** Python 3.11, 3.12, or 3.14 (64-bit).
- **Java Runtime:** Java OpenJDK 17 LTS (required for Apache Spark and PySpark). Set `JAVA_HOME` pointing to your JDK path.
- **Node.js:** Node.js 18.x or 20.x LTS and `npm` 9.x+.
- **Memory & Storage:** Minimum 8 GB RAM (16 GB recommended for local Spark execution); 5 GB free disk space.

---

## Step-by-Step Execution Instructions (SRS Deliverable #11)

### 1. How to Install the Project

#### Clone Repository
```bash
git clone https://github.com/nasrullahmemon13/Techwiz-Inside-Hunters-SFC.git
cd Techwiz-Inside-Hunters-SFC
```

#### Set Up Python Virtual Environment
**On Windows (PowerShell):**
```powershell
python -m venv dineiq_env
.\dineiq_env\Scripts\activate
```
**On Linux / macOS:**
```bash
python3 -m venv dineiq_env
source dineiq_env/bin/activate
```

#### Install Python Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### Configure Java Runtime for PySpark
Ensure Java OpenJDK 17 is installed and added to your environment:
```powershell
# Windows PowerShell Example:
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.12.7-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
java -version
```

#### Set Up Frontend Application
```bash
cd frontend
npm install
cd ..
```

#### Initialize Database Schema
The database auto-initializes and auto-seeds on first application startup (`database/dineiq.db`). To manually execute PostgreSQL migrations:
```bash
psql -U postgres -d dineiq -f database/schema/create_tables.sql
python database/migrations/runner.py
```

---

### 2. How to Log In
DineIQ enforces strict Role-Based Access Control (RBAC) across 4 predefined organizational personas.

#### Default Pre-Seeded Credentials
| Role | Email | Password | Permissions & Scope |
|:---|:---|:---|:---|
| **Administrator** | `admin@dineiq.com` | `Admin@12345` | Global admin access, location CRUD, user management, audit trails |
| **Regional Manager** | `regional@dineiq.com` | `Regional@12345` | Multi-store analytics, cross-location benchmarking, inventory alerts |
| **Analyst** | `analyst@dineiq.com` | `Analyst@12345` | Predictive models, dual-pipeline comparison, reports, simulations |
| **Store Manager** | `manager@dineiq.com` | `Manager@12345` | Single-store dashboard, daily wastage log, order lookups |

#### Authenticate via REST API
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@dineiq.com", "password": "Admin@12345"}'
```
*Returns JWT access token with bearer authorization.*

#### Authenticate via Web UI
Open `http://localhost:5173` in any browser, click **Login**, enter the credentials, and select your target workspace.

---

### 3. How to Generate the Dataset
DineIQ includes a synthetic multi-location restaurant data generation suite producing 11 interconnected relational tables with realistic distributions, seasonality, price elasticity, and synthetic anomalies.

```bash
python -m data_generator.master_generator
```
*Output:* Creates `raw_data/` CSV files comprising 20 locations, 150 dishes, 50,000 customers, 100,000+ orders, 1,000,000+ order lines, ratings, inventory, and wastage logs.

---

### 4. How to Load the Dataset
Ingest raw CSV files into PySpark DataFrames with explicit type schemas, partition handling, and quarantine filtering:

```bash
python -m spark_jobs.ingestion.load_csv
```
*Output:* Validates schemas, parses CSVs, detects nulls/outliers, and writes columnar datasets to `parquet_data/`.

---

### 5. How to Run Spark Processing
Execute data-quality verification, automated cleaning transformations, and multi-table relational joins:

#### Execute Data Quality & Cleaning
```bash
python -m spark_jobs.cleaning.cleaning_rules
python -m spark_jobs.cleaning.quarantine_handler
```
*Output:* Generates `reports/data_quality/cleaning_log.md` and quarantines malformed records.

#### Execute Distributed Relational Joins
```bash
python -m spark_jobs.integration.join_pipeline
```
*Output:* Joins all 10 domain entities using PySpark / Spark SQL and saves optimized Parquet partitions to `parquet_data/partitioned/`.

#### Execute Feature Engineering
```bash
python -m spark_jobs.feature_engineering.save_to_parquet
```
*Output:* Computes 11 Menu Item features, 7 Customer features, and RFM scores.

---

### 6. How to Execute Spark SQL
Spark SQL queries execute complex analytical window aggregations, cross-location rankings, and temporal summaries:

```bash
python -m spark_jobs.integration.join_pipeline
```
Or interactively within PySpark:
```python
from pyspark.sql import SparkSession
spark = SparkSession.builder.appName("DineIQ-SparkSQL").getOrCreate()
df = spark.read.parquet("parquet_data/orders/orders.parquet")
df.createOrReplaceTempView("orders")
spark.sql("""
    SELECT location_id, 
           COUNT(*) as order_count, 
           SUM(total_amount) as total_revenue,
           AVG(total_amount) as avg_order_value
    FROM orders 
    WHERE order_status = 'COMPLETED'
    GROUP BY location_id 
    ORDER BY total_revenue DESC
""").show()
```

---

### 7. How to Train Spark Models
Train distributed Spark MLlib classification and clustering models on engineered features:

```bash
python -m spark_jobs.mllib_models.train_models
python -m spark_jobs.mllib_models.evaluate_models
```
*Output:* Trains Logistic Regression, Decision Tree, and Random Forest pipelines; saves model artifacts to `models/spark/` and logs evaluation metrics to `reports/model_comparison/spark_model_evidence.md`.

---

### 8. How to Train Python Models
Train independent Data Science machine learning models (XGBoost customer churn, Scikit-Learn menu classifier, Prophet demand forecaster):

```bash
python -m python_pipeline.run_pipeline
```
*Output:* Saves trained models to `models/python/` and writes analytical scorecards to `reports/python_pipeline/`.

---

### 9. How to Compare Model Results
Execute the dual-pipeline comparison engine comparing Apache Spark MLlib against Python Data Science models across 150+ menu items (exceeding the 100-record requirement of SRS Deliverable #7):

```bash
python -m python_pipeline.dual_pipeline_comparator
```
*Output:* Generates `reports/model_comparison/dual_pipeline_comparison_report.md` detailing actual values, predictions, confidence scores, consistency flags, and mathematical explanations for boundary disagreements.

---

### 10. How to Perform Menu Analysis
Execute 10-dimensional menu profitability analysis, 4-category BCG matrix classification, and slow-moving dish detection across all 7 SRS dimensions:

```bash
# Menu Profitability & 4-Quadrant Classification
python -m python_pipeline.menu_classification_python

# Slow-Moving Dish Detection (7-Dimension SMI Model)
python -m python_pipeline.slow_moving.slow_moving_detector
```
*Output:* Generates `reports/menu_classification/menu_classification_report.md` and `reports/slow_moving/slow_moving_dishes_report.md`.

---

### 11. How to View Customer Segments
Generate 6-segment RFM clustering and churn risk scoring across 50,000 customers:

```bash
# Distributed RFM & K-Means Clustering
python -m spark_jobs.customer_segmentation

# 5-Factor Churn Risk Analysis
python -m python_pipeline.churn.customer_churn_risk
```
*Output:* Generates `reports/customer_segmentation/customer_segmentation_report.md` and `reports/churn/customer_churn_risk_report.md`.

---

### 12. How to Perform Basket Analysis
Mine frequent itemsets and association rules using distributed FP-Growth algorithms:

```bash
python -m python_pipeline.basket_analysis.apriori_rules
```
*Output:* Evaluates support, confidence, and lift across 90,471 transactions; outputs combo recommendations to `reports/basket_analysis/basket_analysis_report.md`.

---

### 13. How to Generate Forecasts
Run 30-day forward demand forecasting combining Prophet (trend/seasonality) and seasonal ARIMA models:

```bash
python -m python_pipeline.forecasting.demand_forecast
```
*Output:* Generates category and location demand projections and outputs `reports/forecasting/demand_forecasting_report.md`.

---

### 14. How to Analyze Wastage
Run multi-dimensional food wastage diagnostics and predictive risk modeling:

```bash
python -m python_pipeline.wastage.wastage_risk_model
```
*Output:* Trains Gradient Boosted Regressor (MAE: 0.987) and Classifier (ROC-AUC: 0.9659); outputs `reports/wastage/wastage_risk_report.md`.

---

### 15. How to Perform What-If Analysis
Simulate the commercial impact of business interventions across all 8 SRS-mandated scenarios:

```bash
python -m src.what_if_engine
```
*Supported Scenarios:*
1. Increase Menu Price (+5% to +20%)
2. Reduce Item Price (-5% to -20%)
3. Change Discount Percentage
4. Increase Promotion Frequency
5. Remove a Menu Item (Phase-out)
6. Reduce Preparation Quantity (-10% to -40%)
7. Increase Predicted Demand (+10% to +30%)
8. Change Wastage Assumptions
*Note: All simulation outputs strictly include simulation estimate disclosures per SRS Step 41.*

---

### 16. How to View Recommendations
Run the prescriptive recommendation engine to generate evidence-backed business actions across all 9 SRS categories:

```bash
python -m python_pipeline.recommendation.recommendation_engine
```
*Output:* Generates 57 prioritized actions with exact bullet evidence and business rationale in `reports/recommendations/recommendation_engine_report.md`.

---

### 17. How to Access Dashboards
Launch both the FastAPI backend service and the React 18 user interface.

#### Start Backend API Gateway
```powershell
.\dineiq_env\Scripts\python.exe -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Base URL: `http://localhost:8000`
- Swagger Interactive Documentation: `http://localhost:8000/docs`
- ReDoc Technical Reference: `http://localhost:8000/redoc`

#### Start Frontend Web Application
In a separate terminal:
```bash
cd frontend
npm run dev
```
- Frontend Web Portal: `http://localhost:5173`

#### Available Interactive Dashboards
1. **Executive Dashboard (`Step 42`):** Total revenue, profit, orders, AOV, active/repeat diners, wastage cost, demand forecast, critical recommendations, and anomaly alerts.
2. **Menu Intelligence Dashboard (`Step 43`):** 4-quadrant classification matrix, slow movers, ratings, margins, and spoilage rates.
3. **Customer Intelligence Dashboard (`Step 44`):** RFM distribution, VIP customer roster, at-risk churn accounts, and promo sensitivity.
4. **Wastage Dashboard (`Step 45`):** Kitchen loss telemetry, shift wastage breakdown, and ML wastage risk predictions.
5. **Forecast Dashboard (`Step 46`):** Historical vs projected demand, holiday surge warnings, and residual error analysis.
6. **Dual-Pipeline Comparison Dashboard (`Step 47`):** Spark MLlib vs Python side-by-side predictions, confidence scores, and disagreement explanations.
7. **System Operations Dashboard (`Step 66`):** Apache Spark job telemetry, model registry version tracking, audit trail logs, and system error diagnostics.

---

### 18. How to Export Reports
Users with appropriate permissions can export filtered datasets and executive reports:

#### Export via Web UI
Click the **Export Report** button on any dashboard view to download `.csv`, `.xlsx`, or `.pdf` summaries.

#### Export via REST API
```bash
# Export Menu Performance Report
curl -X GET "http://localhost:8000/api/v1/reports/download/menu_performance?format=csv" -o menu_report.csv

# Export Customer Segmentation Report
curl -X GET "http://localhost:8000/api/v1/reports/download/customer_segmentation?format=excel" -o customer_report.xlsx
```
*Supported Report Types:* `menu_performance`, `profitability`, `customer_segmentation`, `market_basket`, `demand_forecast`, `wastage`, `promotions`, `pricing`, `location_performance`, `anomalies`, `recommendations`, `model_comparison`.

---

### 19. How to Execute Automated Tests
DineIQ features 223 automated unit, integration, big data, and difficult-case tests with 100% pass rate.

#### Run Entire Test Suite
```powershell
.\dineiq_env\Scripts\pytest -v
```

#### Run Deliverable #9 Exact 19 Test Categories
```powershell
.\dineiq_env\Scripts\pytest tests/test_srs_deliverable_9_categories.py -v
```

#### Run SRS 11 Difficult Real-World Edge Cases
```powershell
.\dineiq_env\Scripts\pytest tests/test_srs_11_difficult_cases.py -v
```

#### Run Non-Functional Requirements (NFR) Verification Tests
```powershell
.\dineiq_env\Scripts\pytest tests/test_nfr_verification.py -v
```

---

## Role-Based Access Control (RBAC) Matrix
| Feature / Endpoint | Administrator | Regional Manager | Analyst | Store Manager |
|:---|:---:|:---:|:---:|:---:|
| Executive Dashboard | Full | Full | Read | Store Only |
| Menu Intelligence | Full | Full | Full | Read |
| Customer Intelligence | Full | Full | Full | Store Only |
| Wastage Analytics | Full | Full | Full | Store Only |
| Demand Forecasting | Full | Full | Full | Store Only |
| Dual-Pipeline Comparison | Full | Read | Full | Hidden |
| What-If Scenario Engine | Full | Read | Full | Hidden |
| Evidence Recommendations | Full | Full | Full | Store Only |
| Restaurant Location CRUD | **Yes** | Read Only | Read Only | No Access |
| Menu Item Management | **Yes** | Read Only | Read Only | No Access |
| Data Export (CSV/Excel) | **Yes** | **Yes** | **Yes** | No Access |
| Audit Trail Inspection | **Yes** | No Access | No Access | No Access |
| Spark Job Telemetry | **Yes** | No Access | **Yes** | No Access |

---

## Project Deliverables Directory
| Deliverable # | Description | File Path |
|:---:|:---|:---|
| **#1** | Comprehensive Project Report (42 Sections) | [`documentation/project_report.md`](file:///c:/Users/HP%20250%20G9/OneDrive/Desktop/techwiz-Inside%20Hunters%20SFC/documentation/project_report.md) |
| **#2** | Source Code Repository | GitHub Root Directory |
| **#3** | Big Data Datasets & Schemas | `raw_data/`, `processed_data/`, `parquet_data/` |
| **#4** | Spark Processing Evidence | [`reports/integration/join_summary.md`](file:///c:/Users/HP%20250%20G9/OneDrive/Desktop/techwiz-Inside%20Hunters%20SFC/reports/integration/join_summary.md) |
| **#5** | Spark MLlib Evidence | [`reports/model_comparison/spark_model_evidence.md`](file:///c:/Users/HP%20250%20G9/OneDrive/Desktop/techwiz-Inside%20Hunters%20SFC/reports/model_comparison/spark_model_evidence.md) |
| **#6** | Python Data Science Model Evidence | [`reports/python_pipeline/python_pipeline_report.md`](file:///c:/Users/HP%20250%20G9/OneDrive/Desktop/techwiz-Inside%20Hunters%20SFC/reports/python_pipeline/python_pipeline_report.md) |
| **#7** | Dual-Pipeline Comparison Report (>100 records) | [`reports/model_comparison/dual_pipeline_comparison_report.md`](file:///c:/Users/HP%20250%20G9/OneDrive/Desktop/techwiz-Inside%20Hunters%20SFC/reports/model_comparison/dual_pipeline_comparison_report.md) |
| **#8** | Restaurant Intelligence Report (17 Sections) | [`reports/restaurant_intelligence/restaurant_intelligence_report.md`](file:///c:/Users/HP%20250%20G9/OneDrive/Desktop/techwiz-Inside%20Hunters%20SFC/reports/restaurant_intelligence/restaurant_intelligence_report.md) |
| **#9** | Test Cases (19 Categories & 11 Difficult Cases) | [`tests/test_srs_deliverable_9_categories.py`](file:///c:/Users/HP%20250%20G9/OneDrive/Desktop/techwiz-Inside%20Hunters%20SFC/tests/test_srs_deliverable_9_categories.py) |
| **#10** | Installation Guide | Included in README Section 2 & 3 |
| **#11** | Execution Instructions | Included in README Section 3 |
| **#12** | GitHub Repository URL | [Techwiz-Inside-Hunters-SFC](https://github.com/nasrullahmemon13/Techwiz-Inside-Hunters-SFC) |
| **#13** | Deployment Instructions | Included in README Section 3.17 |
| **#14** | Demonstration Video Script | [`documentation/demonstration_video_script.md`](file:///c:/Users/HP%20250%20G9/OneDrive/Desktop/techwiz-Inside%20Hunters%20SFC/documentation/demonstration_video_script.md) |
| **#15** | Technical Blog (2,000+ Words) | [`documentation/technical_blog.md`](file:///c:/Users/HP%20250%20G9/OneDrive/Desktop/techwiz-Inside%20Hunters%20SFC/documentation/technical_blog.md) |
| **#16** | AI Tool Usage Declaration | [`AI_USAGE.md`](file:///c:/Users/HP%20250%20G9/OneDrive/Desktop/techwiz-Inside%20Hunters%20SFC/AI_USAGE.md) |
| **#17** | Final Submission Checklist | [`SUBMISSION_CHECKLIST.md`](file:///c:/Users/HP%20250%20G9/OneDrive/Desktop/techwiz-Inside%20Hunters%20SFC/SUBMISSION_CHECKLIST.md) |

---

## Team Contribution & Verification
- **Team Name:** Inside Hunters SFC
- **Lead Developer & Verifier:** Nasrullah Memon ([nasrullahdilshad0@gmail.com](mailto:nasrullahdilshad0@gmail.com))
- **Competition:** Techwiz Enterprise Solutions 2026
- **License:** Apache License 2.0
