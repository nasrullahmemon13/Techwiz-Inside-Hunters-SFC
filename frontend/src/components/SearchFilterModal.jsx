import React, { useState, useEffect } from 'react';
import { Filter, X, Search, Check, RefreshCw, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function SearchFilterModal({ isOpen, onClose, onApplyFilters }) {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(false);

  // The 11 Step 48 filter state dimensions
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [menuItem, setMenuItem] = useState('');
  const [menuCategory, setMenuCategory] = useState('');
  const [customerSegment, setCustomerSegment] = useState('');
  const [orderingChannel, setOrderingChannel] = useState('');
  const [promotion, setPromotion] = useState('');
  const [performanceClass, setPerformanceClass] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [minWastage, setMinWastage] = useState('');
  const [maxWastage, setMaxWastage] = useState('');

  // Results
  const [queryResults, setQueryResults] = useState(null);
  const [filtering, setFiltering] = useState(false);

  useEffect(() => {
    if (isOpen && !options) {
      fetch('/api/v1/search/options')
        .then(r => r.json())
        .then(data => setOptions(data.dimensions))
        .catch(err => console.error('Failed to load filter options:', err));
    }
  }, [isOpen, options]);

  if (!isOpen) return null;

  const handleApply = async () => {
    setFiltering(true);
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (location) params.append('location', location);
    if (menuItem) params.append('menu_item', menuItem);
    if (menuCategory) params.append('menu_category', menuCategory);
    if (customerSegment) params.append('customer_segment', customerSegment);
    if (orderingChannel) params.append('ordering_channel', orderingChannel);
    if (promotion) params.append('promotion', promotion);
    if (performanceClass) params.append('performance_class', performanceClass);
    if (minPrice) params.append('min_price', minPrice);
    if (maxPrice) params.append('max_price', maxPrice);
    if (minRating) params.append('min_rating', minRating);
    if (maxRating) params.append('max_rating', maxRating);
    if (minWastage) params.append('min_wastage_rate', minWastage);
    if (maxWastage) params.append('max_wastage_rate', maxWastage);

    try {
      const res = await fetch(`/api/v1/search/filter?${params.toString()}`);
      const data = await res.json();
      setQueryResults(data);
      if (onApplyFilters) onApplyFilters(data);
    } catch (e) {
      console.error('Filter execution failed:', e);
    } finally {
      setFiltering(false);
    }
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setLocation('');
    setMenuItem('');
    setMenuCategory('');
    setCustomerSegment('');
    setOrderingChannel('');
    setPromotion('');
    setPerformanceClass('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setMaxRating('');
    setMinWastage('');
    setMaxWastage('');
    setQueryResults(null);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(10, 15, 29, 0.85)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '1020px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        background: '#0f172a',
        borderColor: '#475569'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ padding: '6px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              <Filter size={20} />
            </span>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                Multi-Dimensional Search &amp; Filter
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                SRS Step 48: Filter across all 11 exact operational and customer dimensions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* 11 Filters Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {/* 1. Date Range */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              1. Date Range (Start - End)
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '0.8rem' }}
              />
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          {/* 2. Location */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              2. Restaurant Location
            </label>
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '0.8rem' }}
            >
              <option value="">All 20 Locations</option>
              {options?.location?.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* 3. Menu Item */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              3. Menu Item Search
            </label>
            <input
              type="text"
              placeholder="e.g. Lobster, Wagyu, Salmon"
              value={menuItem}
              onChange={e => setMenuItem(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '0.8rem' }}
            />
          </div>

          {/* 4. Menu Category */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              4. Menu Category
            </label>
            <select
              value={menuCategory}
              onChange={e => setMenuCategory(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '0.8rem' }}
            >
              <option value="">All 10 Categories</option>
              {options?.menu_category?.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* 5. Customer Segment */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              5. Customer Segment
            </label>
            <select
              value={customerSegment}
              onChange={e => setCustomerSegment(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '0.8rem' }}
            >
              <option value="">All Customer Segments</option>
              {options?.customer_segment?.map((seg, idx) => (
                <option key={idx} value={seg}>{seg}</option>
              ))}
            </select>
          </div>

          {/* 6. Ordering Channel */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              6. Ordering Channel
            </label>
            <select
              value={orderingChannel}
              onChange={e => setOrderingChannel(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '0.8rem' }}
            >
              <option value="">All Ordering Channels</option>
              {options?.ordering_channel?.map((ch, idx) => (
                <option key={idx} value={ch}>{ch}</option>
              ))}
            </select>
          </div>

          {/* 7. Promotion */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              7. Promotion Campaign
            </label>
            <select
              value={promotion}
              onChange={e => setPromotion(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '0.8rem' }}
            >
              <option value="">All / Any Promotion</option>
              {options?.promotion?.map((p, idx) => (
                <option key={idx} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* 8. Performance Class */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              8. Performance Class
            </label>
            <select
              value={performanceClass}
              onChange={e => setPerformanceClass(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '0.8rem' }}
            >
              <option value="">All 4 Performance Classes</option>
              {options?.performance_class?.map((pc, idx) => (
                <option key={idx} value={pc}>{pc}</option>
              ))}
            </select>
          </div>

          {/* 9. Price Range */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              9. Price Range ($)
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="number"
                placeholder="Min $"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '0.8rem' }}
              />
              <input
                type="number"
                placeholder="Max $"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          {/* 10. Rating */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              10. Customer Rating (1.0 - 5.0)
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="number"
                step="0.1"
                placeholder="Min Stars"
                value={minRating}
                onChange={e => setMinRating(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '0.8rem' }}
              />
              <input
                type="number"
                step="0.1"
                placeholder="Max Stars"
                value={maxRating}
                onChange={e => setMaxRating(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          {/* 11. Wastage Range */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              11. Wastage Rate Range (%)
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="number"
                placeholder="Min %"
                value={minWastage}
                onChange={e => setMinWastage(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '0.8rem' }}
              />
              <input
                type="number"
                placeholder="Max %"
                value={maxWastage}
                onChange={e => setMaxWastage(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '0.8rem' }}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '16px' }}>
          <button
            onClick={handleReset}
            style={{ background: 'transparent', border: '1px solid #475569', color: '#94a3b8', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Clear All Filters
          </button>

          <button
            onClick={handleApply}
            disabled={filtering}
            style={{
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {filtering ? <RefreshCw className="animate-spin" size={16} /> : <Search size={16} />}
            <span>Apply 11-Dimensional Filter</span>
          </button>
        </div>

        {/* Real-Time Filter Aggregates */}
        {queryResults && (
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                Filtered Matches: {queryResults.total_matches.toLocaleString()} records
              </span>
              <span className="kpi-badge badge-emerald">
                Filtered Revenue: ${queryResults.aggregates.filtered_total_revenue?.toLocaleString()}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', fontSize: '0.8rem', color: '#cbd5e1' }}>
              <div>Gross Profit: <strong style={{ color: '#34d399' }}>${queryResults.aggregates.filtered_total_profit?.toLocaleString()}</strong></div>
              <div>Margin: <strong style={{ color: '#38bdf8' }}>{queryResults.aggregates.filtered_average_margin_pct}%</strong></div>
              <div>Units Sold: <strong>{queryResults.aggregates.filtered_total_quantity_sold?.toLocaleString()}</strong></div>
              <div>Wastage Loss: <strong style={{ color: '#fb7185' }}>${queryResults.aggregates.filtered_total_wastage_cost?.toLocaleString()}</strong></div>
              <div>Avg Rating: <strong style={{ color: '#fbbf24' }}>★ {queryResults.aggregates.filtered_average_rating}</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
