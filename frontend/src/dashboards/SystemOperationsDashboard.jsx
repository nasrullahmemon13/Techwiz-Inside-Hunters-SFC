import React, { useState, useEffect } from 'react';
import {
  Cpu,
  ShieldCheck,
  Activity,
  Layers,
  FileText,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Database,
  Search,
  RefreshCw,
  Terminal,
  Zap,
  Sliders,
  Sparkles
} from 'lucide-react';

const API_BASE = 'http://localhost:8000/api/v1';

export default function SystemOperationsDashboard() {
  const [activeSubTab, setActiveSubTab] = useState('spark'); // 'spark', 'models', 'audit', 'storage', 'errors'
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Spark Jobs State
  const [sparkData, setSparkData] = useState({ summary: {}, jobs: [] });
  const [isTriggeringJob, setIsTriggeringJob] = useState(false);
  const [newJobName, setNewJobName] = useState('PySpark Daily Aggregation & Partitioning');

  // Model Versions & Tagged Predictions State
  const [modelVersions, setModelVersions] = useState([]);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [testPredEntity, setTestPredEntity] = useState('CUST-1049');
  const [testPredTask, setTestPredTask] = useState('Churn');
  const [testPredPipeline, setTestPredPipeline] = useState('Spark');
  const [lastPredictionResult, setLastPredictionResult] = useState(null);

  // Audit Trail State
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditFilterType, setAuditFilterType] = useState('');
  const [auditSearch, setAuditSearch] = useState('');

  // Storage Metrics & Config State
  const [storageMetrics, setStorageMetrics] = useState(null);
  const [systemConfigs, setSystemConfigs] = useState([]);

  // Error Simulation State
  const [simulatedError, setSimulatedError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchSparkJobs();
    fetchModelVersions();
    fetchAuditLogs();
    fetchStorageAndConfig();
  }, [refreshKey]);

  const fetchSparkJobs = async () => {
    try {
      const res = await fetch(`${API_BASE}/spark/jobs`);
      if (res.ok) setSparkData(await res.json());
    } catch (err) {
      console.error('Failed to fetch spark jobs:', err);
    }
  };

  const fetchModelVersions = async () => {
    try {
      const res = await fetch(`${API_BASE}/models/versions`);
      if (res.ok) setModelVersions(await res.json());

      const predRes = await fetch(`${API_BASE}/models/predictions?limit=10`);
      if (predRes.ok) setPredictionHistory(await predRes.json());
    } catch (err) {
      console.error('Failed to fetch model versions:', err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const url = auditFilterType
        ? `${API_BASE}/audit-trail?event_type=${auditFilterType}&limit=30`
        : `${API_BASE}/audit-trail?limit=30`;
      const res = await fetch(url);
      if (res.ok) setAuditLogs(await res.json());
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    }
  };

  const fetchStorageAndConfig = async () => {
    try {
      const metRes = await fetch(`${API_BASE}/system/storage-metrics`);
      if (metRes.ok) setStorageMetrics(await metRes.json());

      const cfgRes = await fetch(`${API_BASE}/system/config`);
      if (cfgRes.ok) setSystemConfigs(await cfgRes.json());
    } catch (err) {
      console.error('Failed to fetch storage and config:', err);
    }
  };

  const handleTriggerSparkJob = async () => {
    setIsTriggeringJob(true);
    try {
      const res = await fetch(`${API_BASE}/spark/jobs/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Role': 'admin' },
        body: JSON.stringify({
          job_name: newJobName,
          pipeline_type: 'PySpark',
          total_stages: 6,
          records_processed: 35000
        })
      });
      if (res.ok) {
        await fetchSparkJobs();
        await fetchAuditLogs();
      }
    } catch (err) {
      console.error('Spark trigger error:', err);
    } finally {
      setIsTriggeringJob(false);
    }
  };

  const handleRunTaggedPrediction = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/models/predict-tagged`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Role': 'analyst' },
        body: JSON.stringify({
          task_type: testPredTask,
          pipeline_type: testPredPipeline,
          entity_type: testPredTask === 'Demand' ? 'LOCATION' : 'CUSTOMER',
          entity_id: testPredEntity
        })
      });
      if (res.ok) {
        const result = await res.json();
        setLastPredictionResult(result);
        await fetchModelVersions();
        await fetchAuditLogs();
      }
    } catch (err) {
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateError = async (category) => {
    setSimulatedError(null);
    try {
      const res = await fetch(`${API_BASE}/system/test-error/${category}`);
      const data = await res.json();
      setSimulatedError(data);
      await fetchAuditLogs();
    } catch (err) {
      console.error('Test error failed:', err);
    }
  };

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (!auditSearch) return true;
    const term = auditSearch.toLowerCase();
    return (
      (log.action && log.action.toLowerCase().includes(term)) ||
      (log.actor && log.actor.toLowerCase().includes(term)) ||
      (log.details && log.details.toLowerCase().includes(term))
    );
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
          border: '1px solid rgba(56, 189, 248, 0.2)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                padding: '8px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Cpu size={24} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                System Operations, Audit &amp; Spark Monitoring
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                SRS Functional Requirements (lxi) through (lxvi): Database Storage, Model Versioning, Audit Trail, Error Framework &amp; Spark Monitoring
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#1e293b',
              color: '#38bdf8',
              border: '1px solid #334155',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} />
            <span>Refresh State</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigation (Responsive) */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #334155',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}
      >
        {[
          { id: 'spark', label: 'Spark Job Monitoring (lxv)', icon: Activity },
          { id: 'models', label: 'Model Version Registry (lxii)', icon: Layers },
          { id: 'audit', label: 'Audit Trail Logs (lxiii)', icon: FileText },
          { id: 'storage', label: 'Database Storage & Config (lxi)', icon: Database },
          { id: 'errors', label: 'Error Handling Framework (lxiv)', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                color: isActive ? '#38bdf8' : '#94a3b8',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. SPARK JOB MONITORING PANEL (Requirement lxv)                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'spark' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Summary KPIs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px'
            }}
          >
            <div className="glass-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL SPARK JOBS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '6px' }}>
                {sparkData.summary.total_jobs || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '4px' }}>Distributed Batches</div>
            </div>

            <div className="glass-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>RUNNING JOBS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
                {sparkData.summary.running_jobs || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '4px' }}>Active Driver Contexts</div>
            </div>

            <div className="glass-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>COMPLETED (SUCCESS)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '6px' }}>
                {sparkData.summary.completed_jobs || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '4px' }}>
                Success Rate: {sparkData.summary.success_rate_pct || 100}%
              </div>
            </div>

            <div className="glass-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>FAILED STAGES</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f87171', marginTop: '6px' }}>
                {sparkData.summary.failed_jobs || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '4px' }}>Logged in Diagnostic Audit</div>
            </div>
          </div>

          {/* Trigger Spark Job Card */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
              Trigger Spark Distributed Pipeline Job
            </h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={newJobName}
                onChange={(e) => setNewJobName(e.target.value)}
                placeholder="Job Name (e.g. PySpark Customer Segmentation Pipeline)"
                style={{
                  flex: 1,
                  minWidth: '280px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
              <button
                onClick={handleTriggerSparkJob}
                disabled={isTriggeringJob}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#0284c7',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: isTriggeringJob ? 'not-allowed' : 'pointer'
                }}
              >
                <Play size={16} />
                <span>{isTriggeringJob ? 'Triggering Job...' : 'Execute Spark Job'}</span>
              </button>
            </div>
          </div>

          {/* Spark Jobs Table */}
          <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
              Spark Job Status &amp; Stage Telemetry (SRS lxv)
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                  <th style={{ padding: '10px' }}>JOB ID</th>
                  <th style={{ padding: '10px' }}>PIPELINE &amp; JOB NAME</th>
                  <th style={{ padding: '10px' }}>STATUS</th>
                  <th style={{ padding: '10px' }}>STAGES &amp; PROGRESS</th>
                  <th style={{ padding: '10px' }}>RECORDS</th>
                  <th style={{ padding: '10px' }}>DURATION</th>
                  <th style={{ padding: '10px' }}>START TIME</th>
                </tr>
              </thead>
              <tbody>
                {sparkData.jobs && sparkData.jobs.map((j) => (
                  <tr key={j.job_id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.4)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: '#38bdf8' }}>{j.job_id}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{j.job_name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{j.pipeline_type}</div>
                      {j.error_message && (
                        <div style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '4px' }}>
                          {j.error_message}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background:
                            j.status === 'COMPLETED'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : j.status === 'RUNNING'
                              ? 'rgba(56, 189, 248, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)',
                          color:
                            j.status === 'COMPLETED'
                              ? '#34d399'
                              : j.status === 'RUNNING'
                              ? '#38bdf8'
                              : '#f87171'
                        }}
                      >
                        {j.status === 'COMPLETED' && <CheckCircle2 size={12} />}
                        {j.status === 'RUNNING' && <Activity size={12} />}
                        {j.status === 'FAILED' && <XCircle size={12} />}
                        <span>{j.status}</span>
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            flex: 1,
                            minWidth: '90px',
                            background: '#1e293b',
                            height: '6px',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              width: `${j.progress_pct}%`,
                              background: j.status === 'FAILED' ? '#ef4444' : '#38bdf8',
                              height: '100%'
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {j.stages_completed}/{j.total_stages} ({j.progress_pct}%)
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>
                      {j.records_processed.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>
                      {j.duration_seconds}s
                    </td>
                    <td style={{ padding: '12px 10px', color: '#64748b', fontSize: '0.75rem' }}>
                      {j.start_time ? new Date(j.start_time).toLocaleTimeString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODEL VERSION TRACKING PANEL (Requirement lxii)                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'models' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Prediction Tagging Sandbox */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
              Prediction Tagging Engine (SRS lxii)
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '16px' }}>
              Every model prediction is immutably tagged with the generating Model Version ID, tag, framework, and confidence score.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Task Type</label>
                <select
                  value={testPredTask}
                  onChange={(e) => setTestPredTask(e.target.value)}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', padding: '8px 12px', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
                >
                  <option value="Churn">Customer Churn Prediction</option>
                  <option value="Demand">Location Demand Forecasting</option>
                  <option value="Wastage">Dish Wastage Risk Assessment</option>
                  <option value="Recommendation">Menu Recommendation Rules</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Engine Pipeline</label>
                <select
                  value={testPredPipeline}
                  onChange={(e) => setTestPredPipeline(e.target.value)}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', padding: '8px 12px', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
                >
                  <option value="Spark">PySpark MLlib (Distributed Engine)</option>
                  <option value="Python">Python Scikit-Learn / Prophet</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Entity ID</label>
                <input
                  type="text"
                  value={testPredEntity}
                  onChange={(e) => setTestPredEntity(e.target.value)}
                  placeholder="e.g. CUST-1049 or LOC-001"
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', padding: '8px 12px', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  onClick={handleRunTaggedPrediction}
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: '#8b5cf6',
                    color: '#fff',
                    border: 'none',
                    padding: '9px 16px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={16} />
                  <span>Execute Tagged Prediction</span>
                </button>
              </div>
            </div>

            {/* Prediction Output Badge */}
            {lastPredictionResult && (
              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  padding: '16px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', background: '#8b5cf6', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                      TAGGED RESULT
                    </span>
                    <span style={{ fontWeight: 700, color: '#f8fafc' }}>
                      {lastPredictionResult.entity_type} {lastPredictionResult.entity_id}: {String(lastPredictionResult.predicted_value)}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#a78bfa', marginTop: '4px' }}>
                    Model: {lastPredictionResult.model_name} | Tag: <strong>{lastPredictionResult.version_tag}</strong> | Framework: {lastPredictionResult.framework}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>
                    Confidence: {(lastPredictionResult.confidence_score * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    Pred ID: {lastPredictionResult.prediction_id}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Model Versions Registry Table */}
          <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
              Active Model Version Registry (Spark &amp; Python Dual-Pipeline)
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                  <th style={{ padding: '10px' }}>VERSION ID</th>
                  <th style={{ padding: '10px' }}>MODEL NAME</th>
                  <th style={{ padding: '10px' }}>VERSION TAG</th>
                  <th style={{ padding: '10px' }}>FRAMEWORK</th>
                  <th style={{ padding: '10px' }}>PIPELINE</th>
                  <th style={{ padding: '10px' }}>TASK</th>
                  <th style={{ padding: '10px' }}>METRICS</th>
                  <th style={{ padding: '10px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {modelVersions.map((m) => (
                  <tr key={m.version_id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.4)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: '#818cf8' }}>{m.version_id}</td>
                    <td style={{ padding: '12px 10px', fontWeight: 600, color: '#f1f5f9' }}>{m.model_name}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#334155', color: '#38bdf8', fontWeight: 600, fontSize: '0.75rem' }}>
                        {m.version_tag}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>{m.framework}</td>
                    <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>{m.pipeline_type}</td>
                    <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>{m.task_type}</td>
                    <td style={{ padding: '12px 10px', color: '#94a3b8', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                      {m.metrics ? m.metrics : '-'}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.75rem' }}>
                        ● ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. AUDIT TRAIL LOGS PANEL (Requirement lxiii)                            */}
      {/* ========================================================================= */}
      {activeSubTab === 'audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Audit Search & Filter Bar */}
          <div className="glass-card" style={{ padding: '18px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f172a', padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', flex: 1, minWidth: '240px' }}>
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Search action, actor, or details..."
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', width: '100%', outline: 'none' }}
              />
            </div>

            <select
              value={auditFilterType}
              onChange={(e) => {
                setAuditFilterType(e.target.value);
                setRefreshKey((k) => k + 1);
              }}
              style={{ background: '#0f172a', border: '1px solid #334155', padding: '8px 12px', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
            >
              <option value="">All Audit Categories (Mandatory SRS)</option>
              <option value="DATA_PROCESSING_JOB">Data-Processing Jobs</option>
              <option value="PREDICTION">Predictions &amp; ML Models</option>
              <option value="DATA_EXPORT">Data Exports (CSV / Excel)</option>
              <option value="ADMIN_ACTION">Admin Actions &amp; Changes</option>
              <option value="SPARK_JOB">Spark Pipeline Execution</option>
              <option value="SYSTEM_ERROR">System Errors &amp; Diagnostic Logs</option>
            </select>
          </div>

          {/* Audit Logs Table */}
          <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
              Immutable Audit Trail (SRS lxiii)
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                  <th style={{ padding: '10px' }}>AUDIT ID</th>
                  <th style={{ padding: '10px' }}>CATEGORY</th>
                  <th style={{ padding: '10px' }}>ACTION</th>
                  <th style={{ padding: '10px' }}>ACTOR</th>
                  <th style={{ padding: '10px' }}>STATUS</th>
                  <th style={{ padding: '10px' }}>DETAILS</th>
                  <th style={{ padding: '10px' }}>TIMESTAMP</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditLogs.map((log) => (
                  <tr key={log.audit_id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.4)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: '#38bdf8' }}>{log.audit_id}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ fontSize: '0.72rem', background: '#334155', color: '#cbd5e1', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {log.event_type}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', fontWeight: 600, color: '#f1f5f9' }}>{log.action}</td>
                    <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>{log.actor}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: log.status === 'SUCCESS' ? '#34d399' : log.status === 'RUNNING' ? '#38bdf8' : '#f87171'
                        }}
                      >
                        ● {log.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', color: '#94a3b8', maxWidth: '340px' }}>
                      {log.details || '-'}
                    </td>
                    <td style={{ padding: '12px 10px', color: '#64748b', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DATABASE STORAGE & CONFIG PANEL (Requirement lxi)                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'storage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Storage Metrics Cards */}
          {storageMetrics && (
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    Relational &amp; Parquet Storage Health (SRS lxi)
                  </h3>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px' }}>
                    Engine: {storageMetrics.database_engine} | Status: <span style={{ color: '#34d399', fontWeight: 700 }}>{storageMetrics.storage_status}</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '12px'
                }}
              >
                {Object.entries(storageMetrics.entity_counts).map(([entity, count]) => (
                  <div
                    key={entity}
                    style={{
                      background: '#0f172a',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #1e293b'
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                      {entity.replace('_', ' ')}
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>
                      {count.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Configurations Table */}
          <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
              Platform System Configurations &amp; Metadata
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                  <th style={{ padding: '10px' }}>KEY</th>
                  <th style={{ padding: '10px' }}>VALUE</th>
                  <th style={{ padding: '10px' }}>CATEGORY</th>
                  <th style={{ padding: '10px' }}>DESCRIPTION</th>
                  <th style={{ padding: '10px' }}>UPDATED BY</th>
                </tr>
              </thead>
              <tbody>
                {systemConfigs.map((cfg) => (
                  <tr key={cfg.config_key} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.4)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: '#38bdf8' }}>{cfg.config_key}</td>
                    <td style={{ padding: '12px 10px', color: '#f8fafc', fontWeight: 600 }}>{cfg.config_value}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ fontSize: '0.72rem', background: '#334155', color: '#cbd5e1', padding: '2px 8px', borderRadius: '4px' }}>
                        {cfg.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', color: '#94a3b8' }}>{cfg.description}</td>
                    <td style={{ padding: '12px 10px', color: '#64748b' }}>{cfg.updated_by || 'System'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ERROR HANDLING FRAMEWORK SIMULATION (Requirement lxiv)                */}
      {/* ========================================================================= */}
      {activeSubTab === 'errors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
              Understandable Error Handling Verification (SRS lxiv)
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '16px' }}>
              SRS requirement: "understandable errors for processing, model, Spark, database failures". Click below to test each domain category.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <button
                onClick={() => handleSimulateError('processing')}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                1. Test Processing Failure (ETL)
              </button>

              <button
                onClick={() => handleSimulateError('model')}
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                2. Test Model Inference Failure
              </button>

              <button
                onClick={() => handleSimulateError('spark')}
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                3. Test Spark Stage Failure
              </button>

              <button
                onClick={() => handleSimulateError('database')}
                style={{
                  background: 'rgba(168, 85, 247, 0.15)',
                  color: '#c084fc',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                4. Test Database Operation Failure
              </button>
            </div>

            {/* Error Result Visualization */}
            {simulatedError && (
              <div
                style={{
                  background: '#0f172a',
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  padding: '18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={18} color="#ef4444" />
                  <span style={{ fontWeight: 700, color: '#f87171', fontSize: '0.9rem' }}>
                    [{simulatedError.category}] {simulatedError.error_code}
                  </span>
                  <span style={{ fontSize: '0.72rem', background: '#1e293b', color: '#94a3b8', padding: '2px 6px', borderRadius: '4px', marginLeft: 'auto' }}>
                    Trace ID: {simulatedError.trace_id}
                  </span>
                </div>

                <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px' }}>
                  {simulatedError.message}
                </div>

                <div style={{ background: '#1e293b', padding: '10px 14px', borderRadius: '6px', fontSize: '0.8rem', color: '#38bdf8', marginBottom: '12px' }}>
                  <strong>Suggested Action:</strong> {simulatedError.suggested_action}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Auto-logged to Audit Trail at: {simulatedError.timestamp}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
