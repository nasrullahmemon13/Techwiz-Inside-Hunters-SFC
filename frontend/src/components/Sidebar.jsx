import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  Trash2,
  TrendingUp,
  GitCompare,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Database,
  Lock,
  UploadCloud,
  Store,
  ShoppingCart,
  Megaphone,
  Star,
  Package,
  Layers,
  BarChart3,
  Brain,
  Lightbulb,
  Target,
  AlertTriangle,
  MapPin,
  Zap,
  Sparkles,
  DollarSign,
  GitBranch
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'MANAGEMENT',
    items: [
      { path: '/', name: 'Dashboard', icon: LayoutDashboard, exact: true, allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'] },
      { path: '/restaurants', name: 'Restaurants', icon: Store, allowedRoles: ['admin', 'regional_manager'] },
      { path: '/menu', name: 'Menu', icon: UtensilsCrossed, allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'] },
      { path: '/customer', name: 'Customers', icon: Users, allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'] },
      { path: '/orders', name: 'Orders', icon: ShoppingCart, allowedRoles: ['admin', 'regional_manager', 'manager'] },
      { path: '/promotions', name: 'Promotions', icon: Megaphone, allowedRoles: ['admin', 'regional_manager'] },
      { path: '/ratings', name: 'Ratings', icon: Star, allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'] },
      { path: '/inventory', name: 'Inventory', icon: Package, allowedRoles: ['admin', 'regional_manager', 'manager'] },
      { path: '/wastage', name: 'Wastage', icon: Trash2, allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'] },
    ]
  },
  {
    label: 'INTELLIGENCE',
    items: [
      { path: '/menu', name: 'Menu Intelligence', icon: UtensilsCrossed, allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'] },
      { path: '/customer', name: 'Customer Intelligence', icon: Users, allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'] },
      { path: '/basket', name: 'Basket Analysis', icon: ShoppingCart, allowedRoles: ['admin', 'regional_manager', 'analyst'] },
      { path: '/peak-periods', name: 'Peak Periods', icon: TrendingUp, allowedRoles: ['admin', 'regional_manager', 'analyst'] },
      { path: '/forecast', name: 'Demand Forecast', icon: BarChart3, allowedRoles: ['analyst', 'regional_manager', 'admin'] },
      { path: '/wastage', name: 'Wastage Intelligence', icon: Trash2, allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'] },
      { path: '/pricing', name: 'Pricing & Promotions', icon: DollarSign, allowedRoles: ['admin', 'regional_manager', 'analyst'] },
      { path: '/locations', name: 'Locations & Channels', icon: MapPin, allowedRoles: ['admin', 'regional_manager', 'analyst'] },
      { path: '/anomalies', name: 'Anomalies & Churn', icon: AlertTriangle, allowedRoles: ['admin', 'analyst'] },
    ]
  },
  {
    label: 'AI & MODELS',
    items: [
      { path: '/comparison', name: 'Model Performance', icon: Brain, allowedRoles: ['analyst', 'admin'] },
      { path: '/comparison', name: 'Spark vs Python', icon: GitBranch, allowedRoles: ['analyst', 'admin'] },
    ]
  },
  {
    label: 'DECISION SUPPORT',
    items: [
      { path: '/recommendations', name: 'Recommendations', icon: Lightbulb, allowedRoles: ['admin', 'regional_manager', 'analyst'] },
      { path: '/what-if', name: 'What-If Analysis', icon: Target, allowedRoles: ['analyst', 'admin'] },
    ]
  }
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, hasRole } = useAuth();

  return (
    <aside style={{
      width: collapsed ? '60px' : '220px',
      backgroundColor: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      flexShrink: 0,
      zIndex: 20,
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        style={{
          position: 'absolute',
          right: '-11px',
          top: '18px',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          backgroundColor: 'var(--surface-elevated, var(--surface))',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 30,
          boxShadow: 'var(--shadow-sm)',
          padding: 0
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Navigation Groups */}
      <nav style={{ padding: '12px 0', flex: 1 }}>
        {NAV_GROUPS.map((group, gIdx) => (
          <div key={gIdx} style={{ marginBottom: collapsed ? '8px' : '4px' }}>
            {/* Group Label */}
            {!collapsed && (
              <div style={{
                padding: '10px 16px 4px 16px',
                fontSize: '0.62rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--text-muted)',
                userSelect: 'none'
              }}>
                {group.label}
              </div>
            )}
            {collapsed && gIdx > 0 && (
              <div style={{
                margin: '6px 10px',
                height: '1px',
                backgroundColor: 'var(--border)'
              }} />
            )}

            {/* Group Items */}
            {group.items.map((item) => {
              const Icon = item.icon;
              const userHasAccess = hasRole(item.allowedRoles);

              return (
                <NavLink
                  key={`${item.path}-${item.name}`}
                  to={item.path}
                  end={item.exact}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: collapsed ? '8px 0' : '6px 12px 6px 16px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    margin: collapsed ? '2px 8px' : '1px 8px',
                    borderRadius: '6px',
                    color: isActive
                      ? 'var(--primary)'
                      : userHasAccess
                        ? 'var(--text-secondary)'
                        : 'var(--text-muted)',
                    backgroundColor: isActive ? 'var(--primary-tint)' : 'transparent',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.15s ease',
                    opacity: userHasAccess ? 1 : 0.5,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                  })}
                  title={collapsed ? item.name : undefined}
                >
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    <Icon size={15} />
                  </div>
                  {!collapsed && (
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                      {item.name}
                    </span>
                  )}
                  {!collapsed && !userHasAccess && (
                    <Lock size={10} style={{ flexShrink: 0, marginLeft: 'auto' }} />
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Scope Footer */}
      {!collapsed && user && (
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--surface-secondary)'
        }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
            Assigned Scope
          </div>
          <div style={{
            fontSize: '0.72rem',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Database size={10} color="var(--success)" />
            <span>{user.assigned_location_id || 'All Locations'}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
