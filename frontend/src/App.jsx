import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ExecutiveDashboard from './dashboards/ExecutiveDashboard';
import MenuIntelligenceDashboard from './dashboards/MenuIntelligenceDashboard';
import CustomerIntelligenceDashboard from './dashboards/CustomerIntelligenceDashboard';
import WastageDashboard from './dashboards/WastageDashboard';
import SystemOperationsDashboard from './dashboards/SystemOperationsDashboard';
import DataPipelineUploadPage from './pages/DataPipelineUploadPage';
import DataPipelineResultsPage from './pages/DataPipelineResultsPage';
import UpcomingPlaceholder from './components/UpcomingPlaceholder';
import ErrorBoundary from './components/ErrorBoundary';

/* Generic placeholder for sidebar links not yet fully built */
function Placeholder({ title, step }) {
  return (
    <UpcomingPlaceholder
      title={title}
      step={step}
      phase="Coming Soon"
      description={`${title} is accessible from the sidebar and will be fully implemented in the next phase.`}
    />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected — inside AppLayout shell */}
              <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                {/* ── MANAGEMENT ──────────────────────────── */}
                <Route index element={<ExecutiveDashboard />} />
                <Route path="restaurants" element={<Placeholder title="Restaurants" step="FR-xxix" />} />
                <Route path="menu" element={<MenuIntelligenceDashboard />} />
                <Route path="customer" element={<CustomerIntelligenceDashboard />} />
                <Route path="orders" element={<Placeholder title="Orders" step="FR-v" />} />
                <Route path="promotions" element={<Placeholder title="Promotions" step="FR-xxxiii" />} />
                <Route path="ratings" element={<Placeholder title="Ratings" step="FR-xiv" />} />
                <Route path="inventory" element={<Placeholder title="Inventory" step="FR-ix" />} />
                <Route path="wastage" element={<WastageDashboard />} />

                {/* ── DATA PIPELINE ────────────────────────── */}
                <Route path="data/upload" element={<DataPipelineUploadPage />} />
                <Route path="data/upload/runs/:runId/results" element={<DataPipelineResultsPage />} />

                {/* ── INTELLIGENCE ────────────────────────── */}
                <Route path="basket" element={<Placeholder title="Basket Analysis" step="FR-xxv" />} />
                <Route path="peak-periods" element={<Placeholder title="Peak Periods" step="FR-xxii" />} />
                <Route path="forecast" element={
                  <RoleGuard allowedRoles={['analyst', 'regional_manager', 'admin']}>
                    <Placeholder title="Demand Forecasting & Daypart Analytics" step="Step 46 / FR-xxviii" />
                  </RoleGuard>
                } />
                <Route path="pricing" element={<Placeholder title="Pricing & Promotions" step="FR-xxxii" />} />
                <Route path="locations" element={<Placeholder title="Locations & Channels" step="FR-xxxviii" />} />
                <Route path="anomalies" element={<Placeholder title="Anomalies & Churn" step="FR-xxxvi" />} />

                {/* ── AI & MODELS ─────────────────────────── */}
                <Route path="comparison" element={
                  <RoleGuard allowedRoles={['analyst', 'admin']}>
                    <Placeholder title="Model Performance — Spark MLlib vs Python ML" step="Step 47 / FR-xliv" />
                  </RoleGuard>
                } />

                {/* ── DECISION SUPPORT ────────────────────── */}
                <Route path="recommendations" element={<Placeholder title="Recommendations Engine" step="FR-xlvii" />} />
                <Route path="what-if" element={<Placeholder title="What-If Analysis" step="FR-li" />} />

                {/* ── SYSTEM ADMIN ────────────────────────── */}
                <Route path="system" element={
                  <RoleGuard allowedRoles={['admin']}>
                    <SystemOperationsDashboard />
                  </RoleGuard>
                } />

                {/* Misc */}
                <Route path="unauthorized" element={<UnauthorizedPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
