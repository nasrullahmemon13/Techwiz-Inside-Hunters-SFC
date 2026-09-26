# DineIQ Analytics — UI Redesign & SRS Traceability Architecture Plan
**Document Version:** 2.0  
**Status:** Pending User Approval  
**Primary Source of Truth:** DineIQ Analytics SRS Version 1.0 (Steps 1–50, FR i–lxvi, NFRs 1–5)  

---

## 1. Executive Summary & Design Vision

DineIQ Analytics is an enterprise-grade Restaurant Big Data and Data Science Intelligence Platform. The UI must present a dual-tier experience:
1. **Business Intelligence Experience:** Intuitive, clear, actionable, and jargon-free for restaurant general managers, multi-unit regional directors, and corporate decision-makers. Normal users should understand their restaurant operations without knowing Spark, PySpark, MLlib, or machine learning math.
2. **Evaluator Verification Layer:** Every technical requirement of the SRS (from 1,000,000+ order line ingestion to PySpark MLlib vs Scikit-Learn dual-pipeline comparison, 22 engineered features, and 15 data quality quarantine rules) is directly verifiable via dedicated screens, secondary evaluator badges (`SRS Step 42`, `SRS FR-xxviii`), and full data traceability.

---

## 2. Visual Identity & Design Guidelines

### Retained Design Tokens:
- **Dark Enterprise Palette:**
  - Primary Background: `#0a0f1d` (Deep Midnight Blue)
  - Secondary Background / Sidebar: `#0f172a` (Slate Dark)
  - Card Containers: `#1e293b` (Elevated Navy Slate)
  - Card Hover: `#24344d`
  - Borders: `#334155` (Subtle Slate Border)
- **Accent Direction:**
  - Sky / Cyan Accent: `#0ea5e9` / `#38bdf8`
  - Emerald Green (Profit / Success): `#10b981`
  - Indigo / Purple (Analytics / Forecast): `#6366f1` / `#a855f7`
  - Rose (Wastage / Critical Risk / Churn): `#f43f5e`
  - Amber (Warning / Review Needed): `#f59e0b`
- **Typography:** Inter (Headings & UI prose) + JetBrains Mono (Financials, KPIs, identifiers, code).

### Visual Improvements:
- **Clean Whitespace & Hierarchy:** Eliminate visual clutter; avoid technical strings in the header; ensure distinct separation between KPI summary numbers and secondary context.
- **Responsive Navigation:** Collapsible left sidebar on desktop/laptop, converting to a slide-out drawer on tablet and mobile.
- **Global Filter Drawer:** Slide-out right panel providing unified filtering across Date, Location, Category, Segment, and Channel with applied filter chips.
- **Polished States:** Standardized skeleton loaders, empty filter states with actionable resets, and retry-enabled error states.

---

## 3. Structural Comparison: Current vs. Proposed

### A. Current Navigation
- Horizontal tab strip at the top:
  - `Executive Dashboard (Step 42)`
  - `Menu Intelligence (Step 43)`
  - `Customer Intelligence (Step 44)`
  - `Wastage Dashboard (Step 45)`
  - `System Ops & Spark (lxi-lxvi)`
  - `Forecast Dashboard (Step 46)` (disabled)
  - `Dual-Pipeline Comparison (Step 47)` (disabled)
- Modals for Search & Filter and Reports & Exports triggered via buttons.
- Header exposes developer clutter (`FastAPI (:8000)`).

### B. Proposed Navigation (Final Sidebar Hierarchy)

```text
DineIQ Analytics (Enterprise v1.0)
│
├── OVERVIEW
│   └── Dashboard                    [SRS Step 42]
│
├── MANAGEMENT
│   ├── Restaurants                  [FR-iii]
│   ├── Menu                         [FR-iv, v]
│   ├── Customers                    [FR-vi]
│   ├── Orders                       [FR-vii]
│   ├── Promotions                   [FR-viii]
│   ├── Ratings                      [FR-ix]
│   ├── Inventory                    [FR-x]
│   └── Wastage                      [FR-xi]
│
├── INTELLIGENCE
│   ├── Menu Intelligence           [Step 43, FR-xii to xix]
│   ├── Customer Intelligence       [Step 44, FR-xx to xxiv]
│   ├── Demand Forecast             [Step 46, FR-xxviii, xxix]
│   ├── Wastage Intelligence        [Step 45, FR-xxx, xxxi]
│   ├── Pricing & Promotions        [FR-xxxii to xxxv]
│   ├── Location & Channels         [FR-xxxviii to xl]
│   ├── Anomalies & Churn           [FR-xxxvi, xxxvii, xli]
│   └── Basket Analysis             [FR-xxv to xxvii]
│
├── AI & MODELS
│   ├── Model Performance           [FR-xlii, xliii, xlvi]
│   └── Spark vs Python             [Step 47, FR-xliv, xlv]
│
├── DECISION SUPPORT
│   ├── Recommendations             [FR-xlvii to l]
│   └── What-If Analysis            [FR-li, Steps 40-41]
│
├── DATA PIPELINE
│   ├── Data Overview               [FR-lii to lvi]
│   ├── Data Quality                [FR-lvii, Step 6]
│   ├── Data Cleaning               [FR-lviii, Steps 7-8]
│   ├── Feature Engineering         [FR-lix, Steps 14-15]
│   └── Spark Processing            [FR-lx, Steps 9-13]
│
├── REPORTS
│   └── Reports & Export            [Steps 49-50]
│
└── ADMIN
    ├── Users & Roles               [FR-i, ii]
    ├── Audit Logs                  [FR-lxiii]
    ├── Model Versions              [FR-lxii]
    └── System Jobs                 [FR-lxi, lxiv, lxv]
```

### C. Existing Screens to KEEP
- `ExecutiveDashboard.jsx` (Refactored into 2 clean KPI rows, location benchmarks, channel mix, critical alerts).
- `MenuIntelligenceDashboard.jsx` (Refactored with visual 4-quadrant scatter matrix and evidence slide-out).
- `CustomerIntelligenceDashboard.jsx` (Enhanced with human-readable RFM explanation and tabbed segments).
- `WastageDashboard.jsx` (Enhanced with high-risk portion loss and preparation reduction links).
- `SystemOperationsDashboard.jsx` (Modularized under Admin suite).
- `SearchFilterModal.jsx` (Upgraded to right-hand Filter Drawer with persistent chip tags).
- `ReportsExportsModal.jsx` (Transformed into full-page Reports Center).
- `LoginPage.jsx` & `UnauthorizedPage.jsx` (Kept with 1-click role quick switcher and RBAC protection).

### D. Existing Screens to IMPROVE
- **Executive Overview:** Remove static badge text; display clean YoY trends; add Top/Bottom location ranking.
- **Top Header:** Remove `FastAPI (:8000)`; add page title / breadcrumbs, notification bell, global search input, filter toggle button, and user profile avatar.
- **Menu Intelligence:** Add visual matrix canvas with Quadrant boundaries (Profit Drivers, Volume Drivers, Hidden Opportunities, Low Performers).
- **Customer Intelligence:** Add layman-friendly RFM definitions (Recency = how recently, Frequency = how often, Monetary = how much).
- **Wastage:** Separate shift operational waste logs (under Management) from multi-location wastage analytics (under Intelligence).

### E. Missing Screens to ADD
- `RestaurantsPage.jsx` (`/management/restaurants`)
- `MenuManagementPage.jsx` (`/management/menu`)
- `CustomersPage.jsx` (`/management/customers`)
- `OrdersPage.jsx` (`/management/orders`)
- `PromotionsPage.jsx` (`/management/promotions`)
- `RatingsPage.jsx` (`/management/ratings`)
- `InventoryPage.jsx` (`/management/inventory`)
- `WastageManagementPage.jsx` (`/management/wastage`)
- `DemandForecastPage.jsx` (`/intelligence/forecast`)
- `PricingPromotionsPage.jsx` (`/intelligence/pricing-promotions`)
- `LocationChannelsPage.jsx` (`/intelligence/locations-channels`)
- `AnomaliesChurnPage.jsx` (`/intelligence/anomalies-churn`)
- `BasketAnalysisPage.jsx` (`/intelligence/basket`)
- `ModelPerformancePage.jsx` (`/models/performance`)
- `SparkVsPythonPage.jsx` (`/models/comparison`)
- `RecommendationCenterPage.jsx` (`/decisions/recommendations`)
- `WhatIfAnalysisPage.jsx` (`/decisions/what-if`)
- `DataOverviewPage.jsx` (`/data/overview`)
- `DataQualityPage.jsx` (`/data/quality`)
- `DataCleaningPage.jsx` (`/data/cleaning`)
- `FeatureEngineeringPage.jsx` (`/data/features`)
- `SparkProcessingPage.jsx` (`/data/spark`)
- `UsersRolesPage.jsx` (`/admin/users`)
- `AuditLogsPage.jsx` (`/admin/audit`)
- `ModelVersionsPage.jsx` (`/admin/models`)
- `SystemJobsPage.jsx` (`/admin/jobs`)

### F. Screens to MERGE
- Menu Items, Categories, and Pricing History merged into tabbed `MenuManagementPage.jsx`.
- Price Intelligence and Promotion Effectiveness merged into tabbed `PricingPromotionsPage.jsx`.
- Locations and Ordering Channels merged into tabbed `LocationChannelsPage.jsx`.
- Sales Anomalies, Rating Anomalies, and Customer Churn merged into tabbed `AnomaliesChurnPage.jsx`.
- Admin functions (Users, Audit, Versions, Jobs) organized under clean `/admin/*` sub-routes.

### G. Fake / Hard-Coded UI Data Found & Remediation Plan
1. **Executive Dashboard Badges:** Static strings `badgeText="+8.4% YoY"`, `99.2% Fulfilled`, `3.8 items/ticket` -> Replaced with real values computed from `orders.parquet` and `monthly_trends`.
2. **Channel Mix Shares:** Replaced hardcoded values with actual aggregation from `processed_data/channels/channel_performance.parquet`.
3. **Wastage Tracking Label:** Replaced `"Step 23-24 Tracked"` with dynamic wastage loss percentage (`15.48% of sales`).
4. **Forecast Accuracy:** Replaced hardcoded `R² = 0.8035` with live evaluation metrics loaded from `processed_data/forecasting/`.

### H. Backend API Inventory & New Endpoints Plan
The backend already serves 75 routes. To supply 100% genuine data to all missing screens from existing parquet/db assets, the following lightweight FastAPI endpoints will be registered:

| Endpoint | Method | Source Data Asset | Target UI Screen |
| :--- | :---: | :--- | :--- |
| `/api/v1/analytics/basket-rules` | `GET` | `processed_data/basket/basket_rules.parquet` | Basket Analysis |
| `/api/v1/analytics/demand-forecast` | `GET` | `processed_data/forecasting/item_demand_forecast.parquet` | Demand Forecast |
| `/api/v1/analytics/price-elasticity` | `GET` | `processed_data/pricing/price_elasticity.parquet` | Pricing & Promotions |
| `/api/v1/analytics/promotion-traps` | `GET` | `processed_data/promotion/promotion_trap_detection.parquet` | Pricing & Promotions |
| `/api/v1/analytics/location-comparison` | `GET` | `processed_data/locations/location_comparison_matrix.parquet` | Location & Channels |
| `/api/v1/analytics/channel-performance` | `GET` | `processed_data/channels/channel_performance.parquet` | Location & Channels |
| `/api/v1/analytics/anomalies-feed` | `GET` | `processed_data/anomaly/*.parquet` | Anomalies & Churn |
| `/api/v1/analytics/churn-risk-table` | `GET` | `processed_data/churn/customer_churn_risk.parquet` | Anomalies & Churn |
| `/api/v1/analytics/model-comparison` | `GET` | `processed_data/models/dual_pipeline_comparison.parquet` | Spark vs Python |
| `/api/v1/analytics/recommendations-feed`| `GET` | `processed_data/recommendations/recommendations.parquet` | Recommendations |
| `/api/v1/analytics/what-if/simulate` | `POST` | `src/what_if_engine.py` | What-If Analysis |
| `/api/v1/pipeline/overview-metrics` | `GET` | Cleaned parquet datasets (`orders`, `customers`, etc.) | Data Overview |
| `/api/v1/pipeline/data-quality-rules` | `GET` | `processed_data/quarantine/quarantine_manifest.json` | Data Quality |
| `/api/v1/pipeline/cleaning-summary` | `GET` | Cleaned & Quarantine counts | Data Cleaning |
| `/api/v1/pipeline/engineered-features`| `GET` | Feature engine definitions (22 features) | Feature Engineering |

---

## 4. Reusable UI Component Architecture

To maintain high code quality and zero code duplication:
- **`AppSidebar.jsx`**: Collapsible left navigation respecting the 4 roles (`admin`, `regional_manager`, `manager`, `analyst`), with secondary badges (`SRS Step 42`).
- **`TopHeader.jsx`**: Breadcrumbs, Global Search, Filter Toggle, Notifications icon, and User Profile menu.
- **`PageHeader.jsx`**: Consistent title, subtitle, date/location filter selectors, and primary action buttons.
- **`KPICard.jsx`**: Title, primary metric, trend arrow, comparison period, and color theme.
- **`ChartCard.jsx`**: Standard container for Line, Area, Bar, and Scatter charts.
- **`DataTable.jsx`**: Reusable table with column sorting, search filter, status badges, pagination, and action buttons.
- **`FilterDrawer.jsx`**: Slide-out filter panel with multi-select dropdowns and active filter chips.
- **`StatusBadge.jsx` / `PriorityBadge.jsx`**: Color-coded badges for status, severity, and menu quadrants.
- **`LoadingSkeleton.jsx`**: Pulse animated placeholders for cards, charts, and tables.
- **`EmptyState.jsx`**: Friendly empty state illustrations with action buttons.
- **`ErrorState.jsx`**: Alert card with error details and "Try Again" trigger.

---

## 5. Phased Implementation Roadmap

Each phase will be implemented sequentially with verification (npm run build + backend API tests) before proceeding:

- **PHASE UI-1:** App Shell + Sidebar + Header + Global Filter Drawer + Reusable Components.
- **PHASE UI-2:** Executive Dashboard Redesign (SRS Step 42).
- **PHASE UI-3:** Management Modules (Restaurants, Menu, Customers, Orders, Promotions, Ratings, Inventory, Wastage).
- **PHASE UI-4:** Menu Intelligence (Matrix & Evidence Drawer) + Customer Intelligence (RFM & Segments).
- **PHASE UI-5:** Demand Forecasting + Wastage Intelligence + Pricing & Promotion Traps.
- **PHASE UI-6:** Market Basket Analysis + Location & Channels + Anomalies & Churn.
- **PHASE UI-7:** Spark vs Python Dual-Pipeline Comparison + Model Performance.
- **PHASE UI-8:** Recommendation Center + What-If Interactive Scenario Builder.
- **PHASE UI-9:** Data Pipeline Evidence (Data Overview, Quality, Cleaning, Features, Spark Processing).
- **PHASE UI-10:** Reports Center & Export + Admin Suite (Users, Audit, Versions, Jobs).
- **PHASE UI-11:** Responsive Layout Polish + Role-Based Dynamic Permissions + Accessibility.
- **PHASE UI-12:** Final Comprehensive SRS UI Audit & Traceability Matrix (`documentation/UI_SRS_TRACEABILITY.md`).

---

## 6. Verification Protocol

For each phase:
1. `npm run build` in `frontend/` must complete with 0 errors.
2. Every interactive UI control must connect to real FastAPI endpoints.
3. No mock data or hardcoded placeholder strings.
4. Loading skeletons, empty states, and error handling must be verified.
5. All automated backend tests must pass with 100% pass rate.
