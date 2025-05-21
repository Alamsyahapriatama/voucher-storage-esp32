import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import AuthGuard from './components/Layout/AuthGuard';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ScanPage from './pages/ScanPage';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      }>
        <Route index element={<Dashboard />} />
        <Route path="scan" element={<ScanPage />} />
      </Route>
      
      {/* Redirect for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;