# DineIQ Analytics - Step 13: Independent Python Data Science Pipeline

**Execution Timestamp:** 2026-09-24 15:13:29
**Compliance Rule:** Independent execution using Pandas, NumPy, Scikit-learn, XGBoost, SciPy, Statsmodels. No Spark predictions reused.

## 1. Econometric Price Elasticity of Demand (Statsmodels OLS)

- **Demand Model Specification:** `ln(Q) = beta_0 + beta_1 * ln(P) + beta_2 * Promo + epsilon`
- **Estimated Elasticity ($E_d$):** `-0.7738`
- **Elasticity Regime:** Price Inelastic (|Ed| < 1) - Low sensitivity; pricing power exists
- **p-value:** `0.0` (Statistically Significant: `True`)
- **Promotional Lift Coefficient:** `-0.1357`
- **Model $R^2$:** `0.4121` across 7,950 weekly item observations

## 2. Inferential Hypothesis Testing (SciPy)

| Hypothesis Test | Test Method | Test Statistic | p-value | Decision ($lpha=0.05$) |
|---|---|---:|---:|---|
| Weekend vs Weekday Spend | Welch's t-test | t = 0.9006 | 3.6783e-01 | Fail to Reject H0 |
| Location Tier Spend Variance | One-Way ANOVA | F = 0.7162 | 6.7750e-01 | Fail to Reject H0 |
| Channel vs Payment Independence | Pearson's Chi-Square | $\\chi^2$ = 12.7145 | 3.9013e-01 | Fail to Reject H0 |

## 3. Time-Series Sales Forecasting (Statsmodels ARIMA)

- **Model Architecture:** ARIMA(1, 1, 1) with 7-Day Day-of-Week Seasonality
- **Historical Horizon:** 365 daily points
- **Holdout Forecast Accuracy (30-day):** MAPE = `18.91%`, RMSE = `$17589.28`
- **Projected 30-Day Revenue:** `$2,360,045.22` (Mean daily: `$78,668.17`)
- **Forecast File:** [`reports/python_pipeline/sales_forecast_30d.csv`](sales_forecast_30d.csv)

## 4. Machine Learning Customer Churn Pipeline (XGBoost & Scikit-learn)

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
|---|---:|---:|---:|---:|---:|
| **XGBoost Classifier** | **0.8151** | **0.8360** | **0.8151** | **0.8170** | **0.8834** |
| Scikit-Learn Random Forest | 0.7850 | 0.8604 | 0.7850 | 0.7845 | 0.8676 |

- **Top Predictive Features:**
  1. `recency_days` (Gain: 0.6780)
  2. `total_orders` (Gain: 0.1866)
  3. `loyalty_points` (Gain: 0.1052)
  4. `weekend_order_ratio` (Gain: 0.0121)
  5. `total_spend` (Gain: 0.0063)
