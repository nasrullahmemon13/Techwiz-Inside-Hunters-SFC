import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import SearchFilterModal from './SearchFilterModal';
import ReportsExportsModal from './ReportsExportsModal';
import ThemeToggle from './ThemeToggle';
import {
  UtensilsCrossed,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  MapPin,
  Calendar,
  Settings,
  Download
} from 'lucide-react';

export default function AppLayout() {
  const { user, roleMeta, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--background)'
    }}>
      {/* ─── Top Header Bar ─────────────────────────────────── */}
      <header style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '12px'
      }}>
        {/* Brand Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: sidebarCollapsed ? '44px' : '204px',
          flexShrink: 0,
          transition: 'width 0.25s ease',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #f97316, #ef4444)',
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <UtensilsCrossed size={16} color="#ffffff" />
          </div>
          {!sidebarCollapsed && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                DineIQ <span style={{ color: '#f97316' }}>Analytics</span>
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '-1px' }}>
                Restaurant Intelligence Platform
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div
          onClick={() => setIsSearchOpen(true)}
          style={{
            flex: 1,
            maxWidth: '480px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '7px 12px',
            cursor: 'pointer',
            transition: 'border-color 0.15s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <Search size={14} color="var(--text-muted)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flex: 1 }}>
            Search menus, customers, locations, insights...
          </span>
          <kbd style={{
            fontSize: '0.62rem',
            padding: '2px 5px',
            borderRadius: '4px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-muted)',
            fontFamily: 'monospace'
          }}>
            Ctrl+K
          </kbd>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Date Range Filter */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 10px',
          borderRadius: '7px',
          border: '1px solid var(--border)',
          background: 'var(--surface-secondary)',
          color: 'var(--text-secondary)',
          fontSize: '0.78rem',
          fontWeight: 500,
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}>
          <Calendar size={13} />
          <span>Last 30 Days</span>
          <ChevronDown size={11} />
        </button>

        {/* Location Filter */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 10px',
          borderRadius: '7px',
          border: '1px solid var(--border)',
          background: 'var(--surface-secondary)',
          color: 'var(--text-secondary)',
          fontSize: '0.78rem',
          fontWeight: 500,
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}>
          <MapPin size={13} />
          <span>All Locations</span>
          <ChevronDown size={11} />
        </button>

        {/* Notifications */}
        <button style={{
          position: 'relative',
          width: '34px',
          height: '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          background: 'var(--surface-secondary)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          flexShrink: 0
        }}>
          <Bell size={15} />
          {/* Red dot */}
          <span style={{
            position: 'absolute',
            top: '7px',
            right: '7px',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            border: '1.5px solid var(--surface)'
          }} />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle style={{ flexShrink: 0 }} />

        {/* User Profile */}
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 8px 4px 4px',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            background: 'var(--surface-secondary)',
            cursor: 'default',
            flexShrink: 0
          }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: roleMeta?.badgeColor || 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#ffffff',
              flexShrink: 0
            }}>
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                {user.full_name || user.username}
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {roleMeta?.name || user.role_id}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
                borderRadius: '4px',
                marginLeft: '2px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <LogOut size={13} />
            </button>
          </div>
        )}
      </header>

      {/* Global Modals */}
      <SearchFilterModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ReportsExportsModal isOpen={isReportsOpen} onClose={() => setIsReportsOpen(false)} />

      {/* ─── Body: Sidebar + Main ───────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        <main style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          backgroundColor: 'var(--background)',
          minWidth: 0
        }}>
          {/* Page-level toolbar (Customize button like reference image) */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '8px 20px 0',
            gap: '8px'
          }}>
            <button
              onClick={() => setIsReportsOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              <Download size={12} />
              Export
            </button>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              <Settings size={12} />
              Customize
            </button>
          </div>

          <div style={{ padding: '12px 20px 24px' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
