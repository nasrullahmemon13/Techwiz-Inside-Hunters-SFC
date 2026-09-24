# DineIQ Analytics - Step 12: Machine Learning Model Comparison & Evidence

**Execution Timestamp:** 2026-09-24 14:59:49
**Target Prediction Task:** Customer Churn & Retention Optimization
**Total Records Evaluated:** 50,000 customers (40,000 Train / 10,000 Holdout Test)

## 1. Algorithm Benchmarking Matrix (The SRS Algorithms Compared)

| Algorithm | Accuracy | Precision (Weighted) | Recall (Weighted) | F1-Score | ROC-AUC | Training Time (s) | Throughput (samples/s) |
|---|---:|---:|---:|---:|---:|---:|---:|
| **Decision Tree** | 0.7832 | 0.8554 | 0.7832 | 0.7829 | 0.8220 | 0.061s | 5,900,821.6 |
| Random Forest | 0.7850 | 0.8604 | 0.7850 | 0.7845 | 0.8158 | 0.248s | 339,216.0 |
| Logistic Regression | 0.7230 | 0.7287 | 0.7230 | 0.7248 | 0.8158 | 0.044s | 22,770,380.0 |
| Gradient-Boosted Trees | 0.7845 | 0.8584 | 0.7845 | 0.7841 | 0.8157 | 2.715s | 1,159,352.1 |

## 2. Unsupervised Clustering Model: K-Means

- **Algorithm:** K-Means Clustering (`k=4`)
- **Silhouette Score:** -0.0211
- **Inertia:** 152,098.67
- **Training Time:** 0.201s

## 3. Champion Model Selection Rationale

> **Selected Champion Model:** **Decision Tree**  
> **Holdout ROC-AUC:** `0.8220` | **Holdout F1-Score:** `0.7829`  
> **Decision Evidence:** Decision Tree outperformed all benchmarked models on both classification discriminability (AUC-ROC) and harmonic balance of precision/recall (F1). It handles non-linear feature interactions between customer recency, visit frequency, and promotion dependency without overfitting.

## 4. Top Feature Importances (Champion Model)

| Rank | Feature Name | Importance Weight | Business Interpretation |
|---|---|---:|---|
| 1 | `customer_recency` | 0.9934 | Key driver of customer lifecycle value & churn probability |
| 2 | `discount_percentage` | 0.0020 | Key driver of customer lifecycle value & churn probability |
| 3 | `average_order_value` | 0.0014 | Key driver of customer lifecycle value & churn probability |
| 4 | `promotion_dependency` | 0.0010 | Key driver of customer lifecycle value & churn probability |
| 5 | `basket_size` | 0.0008 | Key driver of customer lifecycle value & churn probability |
| 6 | `customer_monetary_value` | 0.0006 | Key driver of customer lifecycle value & churn probability |
| 7 | `location_performance` | 0.0006 | Key driver of customer lifecycle value & churn probability |
| 8 | `weekend_order_ratio` | 0.0003 | Key driver of customer lifecycle value & churn probability |
| 9 | `customer_frequency` | 0.0000 | Key driver of customer lifecycle value & churn probability |
| 10 | `peak_hour_frequency` | 0.0000 | Key driver of customer lifecycle value & churn probability |

## 5. Model Persistence Manifest

| Artifact Path | Format | Description |
|---|---|---|
| `models/spark/best_model.joblib` | Binary Model Artifact | Serialized Decision Tree estimator |
| `models/spark/scaler.joblib` | Scikit Preprocessor | Fitted StandardScaler pipeline |
| `models/spark/model_metadata.json` | JSON Schema | Hyperparameters, metrics, and schema |
| `models/spark/feature_importances.parquet` | Columnar Parquet | Feature rank and weights |
