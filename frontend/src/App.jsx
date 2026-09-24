import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ExecutiveDashboard from './dashboards/ExecutiveDashboard';
import MenuIntelligenceDashboard from './dashboards/MenuIntelligenceDashboard';
import CustomerIntelligenceDashboard from './dashboards/CustomerIntelligenceDashboard';
import WastageDashboard from './dashboards/WastageDashboard';
import SearchFilterModal from './components/SearchFilterModal';
import ReportsExportsModal from './components/ReportsExportsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('executive');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenReports={() => setIsReportsOpen(true)}
      />

      {/* Global Modals for Steps 48, 49, 50 */}
      <SearchFilterModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <ReportsExportsModal
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
      />

      <main className="dashboard-container" style={{ flex: 1, width: '100%' }}>
        {activeTab === 'executive' && <ExecutiveDashboard />}
        {activeTab === 'menu' && <MenuIntelligenceDashboard />}
        {activeTab === 'customer' && <CustomerIntelligenceDashboard />}
        {activeTab === 'wastage' && <WastageDashboard />}

        {activeTab !== 'executive' && activeTab !== 'menu' && activeTab !== 'customer' && activeTab !== 'wastage' && (
          <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
              Dashboard Scheduled in Pipeline Sequence
            </h2>
            <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto 20px' }}>
              Building one dashboard at a time. Steps 42, 43, 44, 45 are live.
            </p>
            <button
              onClick={() => setActiveTab('executive')}
              style={{
                background: '#0284c7',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Return to Executive Dashboard
            </button>
          </div>
        )}
      </main>

      <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '16px 24px', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
        DineIQ Analytics &copy; 2026. Built with React &amp; FastAPI. Conforms to Software Requirements Specification (SRS v1.0).
      </footer>
    </div>
  );
}
