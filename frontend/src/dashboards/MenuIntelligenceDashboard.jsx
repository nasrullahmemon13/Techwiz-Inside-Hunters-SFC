import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  TrendingUp,
  Star,
  Percent,
  Trash2,
  AlertTriangle,
  Award,
  Layers,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  BarChart3,
  DollarSign
} from 'lucide-react';

export default function MenuIntelligenceDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & view states
  const [activeView, setActiveView] = useState('all'); // 'all' | 'profit_drivers' | 'volume_drivers' | 'hidden_opportunities' | 'low_performers' | 'slow_moving'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('revenue'); // 'revenue' | 'margin_pct' | 'quantity_sold' | 'customer_rating' | 'total_wastage_cost'
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    fetch('/api/v1/menu-intelligence')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(payload => {
        setData(payload);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load menu intelligence:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
        <p style={{ color: '#94a3b8' }}>Loading DineIQ Menu Intelligence Suite (SRS Step 43)...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center', borderColor: '#ef4444' }}>
        <AlertTriangle size={36} color="#ef4444" style={{ margin: '0 auto 12px' }} />
        <h3 style={{ color: '#f8fafc', marginBottom: '8px' }}>Failed to Load Menu Intelligence</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{error}</p>
      </div>
    );
  }

  const {
    summary_metrics,
    menu_item_performance,
    profit_drivers,
    volume_drivers,
    hidden_opportunities,
    low_performers,
    slow_moving_items,
    ratings,
    margins,
    wastage,
    category_performance,
    quadrant_summary
  } = data;

  // Filter items based on activeView, search, category
  let displayedItems = [...menu_item_performance];

  if (activeView === 'profit_drivers') {
    displayedItems = displayedItems.filter(i => i.classification === 'Profit Driver');
  } else if (activeView === 'volume_drivers') {
    displayedItems = displayedItems.filter(i => i.classification === 'Volume Driver');
  } else if (activeView === 'hidden_opportunities') {
    displayedItems = displayedItems.filter(i => i.classification === 'Hidden Opportunity');
  } else if (activeView === 'low_performers') {
    displayedItems = displayedItems.filter(i => i.classification === 'Low Performer');
  } else if (activeView === 'slow_moving') {
    displayedItems = displayedItems.filter(i => i.is_slow_moving);
  }

  if (selectedCategory !== 'All') {
    displayedItems = displayedItems.filter(i => i.category_name === selectedCategory);
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    displayedItems = displayedItems.filter(
      i => i.item_name.toLowerCase().includes(q) || i.item_id.toLowerCase().includes(q)
    );
  }

  // Sorting
  displayedItems.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const categories = ['All', ...category_performance.map(c => c.category_name)];

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  const formatCurrency = (val) => `$${Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Step 43 Header */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '6px'
            }}>
              SRS Step 43
            </span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Menu Intelligence Dashboard
            </h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
            4-Quadrant BCG Menu Engineering, Slow-Moving Dish Audits, Price-Elasticity &amp; Wastage Intelligence
          </p>
        </div>

        {/* Global summary chips */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total Portfolio</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{summary_metrics.total_menu_items} Dishes</div>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#34d399' }}>Avg Contribution Margin</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>{summary_metrics.average_margin_pct}%</div>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#fbbf24' }}>Avg Customer Rating</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24' }}>★ {summary_metrics.average_customer_rating} / 5.0</div>
          </div>
        </div>
      </div>

      {/* 8 Step 43 Key Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Profit Drivers */}
        <div
          className="metric-card"
          onClick={() => setActiveView('profit_drivers')}
          style={{
            cursor: 'pointer',
            border: activeView === 'profit_drivers' ? '2px solid #10b981' : '1px solid var(--border-color)',
            background: activeView === 'profit_drivers' ? 'rgba(16, 185, 129, 0.08)' : undefined
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34d399' }}>Profit Drivers</span>
            <Award size={18} color="#10b981" />
          </div>
          <div className="metric-value" style={{ color: '#10b981' }}>{summary_metrics.profit_drivers_count}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
            {formatCurrency(quadrant_summary.profit_drivers.revenue)} ({quadrant_summary.profit_drivers.revenue_share_pct}%) • Avg {quadrant_summary.profit_drivers.avg_margin_pct}% margin
          </div>
        </div>

        {/* Volume Drivers */}
        <div
          className="metric-card"
          onClick={() => setActiveView('volume_drivers')}
          style={{
            cursor: 'pointer',
            border: activeView === 'volume_drivers' ? '2px solid #0284c7' : '1px solid var(--border-color)',
            background: activeView === 'volume_drivers' ? 'rgba(2, 132, 199, 0.08)' : undefined
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8' }}>Volume Drivers</span>
            <TrendingUp size={18} color="#0284c7" />
          </div>
          <div className="metric-value" style={{ color: '#38bdf8' }}>{summary_metrics.volume_drivers_count}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
            {formatCurrency(quadrant_summary.volume_drivers.revenue)} ({quadrant_summary.volume_drivers.revenue_share_pct}%) • High demand velocity
          </div>
        </div>

        {/* Hidden Opportunities */}
        <div
          className="metric-card"
          onClick={() => setActiveView('hidden_opportunities')}
          style={{
            cursor: 'pointer',
            border: activeView === 'hidden_opportunities' ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
            background: activeView === 'hidden_opportunities' ? 'rgba(139, 92, 246, 0.08)' : undefined
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a78bfa' }}>Hidden Opportunities</span>
            <Sparkles size={18} color="#8b5cf6" />
          </div>
          <div className="metric-value" style={{ color: '#a78bfa' }}>{summary_metrics.hidden_opportunities_count}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
            {formatCurrency(quadrant_summary.hidden_opportunities.revenue)} • High margin ({quadrant_summary.hidden_opportunities.avg_margin_pct}%), under-promoted
          </div>
        </div>

        {/* Low Performers */}
        <div
          className="metric-card"
          onClick={() => setActiveView('low_performers')}
          style={{
            cursor: 'pointer',
            border: activeView === 'low_performers' ? '2px solid #ef4444' : '1px solid var(--border-color)',
            background: activeView === 'low_performers' ? 'rgba(239, 68, 68, 0.08)' : undefined
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f87171' }}>Low Performers</span>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div className="metric-value" style={{ color: '#f87171' }}>{summary_metrics.low_performers_count}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
            {formatCurrency(quadrant_summary.low_performers.revenue)} • Low margin &amp; weak demand candidates
          </div>
        </div>

        {/* Slow-Moving Items */}
        <div
          className="metric-card"
          onClick={() => setActiveView('slow_moving')}
          style={{
            cursor: 'pointer',
            border: activeView === 'slow_moving' ? '2px solid #f59e0b' : '1px solid var(--border-color)',
            background: activeView === 'slow_moving' ? 'rgba(245, 158, 11, 0.08)' : undefined
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24' }}>Slow-Moving Dishes</span>
            <ShieldAlert size={18} color="#f59e0b" />
          </div>
          <div className="metric-value" style={{ color: '#fbbf24' }}>{summary_metrics.slow_moving_count}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
            SRS Step 32: 7 criteria verified (Volume, Freq, Gaps, Wastage)
          </div>
        </div>

        {/* Total Wastage Cost */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fb7185' }}>Total Food Wastage</span>
            <Trash2 size={18} color="#f43f5e" />
          </div>
          <div className="metric-value" style={{ color: '#fb7185' }}>{formatCurrency(summary_metrics.total_wastage_cost)}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
            Avg {summary_metrics.average_wastage_pct}% item spoilage rate
          </div>
        </div>

        {/* Total Revenue */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8' }}>Menu Revenue</span>
            <DollarSign size={18} color="#0284c7" />
          </div>
          <div className="metric-value">{formatCurrency(summary_metrics.total_revenue)}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
            Gross Profit: {formatCurrency(summary_metrics.total_contribution_margin)}
          </div>
        </div>

        {/* Total Quantity Sold */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a78bfa' }}>Total Units Sold</span>
            <Layers size={18} color="#8b5cf6" />
          </div>
          <div className="metric-value">{summary_metrics.total_quantity_sold.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
            Across all 20 network locations
          </div>
        </div>
      </div>

      {/* 4-Quadrant Menu Engineering Matrix Cards */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              4-Quadrant Menu Engineering Matrix (BCG Classification)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>
              Click any quadrant card to filter the dish performance table below.
            </p>
          </div>
          {activeView !== 'all' && (
            <button
              onClick={() => setActiveView('all')}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--border-color)',
                color: '#f8fafc',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              Reset Filter (Show All 150)
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Stars / Profit Drivers */}
          <div
            onClick={() => setActiveView('profit_drivers')}
            style={{
              padding: '18px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.05))',
              border: activeView === 'profit_drivers' ? '2px solid #10b981' : '1px solid rgba(16, 185, 129, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                High Demand • High Margin
              </span>
              <span style={{ background: '#10b981', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                {profit_drivers.length} Items
              </span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>Profit Drivers</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: '1.4', margin: '0 0 10px' }}>
              Core cash cows and culinary anchors. Maintain flawless consistency, protect recipe standards, and feature prominently.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
              <span>Revenue: {formatCurrency(quadrant_summary.profit_drivers.revenue)}</span>
              <span>Avg Margin: {quadrant_summary.profit_drivers.avg_margin_pct}%</span>
            </div>
          </div>

          {/* Plowhorses / Volume Drivers */}
          <div
            onClick={() => setActiveView('volume_drivers')}
            style={{
              padding: '18px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(14, 165, 233, 0.05))',
              border: activeView === 'volume_drivers' ? '2px solid #0284c7' : '1px solid rgba(2, 132, 199, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                High Demand • Moderate Margin
              </span>
              <span style={{ background: '#0284c7', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                {volume_drivers.length} Items
              </span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>Volume Drivers</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: '1.4', margin: '0 0 10px' }}>
              Customer traffic magnets. Reposition slightly with premium add-ons or minor price hikes (+3-5%) without sacrificing order frequency.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
              <span>Revenue: {formatCurrency(quadrant_summary.volume_drivers.revenue)}</span>
              <span>Avg Margin: {quadrant_summary.volume_drivers.avg_margin_pct}%</span>
            </div>
          </div>

          {/* Puzzles / Hidden Opportunities */}
          <div
            onClick={() => setActiveView('hidden_opportunities')}
            style={{
              padding: '18px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.05))',
              border: activeView === 'hidden_opportunities' ? '2px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Low Demand • High Margin
              </span>
              <span style={{ background: '#8b5cf6', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                {hidden_opportunities.length} Items
              </span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>Hidden Opportunities</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: '1.4', margin: '0 0 10px' }}>
              High-profit gems suffering from low exposure. Reposition at the top of digital apps, bundle with popular drinks, or run flash tastings.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
              <span>Revenue: {formatCurrency(quadrant_summary.hidden_opportunities.revenue)}</span>
              <span>Avg Margin: {quadrant_summary.hidden_opportunities.avg_margin_pct}%</span>
            </div>
          </div>

          {/* Dogs / Low Performers */}
          <div
            onClick={() => setActiveView('low_performers')}
            style={{
              padding: '18px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.05))',
              border: activeView === 'low_performers' ? '2px solid #ef4444' : '1px solid rgba(239, 68, 68, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Low Demand • Low Margin
              </span>
              <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                {low_performers.length} Items
              </span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>Low Performers</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: '1.4', margin: '0 0 10px' }}>
              Operational drags producing excessive wastage. Re-engineer ingredients, adjust portion sizes, or phase out entirely.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
              <span>Revenue: {formatCurrency(quadrant_summary.low_performers.revenue)}</span>
              <span>Avg Margin: {quadrant_summary.low_performers.avg_margin_pct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings & Margins Distributions (Deep Dive Row) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Ratings Breakdown */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Star size={18} color="#fbbf24" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Customer Ratings Distribution
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ratings.rating_distribution.map((bucket, idx) => {
              const pct = Math.round((bucket.count / summary_metrics.total_menu_items) * 100);
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ color: '#e2e8f0' }}>{bucket.range}</span>
                    <span style={{ fontWeight: 600, color: '#94a3b8' }}>{bucket.count} items ({pct}%)</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: idx === 0 ? '#10b981' : idx === 1 ? '#0284c7' : idx === 2 ? '#fbbf24' : '#ef4444' }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              Highest Rated Dishes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {ratings.top_rated_items.slice(0, 3).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: '#cbd5e1' }}>{item.item_name}</span>
                  <span style={{ color: '#fbbf24', fontWeight: 700 }}>★ {item.customer_rating}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Margins Breakdown */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Percent size={18} color="#34d399" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Contribution Margin Distribution
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {margins.margin_distribution.map((bucket, idx) => {
              const pct = Math.round((bucket.count / summary_metrics.total_menu_items) * 100);
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ color: '#e2e8f0' }}>{bucket.range}</span>
                    <span style={{ fontWeight: 600, color: '#94a3b8' }}>{bucket.count} items ({pct}%)</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: idx === 0 ? '#10b981' : idx === 1 ? '#0284c7' : idx === 2 ? '#fbbf24' : '#ef4444' }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              Highest Margin Dishes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {margins.highest_margin_items.slice(0, 3).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: '#cbd5e1' }}>{item.item_name}</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>{item.margin_pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wastage Breakdown */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Trash2 size={18} color="#fb7185" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Food Wastage &amp; Spoilage Drag
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#94a3b8' }}>Total Portfolio Spoilage:</span>
              <span style={{ color: '#fb7185', fontWeight: 700 }}>{formatCurrency(wastage.total_wastage_cost)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#94a3b8' }}>Wasted Units:</span>
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>{wastage.total_wastage_units.toLocaleString()} units</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#94a3b8' }}>Portfolio Spoilage Rate:</span>
              <span style={{ color: '#fbbf24', fontWeight: 600 }}>{wastage.average_wastage_pct}%</span>
            </div>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              Highest Wastage Dishes (Prep-Loss Drag)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {wastage.highest_wastage_items.slice(0, 3).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: '#cbd5e1' }}>{item.item_name}</span>
                  <span style={{ color: '#fb7185', fontWeight: 700 }}>{formatCurrency(item.total_wastage_cost)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '14px' }}>
          Category-Level Revenue, Margin &amp; Wastage Performance
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#94a3b8' }}>
                <th style={{ padding: '10px 12px' }}>Category Name</th>
                <th style={{ padding: '10px 12px' }}>Items</th>
                <th style={{ padding: '10px 12px' }}>Revenue</th>
                <th style={{ padding: '10px 12px' }}>Contribution Margin</th>
                <th style={{ padding: '10px 12px' }}>Margin %</th>
                <th style={{ padding: '10px 12px' }}>Avg Rating</th>
                <th style={{ padding: '10px 12px' }}>Wastage Cost</th>
              </tr>
            </thead>
            <tbody>
              {category_performance.map((cat, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: '#f8fafc' }}>{cat.category_name}</td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{cat.item_count}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: '#38bdf8' }}>{formatCurrency(cat.revenue)}</td>
                  <td style={{ padding: '10px 12px', color: '#34d399' }}>{formatCurrency(cat.contribution_margin)}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: cat.margin_pct >= 60 ? '#10b981' : cat.margin_pct >= 50 ? '#38bdf8' : '#fbbf24' }}>
                    {cat.margin_pct}%
                  </td>
                  <td style={{ padding: '10px 12px', color: '#fbbf24' }}>★ {cat.avg_rating}</td>
                  <td style={{ padding: '10px 12px', color: '#fb7185' }}>{formatCurrency(cat.total_wastage_cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slow-Moving Dishes Audit Card (Step 32) */}
      <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#f59e0b', color: '#000', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                Step 32 Integration
              </span>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Slow-Moving Dishes Audit ({slow_moving_items.length} Flagged Dishes)
              </h2>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0' }}>
              Identified via the 7 exact SRS dimensions: low volume, low frequency, long gaps, low repeat, high wastage, weak profitability, poor trend.
            </p>
          </div>
          <button
            onClick={() => setActiveView('slow_moving')}
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#fbbf24',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Filter Table Below to Slow-Moving
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {slow_moving_items.slice(0, 4).map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem' }}>{item.item_name}</span>
                <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: '#ef4444', color: '#fff', fontWeight: 600 }}>
                  {item.movement_class || 'Slow-Moving'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px' }}>{item.category_name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1' }}>
                <span>Wastage: <strong style={{ color: '#fb7185' }}>{formatCurrency(item.wasted_cost || item.total_wastage_cost)}</strong></span>
                <span>Margin: <strong style={{ color: '#34d399' }}>{Math.round(item.contribution_margin_pct || item.profit_percentage || 50)}%</strong></span>
              </div>
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.72rem', color: '#f59e0b' }}>
                Action: {item.recommended_action || 'Review Prep & Retargeting'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Interactive Menu-Item Performance Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Menu-Item Performance Directory ({displayedItems.length} Dishes Shown)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>
              Searchable, filterable, and sortable by volume, revenue, contribution margin, ratings, and wastage drag.
            </p>
          </div>

          {/* Controls: Search & Category */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '200px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search dish or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: '#f8fafc',
                  padding: '6px 12px 6px 32px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  outline: 'none',
                  width: '100%'
                }}
              />
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: '#f8fafc',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              {categories.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* View Filter Pill Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'all', label: `All Dishes (${menu_item_performance.length})` },
            { id: 'profit_drivers', label: `Profit Drivers (${profit_drivers.length})`, color: '#10b981' },
            { id: 'volume_drivers', label: `Volume Drivers (${volume_drivers.length})`, color: '#0284c7' },
            { id: 'hidden_opportunities', label: `Hidden Opportunities (${hidden_opportunities.length})`, color: '#8b5cf6' },
            { id: 'low_performers', label: `Low Performers (${low_performers.length})`, color: '#ef4444' },
            { id: 'slow_moving', label: `Slow-Moving Dishes (${slow_moving_items.length})`, color: '#f59e0b' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              style={{
                background: activeView === tab.id ? (tab.color ? `${tab.color}22` : 'rgba(255,255,255,0.15)') : 'rgba(255,255,255,0.05)',
                border: activeView === tab.id ? `1px solid ${tab.color || '#fff'}` : '1px solid transparent',
                color: activeView === tab.id ? (tab.color || '#fff') : '#94a3b8',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dish Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#94a3b8', userSelect: 'none' }}>
                <th style={{ padding: '10px 12px' }}>Dish / ID</th>
                <th style={{ padding: '10px 12px' }}>Category</th>
                <th style={{ padding: '10px 12px', cursor: 'pointer' }} onClick={() => toggleSort('base_price')}>
                  Price <ArrowUpDown size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </th>
                <th style={{ padding: '10px 12px', cursor: 'pointer' }} onClick={() => toggleSort('quantity_sold')}>
                  Volume <ArrowUpDown size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </th>
                <th style={{ padding: '10px 12px', cursor: 'pointer' }} onClick={() => toggleSort('revenue')}>
                  Revenue <ArrowUpDown size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </th>
                <th style={{ padding: '10px 12px', cursor: 'pointer' }} onClick={() => toggleSort('margin_pct')}>
                  Margin % <ArrowUpDown size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </th>
                <th style={{ padding: '10px 12px', cursor: 'pointer' }} onClick={() => toggleSort('customer_rating')}>
                  Rating <ArrowUpDown size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </th>
                <th style={{ padding: '10px 12px', cursor: 'pointer' }} onClick={() => toggleSort('total_wastage_cost')}>
                  Wastage Cost <ArrowUpDown size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </th>
                <th style={{ padding: '10px 12px' }}>Classification</th>
              </tr>
            </thead>
            <tbody>
              {displayedItems.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                    No menu items match the active search and filter criteria.
                  </td>
                </tr>
              ) : (
                displayedItems.map((item) => (
                  <tr key={item.item_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>{item.item_name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.item_id}</div>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{item.category_name}</td>
                    <td style={{ padding: '10px 12px', color: '#f8fafc' }}>${item.base_price.toFixed(2)}</td>
                    <td style={{ padding: '10px 12px', color: '#f8fafc' }}>{item.quantity_sold.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#38bdf8' }}>{formatCurrency(item.revenue)}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: item.margin_pct >= 60 ? '#10b981' : item.margin_pct >= 50 ? '#38bdf8' : '#fbbf24' }}>
                      {item.margin_pct}%
                    </td>
                    <td style={{ padding: '10px 12px', color: '#fbbf24', fontWeight: 600 }}>★ {item.customer_rating}</td>
                    <td style={{ padding: '10px 12px', color: '#fb7185' }}>
                      {formatCurrency(item.total_wastage_cost)}
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>({item.wastage_percentage}%)</span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background:
                          item.classification === 'Profit Driver' ? 'rgba(16, 185, 129, 0.2)' :
                          item.classification === 'Volume Driver' ? 'rgba(2, 132, 199, 0.2)' :
                          item.classification === 'Hidden Opportunity' ? 'rgba(139, 92, 246, 0.2)' :
                          'rgba(239, 68, 68, 0.2)',
                        color:
                          item.classification === 'Profit Driver' ? '#34d399' :
                          item.classification === 'Volume Driver' ? '#38bdf8' :
                          item.classification === 'Hidden Opportunity' ? '#a78bfa' :
                          '#f87171'
                      }}>
                        {item.classification}
                      </span>
                      {item.is_slow_moving && (
                        <span style={{
                          marginLeft: '4px',
                          fontSize: '0.65rem',
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: '#fbbf24',
                          padding: '2px 5px',
                          borderRadius: '4px'
                        }}>
                          Slow-Moving
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
