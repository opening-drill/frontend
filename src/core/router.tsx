import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { SignIn } from '../features/common/pages/SignIn';
import { Onboarding } from '../features/common/pages/Onboarding';
import { CommanderApp } from '../features/commander/CommanderApp';
import { BaseOpsApp } from '../features/base-ops/BaseOpsApp';
import { useDeviceType } from './hooks/useDeviceType';
import { isAuthenticatedAtom } from './store/authAtom';

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
  const deviceType = useDeviceType();

  return (
    <Routes>
      {/* Public/Unauthenticated routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <SignIn />
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
            {deviceType === 'commander' ? <CommanderApp /> : <BaseOpsApp />}
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

