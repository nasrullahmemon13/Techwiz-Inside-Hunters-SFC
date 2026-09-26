import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
  Sparkles
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  {
    path: '/',
    name: 'Executive Overview',
    step: 'Step 42',
    icon: LayoutDashboard,
    allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'],
    status: 'live'
  },
  {
    path: '/menu',
    name: 'Menu Intelligence',
    step: 'Step 43',
    icon: UtensilsCrossed,
    allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'],
    status: 'live'
  },
  {
    path: '/customer',
    name: 'Customer Intelligence',
    step: 'Step 44',
    icon: Users,
    allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'],
    status: 'live'
  },
  {
    path: '/wastage',
    name: 'Wastage & Inventory',
    step: 'Step 45',
    icon: Trash2,
    allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'],
    status: 'live'
  },
  {
    path: '/forecast',
    name: 'Demand Forecasting',
    step: 'Step 46',
    icon: TrendingUp,
    allowedRoles: ['analyst', 'regional_manager', 'admin'],
    status: 'upcoming'
  },
  {
    path: '/comparison',
    name: 'Dual-Pipeline ML',
    step: 'Step 47',
    icon: GitCompare,
    allowedRoles: ['analyst', 'admin'],
    status: 'upcoming'
  },
  {
    path: '/system',
    name: 'System Ops & Spark',
    step: 'FR lxi-lxvi',
    icon: ShieldCheck,
    allowedRoles: ['admin'],
    status: 'live'
  }
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, hasRole } = useAuth();

  return (
    <aside style={{
      width: collapsed ? '68px' : '260px',
      backgroundColor: 'var(--bg-secondary, #0f172a)',
      borderRight: '1px solid var(--border-color, #334155)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease-in-out',
      position: 'relative',
      flexShrink: 0,
      zIndex: 20
    }}>
      {/* Sidebar Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute',
          right: '-12px',
          top: '20px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: '#1e293b',
          border: '1px solid #475569',
          color: '#cbd5e1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 30,
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation Group Title */}
      <div style={{
        padding: collapsed ? '16px 8px 8px 8px' : '20px 16px 8px 20px',
        fontSize: '0.7rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#64748b'
      }}>
        {!collapsed ? 'Analytical Suite' : '---'}
      </div>

      {/* Navigation Links */}
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '0 10px',
        flex: 1
      }}>
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const userHasAccess = hasRole(item.allowedRoles);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: collapsed ? '10px 0' : '10px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: '8px',
                color: isActive ? '#38bdf8' : userHasAccess ? '#94a3b8' : '#64748b',
                backgroundColor: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid transparent',
                textDecoration: 'none',
                fontSize: '0.84rem',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.15s ease',
                position: 'relative'
              })}
              title={collapsed ? `${item.name} (${item.step})` : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} />
              </div>

              {!collapsed && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', overflow: 'hidden' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span>{item.name}</span>
                    <span style={{
                      display: 'block',
                      fontSize: '0.68rem',
                      color: '#64748b',
                      marginTop: '1px'
                    }}>
                      {item.step}
                    </span>
                  </div>

                  {!userHasAccess && (
                    <span title={`Requires: ${item.allowedRoles.join(', ')}`} style={{ color: '#f43f5e', marginLeft: '6px' }}>
                      <Lock size={12} />
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Role Info Footer in Sidebar */}
      {!collapsed && user && (
        <div style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border-color, #334155)',
          backgroundColor: '#0a0f1d'
        }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '4px' }}>
            Current Assigned Scope:
          </div>
          <div style={{
            fontSize: '0.78rem',
            color: '#cbd5e1',
            fontFamily: 'JetBrains Mono, monospace',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Database size={12} color="#10b981" />
            <span>{user.assigned_location_id || 'All Locations (Corp)'}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
