import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Download,
  ArrowLeft,
  RefreshCw,
  GitCompare,
  Lightbulb,
  FileText,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

export default function DataPipelineResultsPage() {
  const { runId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, [runId]);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/data-pipeline/runs/${runId}/results`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to load analysis results:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const res = await fetch(`/api/v1/data-pipeline/runs/${runId}/report`);
      const md = await res.text();
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DineIQ_Report_${runId}.md`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Failed to download report: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
        <RefreshCw className="animate-spin" size={36} style={{ color: '#38bdf8', margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '18px', color: '#f8fafc' }}>Running Multi-Dimensional Analytics...</h2>
        <p style={{ fontSize: '13px', marginTop: '6px' }}>Evaluating Sales, Menu Engineering, Customer RFM, and ML models on run {runId}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <AlertTriangle size={48} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '20px', color: '#f8fafc' }}>Failed to Load Analysis Results</h2>
        <p style={{ color: '#94a3b8', margin: '10px 0 20px' }}>{error || 'Run results not found'}</p>
        <button
          onClick={() => navigate('/data/upload')}
          style={{
            backgroundColor: '#38bdf8',
            color: '#0f172a',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Back to Upload Pipeline
        </button>
      </div>
    );
  }

  const { analytics = {}, ml_inference = {}, recommendations = [] } = data;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', color: 'var(--text-primary, #f8fafc)' }}>
      {/* Top Bar with Run Meta & Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div>
          <button
            onClick={() => navigate('/data/upload')}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              padding: 0,
              marginBottom: '8px'
            }}
          >
            <ArrowLeft size={16} /> Back to Data Pipeline Upload
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 style={{ color: '#10b981' }} />
            Dataset Analysis Complete
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>
            Run ID: <strong style={{ color: '#38bdf8' }}>{runId}</strong> • Analyzed at {data.analyzed_at?.slice(0, 19).replace('T', ' ')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchResults}
            style={{
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>

          <button
            onClick={handleDownloadReport}
            style={{
              backgroundColor: '#38bdf8',
              color: '#0f172a',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Download size={14} /> Download Analysis Report (Markdown)
          </button>
        </div>
      </div>

      {/* TOP 5 KPI CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '28px'
      }}>
        <div style={{ backgroundColor: '#1e293b', padding: '18px', borderRadius: '10px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Records Processed</div>
          <div style={{ fontSize: '24px', fontWeight: '700', marginTop: '6px', color: '#38bdf8' }}>
            {data.records_processed?.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Across all staged datasets</div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '18px', borderRadius: '10px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Data Quality Score</div>
          <div style={{ fontSize: '24px', fontWeight: '700', marginTop: '6px', color: '#10b981' }}>
            {data.data_quality_score}%
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>SRS Quality Certified</div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '18px', borderRadius: '10px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Clean Records</div>
          <div style={{ fontSize: '24px', fontWeight: '700', marginTop: '6px', color: '#10b981' }}>
            {data.clean_records?.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Saved to clean Parquet mart</div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '18px', borderRadius: '10px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Issues Remediated</div>
          <div style={{ fontSize: '24px', fontWeight: '700', marginTop: '6px', color: '#f59e0b' }}>
            {data.issues_found?.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Corrected or quarantined</div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '18px', borderRadius: '10px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Processing Time</div>
          <div style={{ fontSize: '24px', fontWeight: '700', marginTop: '6px', color: '#a855f7' }}>
            {data.processing_time_sec}s
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>PySpark execution latency</div>
        </div>
      </div>

      {/* SECTION 1: SALES & MENU PERFORMANCE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Sales Overview */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={18} style={{ color: '#10b981' }} />
              Sales Overview
            </h3>
            {analytics.sales_overview?.status !== 'AVAILABLE' && (
              <span style={{ backgroundColor: '#334155', color: '#94a3b8', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                NOT AVAILABLE
              </span>
            )}
          </div>

          {analytics.sales_overview?.status === 'AVAILABLE' ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Revenue</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '4px', color: '#10b981' }}>
                    ${analytics.sales_overview.total_revenue?.toLocaleString()}
                  </div>
                </div>
                <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Orders</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '4px' }}>
                    {analytics.sales_overview.total_orders?.toLocaleString()}
                  </div>
                </div>
                <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Average Order Value</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '4px', color: '#38bdf8' }}>
                    ${analytics.sales_overview.average_order_value}
                  </div>
                </div>
              </div>

              {/* Channels breakdown */}
              {analytics.sales_overview.channels && (
                <div>
                  <h4 style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Dining Channels Breakdown:</h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {Object.entries(analytics.sales_overview.channels).map(([ch, count]) => (
                      <div key={ch} style={{ backgroundColor: '#0f172a', padding: '6px 12px', borderRadius: '6px', fontSize: '12px' }}>
                        <span style={{ color: '#94a3b8' }}>{ch}: </span>
                        <strong>{count.toLocaleString()}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '20px', backgroundColor: '#0f172a', borderRadius: '8px', color: '#94a3b8', fontSize: '13px' }}>
              <HelpCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
              {analytics.sales_overview?.reason || 'Orders dataset not provided.'}
            </div>
          )}
        </div>

        {/* Menu Performance */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={18} style={{ color: '#f59e0b' }} />
              Menu Performance
            </h3>
            {analytics.menu_performance?.status !== 'AVAILABLE' && (
              <span style={{ backgroundColor: '#334155', color: '#94a3b8', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                NOT AVAILABLE
              </span>
            )}
          </div>

          {analytics.menu_performance?.status === 'AVAILABLE' ? (
            <div>
              <h4 style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>Top Selling Items (Units Sold):</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(analytics.menu_performance.top_selling_items_quantity || {}).slice(0, 5).map(([id, qty]) => (
                  <div key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#0f172a', borderRadius: '6px', fontSize: '13px' }}>
                    <span style={{ fontWeight: '600' }}>Item: {id}</span>
                    <span style={{ color: '#38bdf8' }}><strong>{qty.toLocaleString()}</strong> units sold</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px', backgroundColor: '#0f172a', borderRadius: '8px', color: '#94a3b8', fontSize: '13px' }}>
              <HelpCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
              {analytics.menu_performance?.reason || 'Order Items dataset not provided.'}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: CUSTOMER INSIGHTS & WASTAGE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Customer Insights */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} style={{ color: '#38bdf8' }} />
              Customer Insights & RFM Segments
            </h3>
            {analytics.customer_insights?.status !== 'AVAILABLE' && (
              <span style={{ backgroundColor: '#334155', color: '#94a3b8', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                NOT AVAILABLE
              </span>
            )}
          </div>

          {analytics.customer_insights?.status === 'AVAILABLE' ? (
            <div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>
                Total Analyzed Customers: <strong style={{ color: '#f8fafc' }}>{analytics.customer_insights.total_customers?.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                {Object.entries(analytics.customer_insights.segments || {}).map(([seg, count]) => (
                  <div key={seg} style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: '6px', border: '1px solid #334155' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{seg}</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '4px', color: '#38bdf8' }}>{count.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px', backgroundColor: '#0f172a', borderRadius: '8px', color: '#94a3b8', fontSize: '13px' }}>
              <HelpCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
              {analytics.customer_insights?.reason || 'Customers dataset not provided.'}
            </div>
          )}
        </div>

        {/* Wastage */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trash2 size={18} style={{ color: '#ef4444' }} />
              Kitchen Wastage & Loss Analysis
            </h3>
            {analytics.wastage?.status !== 'AVAILABLE' && (
              <span style={{ backgroundColor: '#334155', color: '#94a3b8', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                NOT AVAILABLE
              </span>
            )}
          </div>

          {analytics.wastage?.status === 'AVAILABLE' ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Loss ($)</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#ef4444', marginTop: '4px' }}>
                    ${analytics.wastage.total_loss_dollars?.toLocaleString()}
                  </div>
                </div>
                <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Units Wasted</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#f59e0b', marginTop: '4px' }}>
                    {analytics.wastage.total_units_wasted?.toLocaleString()}
                  </div>
                </div>
              </div>
              <h4 style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Top Spoilage Items:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {Object.entries(analytics.wastage.top_wasted_items || {}).slice(0, 3).map(([id, qty]) => (
                  <div key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#0f172a', borderRadius: '4px', fontSize: '12px' }}>
                    <span>Item: {id}</span>
                    <span style={{ color: '#ef4444' }}>{qty} units lost</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px', backgroundColor: '#0f172a', borderRadius: '8px', color: '#94a3b8', fontSize: '13px' }}>
              <HelpCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
              {analytics.wastage?.reason || 'Wastage dataset has not been provided.'}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: FORECAST & ANOMALIES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Forecast */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} style={{ color: '#38bdf8' }} />
              7-Day Demand Forecasting
            </h3>
            {analytics.forecast?.status !== 'AVAILABLE' && (
              <span style={{ backgroundColor: '#334155', color: '#94a3b8', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                NOT AVAILABLE
              </span>
            )}
          </div>

          {analytics.forecast?.status === 'AVAILABLE' ? (
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>
                Historical Span: <strong>{analytics.forecast.time_span_days} days</strong> • Point forecast with 95% CI
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                {analytics.forecast['7_day_demand_forecast']?.map((pt, i) => (
                  <div key={i} style={{ backgroundColor: '#0f172a', padding: '8px 4px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>{pt.day}</div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#38bdf8', marginTop: '4px' }}>${pt.forecast}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px', backgroundColor: '#0f172a', borderRadius: '8px', color: '#94a3b8', fontSize: '13px' }}>
              <HelpCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
              {analytics.forecast?.reason || 'Orders dataset does not span required historical horizon (>=14 days).'}
            </div>
          )}
        </div>

        {/* Anomalies */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} style={{ color: '#f59e0b' }} />
              Ratings & Anomaly Detection
            </h3>
            {analytics.anomalies?.status !== 'AVAILABLE' && (
              <span style={{ backgroundColor: '#334155', color: '#94a3b8', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                NOT AVAILABLE
              </span>
            )}
          </div>

          {analytics.anomalies?.status === 'AVAILABLE' ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Average Customer Rating</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981', marginTop: '4px' }}>
                    ★ {analytics.anomalies.average_rating}
                  </div>
                </div>
                <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Negative Reviews Flagged</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b', marginTop: '4px' }}>
                    {analytics.anomalies.negative_reviews_flagged}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px', backgroundColor: '#0f172a', borderRadius: '8px', color: '#94a3b8', fontSize: '13px' }}>
              <HelpCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
              {analytics.anomalies?.reason || 'Ratings dataset has not been provided.'}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4: ML DUAL-PIPELINE PARITY */}
      {ml_inference.status === 'AVAILABLE' && (
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          border: '1px solid #334155',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitCompare size={20} style={{ color: '#a855f7' }} />
              Machine Learning Dual-Pipeline Parity ({ml_inference.evaluated_task})
            </h3>
            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
              CONCORDANCE: {ml_inference.dual_pipeline_agreement?.agreement_pct}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '600' }}>APACHE SPARK MLLIB PIPELINE</div>
              <div style={{ fontSize: '14px', fontWeight: '700', marginTop: '6px' }}>{ml_inference.spark_mllib_result?.algorithm}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                Predicted Churn Rate: <strong style={{ color: '#f8fafc' }}>{ml_inference.spark_mllib_result?.predicted_churn_rate}</strong>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Inference Latency: {ml_inference.spark_mllib_result?.mean_latency_ms} ms</div>
            </div>

            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>STANDALONE PYTHON PIPELINE</div>
              <div style={{ fontSize: '14px', fontWeight: '700', marginTop: '6px' }}>{ml_inference.python_model_result?.algorithm}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                Predicted Churn Rate: <strong style={{ color: '#f8fafc' }}>{ml_inference.python_model_result?.predicted_churn_rate}</strong>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Inference Latency: {ml_inference.python_model_result?.mean_latency_ms} ms</div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: STRATEGIC EVIDENCE-BASED RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          border: '1px solid #334155',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={20} style={{ color: '#fbbf24' }} />
            Evidence-Based Strategic Recommendations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommendations.map((rec, i) => (
              <div key={i} style={{
                backgroundColor: '#0f172a',
                padding: '16px',
                borderRadius: '8px',
                borderLeft: `4px solid ${rec.priority === 'HIGH' ? '#ef4444' : (rec.priority === 'MEDIUM' ? '#f59e0b' : '#38bdf8')}`,
                borderTop: '1px solid #334155',
                borderRight: '1px solid #334155',
                borderBottom: '1px solid #334155'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: rec.priority === 'HIGH' ? '#ef4444' : '#f59e0b' }}>
                    [{rec.priority}] {rec.domain}
                  </span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px', color: '#f8fafc' }}>
                  {rec.recommendation}
                </h4>
                <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>
                  <strong>Evidence:</strong> {rec.evidence}
                </p>
                <p style={{ fontSize: '12px', color: '#64748b' }}>
                  <strong>Business Reason:</strong> {rec.business_reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
