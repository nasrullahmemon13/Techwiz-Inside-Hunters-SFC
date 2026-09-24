import React, { useState, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, Lock, CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react';

export default function ReportsExportsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' | 'exports'
  const [reports, setReports] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [userRole, setUserRole] = useState('analyst'); // 'analyst' | 'admin' | 'executive' | 'viewer'
  const [exportStatus, setExportStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Load reports
      fetch('/api/v1/reports')
        .then(r => r.json())
        .then(data => setReports(data.reports || []))
        .catch(err => console.error('Failed to load reports:', err));

      // Load datasets
      fetch('/api/v1/export/datasets')
        .then(r => r.json())
        .then(data => setDatasets(data.datasets || []))
        .catch(err => console.error('Failed to load datasets:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadReport = (reportKey) => {
    window.open(`/api/v1/reports/${reportKey}/download`, '_blank');
  };

  const handleExportData = async (datasetKey, format) => {
    setExportStatus({ loading: true, msg: `Exporting ${datasetKey} as ${format.toUpperCase()}...` });
    try {
      const res = await fetch(`/api/v1/export/${datasetKey}?format=${format}`, {
        headers: {
          'X-User-Role': userRole
        }
      });

      if (res.status === 403) {
        const errorData = await res.json();
        setExportStatus({
          error: true,
          msg: `Access Denied (403): Role '${userRole}' lacks permission to export data. Only 'admin', 'analyst', and 'executive' are authorized.`
        });
        return;
      }

      if (!res.ok) {
        throw new Error(`Export failed with status ${res.status}`);
      }

      // Trigger browser download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dineiq_${datasetKey}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setExportStatus({
        success: true,
        msg: `Successfully exported ${datasetKey} as ${format.toUpperCase()}!`
      });
    } catch (err) {
      setExportStatus({ error: true, msg: err.message });
    }
  };

  const canExport = ['admin', 'analyst', 'executive'].includes(userRole);

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
        maxWidth: '960px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        background: '#0f172a',
        borderColor: '#475569'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              Reports &amp; Data Export Center
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              SRS Step 49 (12 Downloadable Analytical Reports) &amp; Step 50 (Role-Based CSV/Excel Data Export).
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('reports')}
            style={{
              padding: '10px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'reports' ? '2px solid #38bdf8' : '2px solid transparent',
              color: activeTab === 'reports' ? '#38bdf8' : '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={16} />
            <span>Downloadable Reports (Step 49 - 12 Topics)</span>
          </button>

          <button
            onClick={() => setActiveTab('exports')}
            style={{
              padding: '10px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'exports' ? '2px solid #38bdf8' : '2px solid transparent',
              color: activeTab === 'exports' ? '#38bdf8' : '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileSpreadsheet size={16} />
            <span>Data Export &amp; Permissions (Step 50)</span>
          </button>
        </div>

        {/* Tab 1: Downloadable Reports (Step 49) */}
        {activeTab === 'reports' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {reports.map((rep) => (
                <div key={rep.report_key} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                        {rep.category}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{rep.file_size_kb} KB</span>
                    </div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                      {rep.title}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.3, marginBottom: '12px' }}>
                      {rep.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownloadReport(rep.report_key)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid #475569',
                      color: '#f8fafc',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Download size={14} />
                    <span>Download Report (Markdown)</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Data Export with Permissions (Step 50) */}
        {activeTab === 'exports' && (
          <div>
            {/* Role Simulation Selector */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '14px 18px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={15} color="#38bdf8" />
                  Simulate User Role (RBAC Permissions):
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Step 50 rule: 'Users with suitable permissions should be able to export results'.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {['analyst', 'admin', 'executive', 'viewer'].map(role => (
                  <button
                    key={role}
                    onClick={() => setUserRole(role)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      background: userRole === role ? (role === 'viewer' ? '#f43f5e' : '#0284c7') : '#334155',
                      color: '#ffffff'
                    }}
                  >
                    {role.toUpperCase()} {role === 'viewer' ? '(No Perms)' : '(Authorized)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Permission Alert */}
            {!canExport && (
              <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#fb7185', fontSize: '0.85rem' }}>
                <ShieldAlert size={20} />
                <span>
                  <strong>Access Restricted:</strong> Current role '<code>{userRole}</code>' lacks data export privileges. Attempting export will result in HTTP 403 Forbidden.
                </span>
              </div>
            )}

            {/* Status notification */}
            {exportStatus && (
              <div style={{
                background: exportStatus.error ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                border: `1px solid ${exportStatus.error ? '#f43f5e' : '#10b981'}`,
                borderRadius: '8px',
                padding: '10px 16px',
                marginBottom: '16px',
                fontSize: '0.85rem',
                color: exportStatus.error ? '#fb7185' : '#34d399'
              }}>
                {exportStatus.msg}
              </div>
            )}

            {/* Datasets Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="anom-table">
                <thead>
                  <tr>
                    <th>Analytical Dataset</th>
                    <th>Records Available</th>
                    <th>Required Permission</th>
                    <th>Export Formats (Step 50)</th>
                  </tr>
                </thead>
                <tbody>
                  {datasets.map((d) => (
                    <tr key={d.dataset_key}>
                      <td style={{ fontWeight: 600 }}>{d.name}</td>
                      <td>{d.record_count.toLocaleString()} rows</td>
                      <td>
                        <span className="kpi-badge badge-indigo">
                          can_export_data
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleExportData(d.dataset_key, 'csv')}
                            style={{
                              background: '#1e293b',
                              border: '1px solid #475569',
                              color: '#38bdf8',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Download size={12} />
                            CSV
                          </button>

                          <button
                            onClick={() => handleExportData(d.dataset_key, 'excel')}
                            style={{
                              background: '#1e293b',
                              border: '1px solid #475569',
                              color: '#34d399',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <FileSpreadsheet size={12} />
                            Excel (.xlsx)
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
