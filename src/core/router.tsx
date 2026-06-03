import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignIn } from '../features/common/pages/SignIn';
import { Onboarding } from '../features/common/pages/Onboarding';
import { CommanderApp } from '../features/commander/CommanderApp';
import { AlertsApp } from '../features/base-ops/AlertsApp';
import { useDeviceType } from './hooks/useDeviceType';

const RootRouter: React.FC = () => {
  const deviceType = useDeviceType();

  return (
    <Routes>
      {/* Shared Routes */}
      <Route path="/login" element={<SignIn />} />
      <Route path="/onboarding" element={<Onboarding />} />
      
      {/* Device-specific Root Route */}
      <Route 
        path="/" 
        element={
          deviceType === 'commander' 
            ? <CommanderApp /> 
            : <AlertsApp />
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
