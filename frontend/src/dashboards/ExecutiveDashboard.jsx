import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Users,
  Repeat,
  Trash2,
  Calendar,
  AlertTriangle,
  Zap,
  Activity,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

import KPICard from '../components/KPICard';
import MonthlyTrendChart from '../components/MonthlyTrendChart';
import CriticalRecommendations from '../components/CriticalRecommendations';
import AnomaliesFeed from '../components/AnomaliesFeed';

export default function ExecutiveDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/dashboard/executive');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch executive dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading && !data) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <RefreshCw className="animate-spin" size={32} color="#38bdf8" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc' }}>
          Aggregating Enterprise Intelligence...
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          Querying DineIQ master analytical cube and machine learning pipelines.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card" style={{ padding: '32px', textAlign: 'center', borderColor: '#f43f5e' }}>
        <AlertTriangle size={36} color="#fb7185" style={{ margin: '0 auto 12px' }} />
        <h3 style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 700 }}>
          Unable to Load Executive Dashboard
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '8px 0 16px' }}>
          {error}
        </p>
        <button
          onClick={fetchDashboardData}
          style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const {
    total_revenue,
    total_profit,
    net_profitability,
    contribution_margin_pct,
    total_orders,
    average_order_value,
    active_customers,
    repeat_customers,
    repeat_rate_pct,
    wastage,
    forecast_demand,
    critical_recommendations,
    anomalies,
    monthly_trends,
    channels
  } = data;

  return (
    <div>
      {/* Dashboard Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              Executive Dashboard
            </h1>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '6px', background: '#0284c7', color: '#ffffff' }}>
              SRS Step 42
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            High-level operational overview across all 20 restaurant locations, menu performance, demand forecasts, and risk alerts.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            color: '#f8fafc',
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={14} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Primary KPI Grid (The Core SRS Step 42 Indicators) */}
      <div className="kpi-grid">
        {/* 1. Total Revenue */}
        <KPICard
          title="Total Revenue"
          value={`$${total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="Annual Network Volume"
          badgeText={`Margin: ${contribution_margin_pct}%`}
          badgeType="emerald"
          theme="emerald"
          icon={DollarSign}
          secondaryStat="20 Locations"
        />

        {/* 2. Total Profit */}
        <KPICard
          title="Total Gross Profit"
          value={`$${total_profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle={`${contribution_margin_pct}% Contribution Margin`}
          badgeText={`Net Margin: ${net_profit_margin_pct}%`}
          badgeType="emerald"
          theme="emerald"
          icon={TrendingUp}
          secondaryStat={`Net: $${(net_profitability / 1000000).toFixed(2)}M`}
        />

        {/* 3. Total Orders */}
        <KPICard
          title="Total Orders"
          value={total_orders.toLocaleString()}
          subtitle="Transactions in 2025"
          badgeText="Verified Orders"
          badgeType="indigo"
          theme="indigo"
          icon={ShoppingBag}
          secondaryStat={`${Math.round(total_orders / 365)} orders/day`}
        />

        {/* 4. Average Order Value (AOV) */}
        <KPICard
          title="Average Order Value"
          value={`$${average_order_value.toFixed(2)}`}
          subtitle="Mean Ticket Spend"
          badgeText="Across All Channels"
          badgeType="cyan"
          theme="cyan"
          icon={CreditCard}
          secondaryStat={`Network AOV: $${average_order_value.toFixed(2)}`}
        />

        {/* 5. Active Customers */}
        <KPICard
          title="Active Customers"
          value={active_customers.toLocaleString()}
          subtitle="Unique Registered Diners"
          badgeText={`Repeat: ${repeat_rate_pct}%`}
          badgeType="indigo"
          theme="indigo"
          icon={Users}
          secondaryStat={`${active_customers.toLocaleString()} Total Active Diners`}
        />

        {/* 6. Repeat Customers */}
        <KPICard
          title="Repeat Customers"
          value={repeat_customers.toLocaleString()}
          subtitle={`${repeat_rate_pct}% Multi-Visit Rate`}
          badgeText={`${repeat_rate_pct}% Repeat Rate`}
          badgeType="emerald"
          theme="emerald"
          icon={Repeat}
          secondaryStat=">= 2 Orders in 2025"
        />

        {/* 7. Wastage */}
        <KPICard
          title="Food Wastage Loss"
          value={`$${wastage.total_wastage_cost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          subtitle={`${wastage.wastage_pct_of_sales}% of Gross Sales`}
          badgeText={`${wastage.wastage_pct_of_sales}% Loss`}
          badgeType="rose"
          theme="rose"
          icon={Trash2}
          secondaryStat={`${wastage.total_wastage_units.toLocaleString()} portions`}
        />

        {/* 8. Forecast Demand */}
        <KPICard
          title="Forecast Demand"
          value={forecast_demand.projected_demand_units.toLocaleString()}
          subtitle={`+${forecast_demand.projected_growth_pct}% Peak Projection`}
          badgeText={`R² = ${forecast_demand.forecast_model_r2}`}
          badgeType="purple"
          theme="purple"
          icon={Calendar}
          secondaryStat={forecast_demand.forecast_horizon_description}
        />
      </div>

      {/* Main Trajectory Chart & Channel Mix */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <MonthlyTrendChart trends={monthly_trends} />

        {/* Channel Share Breakdown */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Layers size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
              Ordering Channel Mix
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Revenue and margin share across SRS Step 35 ordering channels.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {channels.map((ch, idx) => (
              <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>{ch.channel}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}>{ch.share_pct}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <span>Vol: ${ch.revenue.toLocaleString()}</span>
                  <span>Margin: <strong style={{ color: '#34d399' }}>{ch.margin_pct}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 9. Critical Recommendations (Step 37-39) */}
      <CriticalRecommendations recommendations={critical_recommendations} />

      {/* 10. Anomalies Feed (Step 29-31) */}
      <AnomaliesFeed anomalies={anomalies} />
    </div>
  );
}
