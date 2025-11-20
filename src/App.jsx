import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BriefingProvider } from './contexts/BriefingContext';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { BriefingForm } from './components/briefing/BriefingForm/BriefingForm';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import Protocolo from './pages/Protocolo';
import { Users } from './pages/Admin/Users';

// Componente para proteger rotas que requerem autenticação
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <BriefingProvider>
                <BriefingForm />
              </BriefingProvider>
            }
          />
          <Route path="/admin" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route path="/protocolo/:numero" element={<Protocolo />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
