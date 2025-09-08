// contexts/AlertContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useCustomAlert, UseCustomAlertReturn } from '@/components/CustomAlert';

interface AlertContextType extends UseCustomAlertReturn {}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps { children: ReactNode }

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const alertMethods = useCustomAlert();

  return (
    <AlertContext.Provider value={alertMethods}>
      {children}
      <alertMethods.AlertComponent />
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
