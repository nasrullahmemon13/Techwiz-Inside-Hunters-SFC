# DineIQ Analytics: UI Implementation & Theme Compatibility Audit

> **Document Version:** 1.0  
> **Audit Date:** September 26, 2026  
> **Status:** Phase UI-1 Baseline Audit  
> **Target Theme System:** Dual-Theme (Dark Deep Navy SaaS + Light Soft Slate Enterprise)

---

## 1. Executive Summary

This audit assesses the current React frontend implementation against the SRS visual and architectural requirements:
- Identifies every existing React route and component.
- Analyzes current data sources (real API vs. static fallback).
- Evaluates theme compatibility (hardcoded hex colors vs. semantic CSS tokens).
- Specifies exact action items required for Phase UI-1 through Phase UI-13.

---

## 2. Component & Route Implementation Audit Matrix

| Existing Route | Existing Component | SRS Purpose | Current Data Source | Design Issue | Missing Functionality | Theme Compatible? | Action Required |
|:---|:---|:---|:---|:---|:---|:---:|:---|
| `/` or `/dashboard` | `ExecutiveDashboard.jsx` | SRS Step 42 (Executive Overview) | `/api/v1/dashboard/executive` (Live Parquet/Cube) | Hardcoded inline dark styles; static YoY text; channel mix is 5-bar list | Top/Bottom location ranking cards; Top menu items bar chart | **NO** (Hardcoded dark hex in container & text) | Refactor into semantic CSS variables (`var(--background)`, `var(--surface)`, `var(--text-primary)`); adapt chart theme colors. |
| `/menu` | `MenuIntelligenceDashboard.jsx` | SRS Step 43 (Menu Intelligence) | `/api/v1/menu-intelligence` (Live Parquet/Python) | Card layout with hardcoded dark borders; table text hardcoded | Visual 4-quadrant scatter matrix canvas; slide-out evidence drawer ("Why this classification?") | **NO** (Borders `#334155`, text `#f8fafc`) | Convert container to `var(--surface)`; implement 4-quadrant visual plot; support light mode table rows. |
| `/customer` | `CustomerIntelligenceDashboard.jsx` | SRS Step 44 (Customer Intelligence) | `/api/v1/customer-intelligence` (Live Parquet/Spark) | Hardcoded dark background cards; RFM scores lack layman explanation | Tabbed sub-views (Segments, RFM, At-Risk, Trends); RFM scatter visual | **NO** (Hardcoded `#1e293b`, `#0f172a`) | Convert to semantic tokens; add plain-language RFM explanation cards; ensure light mode contrast. |
| `/wastage` | `WastageDashboard.jsx` | SRS Step 45 (Wastage Dashboard) | `/api/v1/wastage/trends`, `/items` (Live Parquet) | Operational waste logging mixed into analytical dashboard | Par-level adjustment recommendation trigger; separation from operational shift log | **NO** (Inline `#0a0f1d`, `#334155`) | Separate operational wastage log (to `/management/wastage`) from analytical intelligence (`/intelligence/wastage`). |
| `/system` | `SystemOperationsDashboard.jsx` | SRS Steps 40–41, FR lxi–lxvi | `/api/v1/spark/jobs`, `/system/config` | Exposes Spark internal jobs directly to non-admin users in main navigation | Split into Admin sub-routes (`/admin/users`, `/admin/audit`, `/admin/models`, `/admin/jobs`) | **NO** (Dark cards, text) | Move under Admin suite with RBAC guard; convert to semantic theme variables. |
| `/login` | `LoginPage.jsx` | SRS FR-i & FR-ii (Authentication) | `POST /api/v1/auth/login` (Live FastAPI) | Hardcoded gradient background `radial-gradient(...)` and dark input boxes | Needs light mode login experience; preserve 1-click role quick-switcher | **NO** (Hardcoded dark colors) | Use `var(--background)`, `var(--surface)`, `var(--border)` so login renders crisp in both themes. |
| `/unauthorized` | `UnauthorizedPage.jsx` | SRS FR-ii (403 Forbidden Screen) | `AuthContext` state | Hardcoded dark card `#1e293b` and dark border | Needs theme adaptation and clear return route | **NO** (Inline `#0f172a`) | Convert to semantic surface and border tokens. |
| `/data/upload` | `DataPipelineUploadPage.jsx` | SRS Steps 3–5, FR xii–xv | `/api/v1/data-pipeline/upload` | Hardcoded dark dropzone `#0f172a` | Multi-file validation status; progress indicator | **NO** (Dark hex styles) | Convert dropzone and table to semantic variables. |
| `/data/upload/runs/:id/results` | `DataPipelineResultsPage.jsx` | SRS Steps 3–5 (Pipeline Evidence) | `/api/v1/data-pipeline/runs/{id}` | Dark cards and dark code blocks | None (working pipeline runner) | **NO** (Hardcoded dark hex) | Adapt results cards and tables to semantic tokens. |
| Global Header / Shell | `AppLayout.jsx` | Main Navigation Shell | `AuthContext`, FastAPI | Exposes `FastAPI (:8000)` in business header; lacks Theme Toggle | Global search input; notifications bell; date & location filter dropdowns | **NO** (Hardcoded `#0f172a`, `#334155`, `#1e293b`) | **PRIORITY UI-1**: Add ThemeToggle button; remove technical clutter; use semantic header and body tokens. |
| Left Navigation | `Sidebar.jsx` | SRS Information Architecture | `AuthContext` (RBAC) | Exposes technical step labels as primary titles (`Step 42`) | Secondary badges for SRS steps; mobile drawer toggle; collapse footer | **NO** (Hardcoded `#0f172a`, `#334155`) | **PRIORITY UI-1 & UI-2**: Clean business labels; role-filtered links; semantic theme variables. |
| Reusable KPI Card | `KPICard.jsx` | Primary Metric Visualization | Props from parent dashboards | Subtle left-border styling is good, but inner colors rely on dark theme assumptions | Tooltip for metric definition; trend indicator comparison period | **PARTIAL** (Uses CSS classes, but text assumes dark background) | Update CSS classes to reference `--text-primary`, `--text-secondary`, `--surface`. |
| Reusable Trend Chart | `MonthlyTrendChart.jsx` | Monthly Revenue/Profit Trajectory | Props from `ExecutiveDashboard` | SVG/canvas chart colors are fixed dark (`#334155` grid, `#94a3b8` text) | Chart grid and axis colors do not adapt when switched to light mode | **NO** (Fixed stroke and font colors) | Inject theme-aware grid and label colors via `useTheme()` hook. |
| Reusable Feed | `CriticalRecommendations.jsx` | SRS Steps 37–39 | Live Recommendations parquet | Dark glass cards with fixed dark background | Filter by priority; link to recommendation evidence drawer | **NO** (Hardcoded dark background) | Convert to semantic card variables; support light mode cards. |
| Reusable Feed | `AnomaliesFeed.jsx` | SRS Steps 29–31 | Live Anomalies parquet | Dark glass cards with fixed dark background | Filter by severity (High, Medium, Low); view evidence modal | **NO** (Hardcoded dark background) | Convert to semantic card variables. |
| Global Search | `SearchFilterModal.jsx` | SRS Step 48 (Global Search) | `/api/v1/search/filter` | Popup modal instead of slide-out right drawer | Applied filter chips bar (`2025 [x]`, `Dine-in [x]`) | **NO** (Hardcoded dark modal background) | Upgrade to `GlobalFilterDrawer.jsx` in Phase UI-2. |
| Global Reports | `ReportsExportsModal.jsx` | SRS Steps 49–50 (Reports & Export) | `/api/v1/reports`, `/api/v1/export` | Popup modal instead of dedicated Reports Center view | Report preview cards and download format selectors | **NO** (Hardcoded dark modal background) | Upgrade to `/reports` page in Phase UI-10. |
| Fault Tolerance | `ErrorBoundary.jsx` | Application Stability | React lifecycle | Dark card styling | None (properly intercepts render faults) | **PARTIAL** | Update to semantic variables. |

---

## 3. Theme Architecture Design (Phase UI-1)

### Semantic Token System:
1. **Light Mode (`:root`):**
   - `--background: #f5f7fb` (Soft cool slate-gray)
   - `--surface: #ffffff` (Clean white cards)
   - `--surface-secondary: #f8fafc` (Light slate sidebar & header)
   - `--surface-elevated: #ffffff`
   - `--text-primary: #0f172a` (Deep slate navy)
   - `--text-secondary: #64748b` (Muted slate)
   - `--text-muted: #94a3b8`
   - `--border: #e2e8f0` (Soft border)
   - `--border-strong: #cbd5e1`
   - `--primary: #168cff` (Vibrant blue)
   - `--primary-hover: #0877df`
   - `--success: #10b981` (Emerald)
   - `--warning: #f59e0b` (Amber)
   - `--danger: #ef4444` (Rose / Red)
   - `--info: #06b6d4` (Cyan)
   - `--chart-grid: #e2e8f0`

2. **Dark Mode (`[data-theme="dark"]`):**
   - `--background: #07111f` (Deep midnight navy)
   - `--surface: #0d1a2b` (Elevated navy cards)
   - `--surface-secondary: #101f32` (Dark navy sidebar & header)
   - `--surface-elevated: #13243a`
   - `--text-primary: #f8fafc` (Bright crisp text)
   - `--text-secondary: #aebed1` (Subtle blue-gray)
   - `--text-muted: #718399`
   - `--border: #20334a` (Subtle navy border)
   - `--border-strong: #30465f`
   - `--primary: #168cff` (Vibrant blue)
   - `--primary-hover: #38a2ff`
   - `--success: #19c784`
   - `--warning: #f5a524`
   - `--danger: #f05263`
   - `--info: #22d3ee`
   - `--chart-grid: #1d3047`

3. **Legacy Backward Compatibility Mapping:**
   - `--bg-primary: var(--background);`
   - `--bg-secondary: var(--surface-secondary);`
   - `--bg-card: var(--surface);`
   - `--bg-card-hover: var(--surface-elevated);`
   - `--border-color: var(--border);`
   - `--accent-emerald: var(--success);`
   - `--accent-amber: var(--warning);`
   - `--accent-rose: var(--danger);`
   - `--accent-cyan: var(--info);`
   *(Ensures all existing components immediately respond to theme switching!)*

4. **Persistence & Flashing Prevention:**
   - Saved in `localStorage.getItem('dineiq-theme')`.
   - Fallback to `window.matchMedia('(prefers-color-scheme: dark)')`.
   - Script placed in `index.html` head to apply `data-theme` attribute before React mounts to eliminate white/dark flash.
