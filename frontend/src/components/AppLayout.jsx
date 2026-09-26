import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import SearchFilterModal from './SearchFilterModal';
import ReportsExportsModal from './ReportsExportsModal';
import {
  UtensilsCrossed,
  Filter,
  Download,
  Activity,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  ChevronDown
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary, #0a0f1d)' }}>
      {/* Top Application Header */}
      <header style={{
        background: 'var(--bg-secondary, #0f172a)',
        borderBottom: '1px solid var(--border-color, #334155)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo & Brand Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
            }}>
              <UtensilsCrossed size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                  DineIQ <span style={{ color: '#38bdf8' }}>Analytics</span>
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  fontWeight: 600
                }}>
                  Enterprise v1.0
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748b)', margin: 0 }}>
                Restaurant Big Data &amp; Data Science Intelligence Platform
              </p>
            </div>
          </div>

          {/* Action Modals & User Identity Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsSearchOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Filter size={14} />
              <span>Search &amp; Filter (Step 48)</span>
            </button>

            <button
              onClick={() => setIsReportsOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#818cf8',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Download size={14} />
              <span>Reports &amp; Exports (49-50)</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <Activity size={13} />
              <span>FastAPI (:8000)</span>
            </div>

            {/* Authenticated User Profile Pill */}
            {user && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '4px 10px 4px 6px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '24px'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: roleMeta?.badgeColor || '#0284c7',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}>
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>
                      {user.full_name || user.username}
                    </span>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      backgroundColor: roleMeta?.bgBadge || 'rgba(14, 165, 233, 0.15)',
                      color: roleMeta?.badgeColor || '#38bdf8'
                    }}>
                      {roleMeta?.name || user.role_id}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    marginLeft: '4px',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f43f5e')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  title="Sign out of DineIQ platform"
                >
                  <LogOut size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Modals */}
      <SearchFilterModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <ReportsExportsModal
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
      />

      {/* Main Container with Sidebar + View Area */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        <main style={{
          flex: 1,
          padding: '24px',
          overflowX: 'hidden',
          backgroundColor: 'var(--bg-primary, #0a0f1d)',
          minWidth: 0
        }}>
          <Outlet />
        </main>
      </div>

      {/* Persistent Footer */}
      <footer style={{
        background: 'var(--bg-secondary, #0f172a)',
        borderTop: '1px solid var(--border-color, #334155)',
        padding: '14px 24px',
        textAlign: 'center',
        fontSize: '0.78rem',
        color: '#64748b'
      }}>
        DineIQ Analytics &copy; 2026. Built with React &amp; FastAPI. Conforms to Software Requirements Specification (SRS v1.0).
      </footer>
    </div>
  );
}
