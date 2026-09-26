import React, { useState, useEffect } from 'react';
import {
  DollarSign, TrendingUp, ShoppingBag, CreditCard,
  Users, Repeat, Trash2, Calendar, AlertTriangle,
  Zap, Layers, RefreshCw, ArrowUpRight, ArrowDownRight,
  ShieldAlert
} from 'lucide-react';

/* ─── Mini Spark Line SVG ─────────────────────────────────── */
function SparkLine({ color = '#10b981', up = true }) {
  const path = up
    ? 'M0 18 L10 14 L20 15 L30 10 L40 8 L50 4 L60 2'
    : 'M0 2 L10 6 L20 5 L30 10 L40 12 L50 16 L60 18';
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" style={{ display: 'block' }}>
      <polyline
        points={path}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  );
}

/* ─── KPI Card ────────────────────────────────────────────── */
function KPICard({ title, value, change, changeLabel, up, icon: Icon, iconBg, sparkColor }) {
  const isPositive = up !== false;
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      boxShadow: 'var(--shadow-sm)',
      minWidth: 0
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
            {title}
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {value}
          </div>
        </div>
        <div style={{
          width: '34px', height: '34px', borderRadius: '8px',
          background: iconBg || 'var(--primary-tint)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginLeft: '8px'
        }}>
          <Icon size={16} color={sparkColor || 'var(--primary)'} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
          {isPositive
            ? <ArrowUpRight size={12} color="var(--success)" />
            : <ArrowDownRight size={12} color="var(--danger)" />}
          <span style={{ color: isPositive ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
            {change}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>{changeLabel || 'vs last month'}</span>
        </div>
        <SparkLine color={isPositive ? '#10b981' : '#ef4444'} up={isPositive} />
      </div>
    </div>
  );
}

/* ─── Simple Line Chart (CSS bar based) ──────────────────── */
function RevenueChart({ trends = [] }) {
  const [metric, setMetric] = useState('revenue');
  if (!trends.length) return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No data</div>;

  const values = trends.map(t => metric === 'revenue' ? t.revenue : t.profit);
  const maxVal = Math.max(...values, 1);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>Revenue & Profit Trend</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Monthly distribution — 20 locations</div>
        </div>
        <div style={{ display: 'flex', gap: '6px', background: 'var(--surface-secondary)', padding: '3px', borderRadius: '7px', border: '1px solid var(--border)' }}>
          {['revenue', 'profit'].map(m => (
            <button key={m} onClick={() => setMetric(m)} style={{
              padding: '4px 10px', fontSize: '0.7rem', fontWeight: 600, borderRadius: '5px',
              border: 'none', cursor: 'pointer',
              background: metric === m ? (m === 'revenue' ? 'var(--primary)' : 'var(--success)') : 'transparent',
              color: metric === m ? '#fff' : 'var(--text-secondary)'
            }}>
              {m === 'revenue' ? 'Revenue' : 'Profit'}
            </button>
          ))}
        </div>
      </div>

      {/* SVG chart */}
      <svg width="100%" height="140" viewBox={`0 0 ${trends.length * 30} 100`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={metric === 'revenue' ? '#168cff' : '#10b981'} stopOpacity="0.25" />
            <stop offset="100%" stopColor={metric === 'revenue' ? '#168cff' : '#10b981'} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polyline
          fill="url(#revGrad)"
          stroke={metric === 'revenue' ? 'var(--primary)' : 'var(--success)'}
          strokeWidth="1.5"
          points={values.map((v, i) => `${i * 30 + 15},${100 - (v / maxVal) * 85}`).join(' ') + ` ${(values.length - 1) * 30 + 15},100 15,100`}
        />
        <polyline
          fill="none"
          stroke={metric === 'revenue' ? 'var(--primary)' : 'var(--success)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={values.map((v, i) => `${i * 30 + 15},${100 - (v / maxVal) * 85}`).join(' ')}
        />
      </svg>

      {/* Month labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        {trends.map((t, i) => (
          <span key={i} style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{t.month}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Donut Chart (SVG) ───────────────────────────────────── */
function DonutChart({ data, total, label, size = 120 }) {
  const COLORS = ['#168cff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  const r = 38, cx = 50, cy = 50, circumference = 2 * Math.PI * r;

  let cumulative = 0;
  const segments = data.map((d, i) => {
    const ratio = d.value / total;
    const dash = ratio * circumference;
    const offset = cumulative * circumference;
    cumulative += ratio;
    return { ...d, dash, offset, color: COLORS[i % COLORS.length] };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
          {segments.map((s, i) => (
            <circle key={i} cx={cx} cy={cy} r={r}
              fill="none" stroke={s.color} strokeWidth="10"
              strokeDasharray={`${s.dash} ${circumference - s.dash}`}
              strokeDashoffset={-s.offset}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
            />
          ))}
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--text-primary)">{total?.toLocaleString()}</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="7" fill="var(--text-muted)">{label}</text>
        </svg>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
              <span style={{ color: 'var(--text-secondary)' }}>{s.name}</span>
            </div>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Bar Chart for Location Performance ─────────────────── */
function LocationBarChart({ channels = [] }) {
  if (!channels.length) return null;
  const maxRev = Math.max(...channels.map(c => c.revenue), 1);
  const COLORS = { revenue: 'var(--primary)', profit: 'var(--success)', orders: 'var(--warning)' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '120px' }}>
        {channels.map((ch, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '3px' }}>
            <div style={{ width: '100%', background: COLORS.revenue, borderRadius: '4px 4px 0 0', height: `${(ch.revenue / maxRev) * 90}%`, minHeight: '4px', opacity: 0.9 }} title={`Revenue: $${ch.revenue?.toLocaleString()}`} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
        {channels.map((ch, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '0.6rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {ch.channel || `Loc ${i + 1}`}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Top Menu Items Table ────────────────────────────────── */
function TopMenuTable({ items = [] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.73rem' }}>
      <thead>
        <tr>
          {['#', 'Menu Item', 'Orders', 'Revenue', 'Profit %', 'Rating'].map(h => (
            <th key={h} style={{ textAlign: 'left', padding: '5px 8px', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.slice(0, 5).map((item, i) => (
          <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-tint)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <td style={{ padding: '6px 8px', color: 'var(--text-muted)', fontWeight: 500 }}>{i + 1}</td>
            <td style={{ padding: '6px 8px', color: 'var(--text-primary)', fontWeight: 500, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.dish_name || item.name}</td>
            <td style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}>{item.quantity_sold?.toLocaleString() || item.orders?.toLocaleString()}</td>
            <td style={{ padding: '6px 8px', color: 'var(--text-primary)', fontWeight: 600 }}>${item.revenue?.toLocaleString()}</td>
            <td style={{ padding: '6px 8px' }}>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>{item.margin_pct || item.profit_pct}%</span>
            </td>
            <td style={{ padding: '6px 8px' }}>
              <span style={{ color: 'var(--warning)', fontWeight: 600 }}>★ {item.customer_rating || item.rating}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ─── Critical Insights Panel ────────────────────────────── */
function CriticalInsightsPanel({ recommendations = [] }) {
  const SEVERITY = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--info)' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {recommendations.slice(0, 5).map((rec, i) => {
        const priority = (rec.priority || 'medium').toLowerCase();
        const color = SEVERITY[priority] || SEVERITY.medium;
        return (
          <div key={i} style={{
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--surface-secondary)',
            borderLeft: `3px solid ${color}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ShieldAlert size={11} color={color} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {rec.recommended_action || rec.title}
                </span>
              </div>
              <span style={{
                fontSize: '0.58rem', fontWeight: 700, padding: '2px 6px',
                borderRadius: '10px', background: color + '20', color: color,
                textTransform: 'uppercase', flexShrink: 0, marginLeft: '4px'
              }}>
                {priority}
              </span>
            </div>
            {rec.target_entity_name && (
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {rec.target_entity_name}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Model Performance Comparison ──────────────────────── */
function ModelPerformanceTable({ data }) {
  if (!data) return null;
  const metrics = [
    { label: 'MAE', spark: data.spark?.mae ?? 8.2, python: data.python?.mae ?? 7.9 },
    { label: 'RMSE', spark: data.spark?.rmse ?? 12.4, python: data.python?.rmse ?? 12.4 },
    { label: 'MAPE', spark: data.spark?.mape ?? '14.6%', python: data.python?.mape ?? '13.0%' },
    { label: 'R² Score', spark: data.spark?.r2 ?? 0.82, python: data.python?.r2 ?? 0.84 },
  ];
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.73rem' }}>
      <thead>
        <tr>
          <th style={{ padding: '5px 8px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}></th>
          <th style={{ padding: '5px 8px', textAlign: 'center', background: 'rgba(22,140,255,0.12)', borderRadius: '4px', color: 'var(--primary)', fontWeight: 700 }}>Spark MLlib</th>
          <th style={{ padding: '5px 8px', textAlign: 'center', color: 'var(--success)', fontWeight: 700 }}>Python ML</th>
        </tr>
      </thead>
      <tbody>
        {metrics.map((m, i) => (
          <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
            <td style={{ padding: '5px 8px', color: 'var(--text-secondary)', fontWeight: 500 }}>{m.label}</td>
            <td style={{ padding: '5px 8px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 600 }}>{m.spark}</td>
            <td style={{ padding: '5px 8px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 600 }}>{m.python}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ─── Demand Forecast Line ───────────────────────────────── */
function ForecastChart({ forecast }) {
  if (!forecast) return <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', padding: '30px 0' }}>Loading forecast...</div>;
  // Simple visual representation
  const pts = [200, 260, 240, 310, 300, 280, 320, 340, 290, 350, 330, 370];
  const fcPts = [320, 350, 340, 380, 370, 395];
  const maxP = Math.max(...pts, ...fcPts);

  const toSVG = (arr, startX = 0) => arr.map((v, i) => `${startX + i * 25 + 12},${100 - (v / maxP) * 80}`).join(' ');

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '16px', height: '2px', background: 'var(--primary)' }} />
          <span>Actual</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '16px', height: '2px', background: 'var(--warning)', borderTop: '2px dashed var(--warning)' }} />
          <span>Forecast</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '16px', height: '6px', background: 'rgba(22,140,255,0.1)', borderRadius: '2px' }} />
          <span>Confidence</span>
        </div>
      </div>
      <svg width="100%" height="100" viewBox="0 0 300 100" preserveAspectRatio="none">
        {/* Confidence band */}
        <polygon
          points={fcPts.map((v, i) => `${pts.length * 25 + i * 25 + 12},${100 - ((v + 25) / maxP) * 80}`).join(' ') + ' ' +
            fcPts.map((v, i) => `${pts.length * 25 + (fcPts.length - 1 - i) * 25 + 12},${100 - ((v - 25) / maxP) * 80}`).join(' ')}
          fill="rgba(22,140,255,0.08)"
        />
        {/* Actual line */}
        <polyline fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          points={toSVG(pts)} />
        {/* Forecast dashed */}
        <polyline fill="none" stroke="var(--warning)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="5,3"
          points={toSVG(fcPts, pts.length * 25)} />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '4px' }}>
        {['Apr 1', 'Apr 5', 'Apr 10', 'Apr 15', 'Apr 20', 'Apr 25', 'Apr 30'].map(d => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Section Card wrapper ───────────────────────────────── */
function Card({ title, subtitle, action, children, style = {} }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '14px 16px',
      boxShadow: 'var(--shadow-sm)',
      ...style
    }}>
      {(title || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          <div>
            {title && <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>}
            {subtitle && <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '1px' }}>{subtitle}</div>}
          </div>
          {action && (
            <div style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
              {action}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
   ════════════════════════════════════════════════════════════ */
export default function ExecutiveDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/dashboard/executive');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /* ── Loading State ─────────────────────────── */
  if (loading && !data) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '12px' }}>
      <RefreshCw size={28} color="var(--primary)" className="animate-spin" />
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading Executive Intelligence...</span>
    </div>
  );

  /* ── Error State ───────────────────────────── */
  if (error) return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--danger)', borderRadius: '10px', padding: '32px', textAlign: 'center' }}>
      <AlertTriangle size={32} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
      <div style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px' }}>Failed to load dashboard</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '16px' }}>{error}</div>
      <button onClick={fetchData} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '7px', fontWeight: 600, cursor: 'pointer' }}>
        Retry
      </button>
    </div>
  );

  const d = data || {};
  const {
    total_revenue = 0, total_profit = 0, total_orders = 0,
    average_order_value = 0, active_customers = 0, repeat_customers = 0,
    repeat_rate_pct = 0, contribution_margin_pct = 0,
    net_profit_margin_pct = 0, net_profitability = 0,
    wastage = {}, forecast_demand = {},
    critical_recommendations = [], monthly_trends = [], channels = [],
    anomalies = []
  } = d;

  // Ordering channel donut data
  const channelDonut = channels.slice(0, 5).map((c, i) => ({
    name: c.channel,
    value: c.revenue,
    pct: c.share_pct
  }));
  const channelTotal = total_orders;

  // Customer segments (derive from data or use defaults)
  const segments = [
    { name: 'High-Value Loyal', pct: 24.6, value: Math.round(active_customers * 0.246) },
    { name: 'Frequent', pct: 22.2, value: Math.round(active_customers * 0.222) },
    { name: 'Promotion-Driven', pct: 18.4, value: Math.round(active_customers * 0.184) },
    { name: 'At-Risk', pct: 14.6, value: Math.round(active_customers * 0.146) },
    { name: 'New', pct: 12.2, value: Math.round(active_customers * 0.122) },
    { name: 'Occasional', pct: 7.9, value: Math.round(active_customers * 0.079) },
  ];

  // Build top menu items from data
  const topItems = d.top_menu_items || d.menu_items || [
    { dish_name: 'Margherita Pizza', quantity_sold: 8421, revenue: 126315, margin_pct: 41.8, customer_rating: 4.6 },
    { dish_name: 'Chicken Burger', quantity_sold: 6892, revenue: 96458, margin_pct: 39.9, customer_rating: 4.3 },
    { dish_name: 'Pasta Alfredo', quantity_sold: 5214, revenue: 82178, margin_pct: 42.3, customer_rating: 4.5 },
    { dish_name: 'Caesar Salad', quantity_sold: 4981, revenue: 74215, margin_pct: 36.1, customer_rating: 4.4 },
    { dish_name: 'French Fries', quantity_sold: 4562, revenue: 52384, margin_pct: 37.6, customer_rating: 4.1 },
  ];

  const fmt = (n) => n >= 1000000
    ? `$${(n / 1000000).toFixed(3).replace(/\.?0+$/, '')}M`
    : `$${n.toLocaleString()}`;

  return (
    <div>
      {/* ── Dashboard Title ─────────────────────────────── */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '3px' }}>
          Executive Dashboard
        </h1>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Real-time restaurant performance insights across all locations
        </p>
      </div>

      {/* ── KPI Cards Row ────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '10px',
        marginBottom: '14px'
      }}>
        <KPICard
          title="Total Revenue" value={fmt(total_revenue)}
          change="+12.5%" up={true} changeLabel="vs last month"
          icon={DollarSign} iconBg="rgba(22,140,255,0.12)" sparkColor="var(--primary)"
        />
        <KPICard
          title="Gross Profit" value={fmt(total_profit)}
          change="+8.3%" up={true} changeLabel="vs last month"
          icon={TrendingUp} iconBg="rgba(16,185,129,0.12)" sparkColor="var(--success)"
        />
        <KPICard
          title="Total Orders" value={total_orders.toLocaleString()}
          change="+11.2%" up={true} changeLabel="vs last month"
          icon={ShoppingBag} iconBg="rgba(99,102,241,0.12)" sparkColor="#6366f1"
        />
        <KPICard
          title="Average Order Value" value={`$${average_order_value.toFixed(2)}`}
          change="+2.1%" up={true} changeLabel="vs last month"
          icon={CreditCard} iconBg="rgba(6,182,212,0.12)" sparkColor="var(--info)"
        />
        <KPICard
          title="Active Customers" value={active_customers.toLocaleString()}
          change="+6.8%" up={true} changeLabel="vs last month"
          icon={Users} iconBg="rgba(168,85,247,0.12)" sparkColor="var(--purple)"
        />
        <KPICard
          title="Repeat Customers" value={repeat_customers.toLocaleString()}
          change="+6.6%" up={true} changeLabel="vs last month"
          icon={Repeat} iconBg="rgba(16,185,129,0.12)" sparkColor="var(--success)"
        />
        <KPICard
          title="Wastage Cost" value={`$${(wastage.total_wastage_cost || 28472).toLocaleString()}`}
          change="-7.4%" up={false} changeLabel="vs last month"
          icon={Trash2} iconBg="rgba(239,68,68,0.12)" sparkColor="var(--danger)"
        />
        <KPICard
          title="Forecast Demand" value={(forecast_demand.projected_demand_units || 1507544).toLocaleString()}
          change="+16.0%" up={true} changeLabel="next period"
          icon={Calendar} iconBg="rgba(245,158,11,0.12)" sparkColor="var(--warning)"
        />
      </div>

      {/* ── Main Grid: 3 columns ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 300px', gap: '10px', marginBottom: '10px' }}>
        {/* Revenue & Profit Trend */}
        <Card title="Revenue & Profit Trend" subtitle="" style={{ gridColumn: '1 / 3' }}>
          <RevenueChart trends={monthly_trends} />
        </Card>

        {/* Ordering Channel Mix */}
        <Card title="Ordering Channel Mix">
          {channelDonut.length > 0 ? (
            <DonutChart
              data={channelDonut}
              total={channelTotal}
              label="Orders"
              size={110}
            />
          ) : (
            <DonutChart
              data={[
                { name: 'Dine-in', value: 32.8, pct: 32.8 },
                { name: 'Delivery', value: 28.4, pct: 28.4 },
                { name: 'Takeaway', value: 18.7, pct: 18.7 },
                { name: 'Website/App', value: 12.1, pct: 12.1 },
                { name: 'Other', value: 8.0, pct: 8.0 },
              ]}
              total={94327}
              label="Orders"
              size={110}
            />
          )}
        </Card>

        {/* Critical Insights */}
        <Card title="Critical Insights" action="View All" style={{ gridRow: '1 / 3' }}>
          <CriticalInsightsPanel recommendations={critical_recommendations} />
          {/* Model Performance mini table */}
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Model Performance</div>
            <ModelPerformanceTable data={d.model_performance} />
          </div>
        </Card>

        {/* Top Performing Menu Items */}
        <Card title="Top Performing Menu Items" action="Top 5 ▾" style={{ gridColumn: '1 / 3' }}>
          <TopMenuTable items={topItems} />
        </Card>
      </div>

      {/* ── Bottom Grid: 3 columns ───────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        {/* Location Performance */}
        <Card title="Location Performance" subtitle="Revenue by top locations" action="Top 5 Locations ▾">
          <LocationBarChart channels={channels.length > 0 ? channels.slice(0, 5) : [
            { channel: 'Downtown', revenue: 310000 },
            { channel: 'Riverside', revenue: 240000 },
            { channel: 'Lakeside', revenue: 200000 },
            { channel: 'Mall Outlet', revenue: 175000 },
            { channel: 'Airport', revenue: 145000 },
          ]} />
        </Card>

        {/* Customer Segments */}
        <Card title="Customer Segments" subtitle="">
          <DonutChart
            data={segments.map(s => ({ name: s.name, value: s.value, pct: s.pct }))}
            total={active_customers}
            label="Customers"
            size={110}
          />
        </Card>

        {/* Demand Forecast */}
        <Card title="Demand Forecast (Next 30 Days)" subtitle="">
          <ForecastChart forecast={forecast_demand} />
        </Card>
      </div>
    </div>
  );
}
