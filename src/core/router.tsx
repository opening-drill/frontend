import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { LogIn } from '../features/common/pages/LogIn';
import { Onboarding } from '../features/common/pages/Onboarding';
import { CommanderApp } from '../features/commander/CommanderApp';

import { isAuthenticatedAtom, userAtom } from './store/authAtom';
import { AlertsApp } from '../features/alerts/AlertsApp';

// Guard for authenticated-only routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Guard for unauthenticated-only routes (like Login)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

const RootRouter: React.FC = () => {
  const user = useAtomValue(userAtom);
  const role = user?.role;

  return (
    <Routes>
      {/* Public/Unauthenticated routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LogIn />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            {role === '1' ? <CommanderApp /> : <AlertsApp />}
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <RootRouter />
    </BrowserRouter>
  );
};
