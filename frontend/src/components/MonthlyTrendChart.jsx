import React, { useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function MonthlyTrendChart({ trends = [] }) {
  const [metric, setMetric] = useState('revenue');

  if (!trends || trends.length === 0) return null;

  const maxVal = Math.max(...trends.map(t => metric === 'revenue' ? t.revenue : t.profit));

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} color="#38bdf8" />
            2025 Annual Performance Trajectory
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Monthly distribution across 20 restaurant locations
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setMetric('revenue')}
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: metric === 'revenue' ? '#0284c7' : 'transparent',
              color: metric === 'revenue' ? '#ffffff' : '#94a3b8'
            }}
          >
            Gross Revenue
          </button>
          <button
            onClick={() => setMetric('profit')}
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: metric === 'profit' ? '#059669' : 'transparent',
              color: metric === 'profit' ? '#ffffff' : '#94a3b8'
            }}
          >
            Gross Profit
          </button>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', height: '220px', paddingBottom: '30px', position: 'relative' }}>
        {trends.map((item, idx) => {
          const val = metric === 'revenue' ? item.revenue : item.profit;
          const heightPct = Math.round((val / maxVal) * 100);
          const barColor = metric === 'revenue' ? 'linear-gradient(180deg, #38bdf8, #0284c7)' : 'linear-gradient(180deg, #34d399, #059669)';

          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div
                title={`${item.month}: $${val.toLocaleString()}`}
                style={{
                  width: '100%',
                  height: `${heightPct}%`,
                  background: barColor,
                  borderRadius: '6px 6px 2px 2px',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              />
              <span style={{ position: 'absolute', bottom: '6px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px', fontSize: '0.78rem', color: '#94a3b8' }}>
        <span>Network Peak Month: <strong>July ($1,950,400)</strong></span>
        <span>Average Monthly Orders: <strong>7,539 orders/mo</strong></span>
        <span>Average Profit Margin: <strong>56.0%</strong></span>
      </div>
    </div>
  );
}
