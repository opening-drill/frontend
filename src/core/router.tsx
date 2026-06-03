import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LogIn } from '../features/common/pages/LogIn';
import { Onboarding } from '../features/common/pages/Onboarding';
import { CommanderApp } from '../features/commander/CommanderApp';
import { BaseOpsApp } from '../features/base-ops/BaseOpsApp';
import { useDeviceType } from './hooks/useDeviceType';

const RootRouter: React.FC = () => {
  const deviceType = useDeviceType();

  return (
    <Routes>
      {/* Shared Routes */}
      <Route path="/login" element={<LogIn />} />
      <Route path="/onboarding" element={<Onboarding />} />
      
      {/* Device-specific Root Route */}
      <Route 
        path="/" 
        element={
          deviceType === 'commander' 
            ? <CommanderApp /> 
            : <BaseOpsApp />
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
