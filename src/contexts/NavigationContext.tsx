'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  showBottomNav: boolean;
  setShowBottomNav: (show: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [showBottomNav, setShowBottomNav] = useState(true);

  return (
    <NavigationContext.Provider value={{ showBottomNav, setShowBottomNav }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
