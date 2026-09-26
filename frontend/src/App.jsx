import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import UpcomingPlaceholder from './components/UpcomingPlaceholder';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Application Routes wrapped in AppLayout shell */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Core Dashboards accessible to all 4 roles */}
            <Route index element={<ExecutiveDashboard />} />
            <Route path="menu" element={<MenuIntelligenceDashboard />} />
            <Route path="customer" element={<CustomerIntelligenceDashboard />} />
            <Route path="wastage" element={<WastageDashboard />} />

            {/* System Operations & Spark: Admin Only (FR lxi-lxvi) */}
            <Route
              path="system"
              element={
                <RoleGuard allowedRoles={['admin']}>
                  <SystemOperationsDashboard />
                </RoleGuard>
              }
            />

            {/* Demand Forecasting: Analyst, Regional Manager, Admin (Step 46 & FR-xxviii) */}
            <Route
              path="forecast"
              element={
                <RoleGuard allowedRoles={['analyst', 'regional_manager', 'admin']}>
                  <UpcomingPlaceholder
                    title="Demand Forecasting & Daypart Analytics"
                    step="Step 46 & FR-xxviii/xxix"
                    phase="Phase FIX-4"
                    description="Hierarchical 7-day dish demand forecasting and hourly daypart distribution models. Activates in Phase FIX-4."
                  />
                </RoleGuard>
              }
            />

            {/* Dual-Pipeline Comparison: Analyst & Admin (Step 47 & FR-xliv) */}
            <Route
              path="comparison"
              element={
                <RoleGuard allowedRoles={['analyst', 'admin']}>
                  <UpcomingPlaceholder
                    title="Dual-Pipeline ML Comparison Dashboard"
                    step="Step 47 & FR-xliv/xlv"
                    phase="Phase FIX-8"
                    description="Side-by-side PySpark MLlib vs Scikit-Learn evaluation, classification parity, and latency metrics. Activates in Phase FIX-8."
                  />
                </RoleGuard>
              }
            />

            {/* 403 Forbidden Screen */}
            <Route path="unauthorized" element={<UnauthorizedPage />} />

            {/* Catch-all redirect to Executive Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
