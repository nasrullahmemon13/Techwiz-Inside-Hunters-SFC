-- =============================================================================
-- DineIQ Analytics Platform - Database Migration 001
-- Conforms to SRS Functional Requirements (lxi) through (lxv):
--   (lxi)  Database Storage (Config, metadata, users, recommendations, results)
--   (lxii) Model Version Tracking (Every prediction tagged with model version)
--   (lxiii) Audit Trail (Log all data-processing jobs, predictions, exports, admin actions)
--   (lxiv) Error Handling & Error Logging
--   (lxv)  Spark Job Monitoring (Job status, stages, duration, metrics)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- (lxiii) Audit Trail Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_log (
    audit_id VARCHAR(50) PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL, -- DATA_PROCESSING_JOB, PREDICTION, DATA_EXPORT, ADMIN_ACTION, USER_AUTH, MODEL_TRAINING, SPARK_JOB, SYSTEM_ERROR
    action VARCHAR(100) NOT NULL,
    actor VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'SUCCESS', -- SUCCESS, FAILED, RUNNING, WARNING
    details TEXT,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_log_event_type ON audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor);
CREATE INDEX IF NOT EXISTS idx_audit_log_status ON audit_log(status);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);

-- -----------------------------------------------------------------------------
-- (lxii) Model Version Tracking Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS model_versions (
    version_id VARCHAR(50) PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    version_tag VARCHAR(50) NOT NULL,
    framework VARCHAR(50) NOT NULL, -- PySpark MLlib, Scikit-Learn, LightGBM, Prophet
    pipeline_type VARCHAR(50) NOT NULL, -- Spark, Python, Hybrid
    task_type VARCHAR(50) NOT NULL, -- Churn, Demand, Wastage, Recommendation, Anomaly, Pricing
    metrics TEXT, -- JSON string: accuracy, rmse, r2, mae, f1, etc.
    parameters TEXT, -- JSON string: hyperparameters
    artifact_uri VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    trained_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_model_versions_name ON model_versions(model_name);
CREATE INDEX IF NOT EXISTS idx_model_versions_tag ON model_versions(version_tag);
CREATE INDEX IF NOT EXISTS idx_model_versions_active ON model_versions(is_active);
CREATE INDEX IF NOT EXISTS idx_model_versions_task ON model_versions(task_type);

-- -----------------------------------------------------------------------------
-- (lxi) System Configurations & Metadata Storage
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_configs (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- STORAGE, PIPELINE, SPARK, SECURITY, THRESHOLDS
    description TEXT,
    is_secret BOOLEAN DEFAULT FALSE,
    updated_by VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_system_configs_category ON system_configs(category);

-- -----------------------------------------------------------------------------
-- (lxii) Prediction Results Tagged With Model Version
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS prediction_results (
    prediction_id VARCHAR(50) PRIMARY KEY,
    model_version_id VARCHAR(50) NOT NULL REFERENCES model_versions(version_id) ON DELETE CASCADE,
    task_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- CUSTOMER, ITEM, LOCATION, ORDER
    entity_id VARCHAR(100) NOT NULL,
    predicted_value TEXT NOT NULL,
    actual_value TEXT,
    confidence_score NUMERIC(6, 4),
    metadata_json TEXT,
    prediction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pred_model_version ON prediction_results(model_version_id);
CREATE INDEX IF NOT EXISTS idx_pred_task_type ON prediction_results(task_type);
CREATE INDEX IF NOT EXISTS idx_pred_entity ON prediction_results(entity_type, entity_id);

-- -----------------------------------------------------------------------------
-- (lxv) Spark Job Monitoring Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS spark_jobs (
    job_id VARCHAR(50) PRIMARY KEY,
    job_name VARCHAR(150) NOT NULL,
    pipeline_type VARCHAR(50) NOT NULL DEFAULT 'Spark',
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED', -- SUBMITTED, RUNNING, COMPLETED, FAILED
    stages_completed INTEGER DEFAULT 0,
    total_stages INTEGER DEFAULT 1,
    records_processed BIGINT DEFAULT 0,
    duration_seconds NUMERIC(10, 2) DEFAULT 0.0,
    metrics TEXT,
    error_message TEXT,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_spark_jobs_status ON spark_jobs(status);
CREATE INDEX IF NOT EXISTS idx_spark_jobs_start_time ON spark_jobs(start_time);
