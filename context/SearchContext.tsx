import React, { createContext, useCallback, useContext, useState } from 'react';

interface SearchContextType {
  onSearchTrigger: (callback: () => void) => void;
  navigateToHomeAndSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchCallback, setSearchCallback] = useState<(() => void) | null>(null);

  const onSearchTrigger = useCallback((callback: () => void) => {
    setSearchCallback(() => callback);
  }, []);

  const navigateToHomeAndSearch = useCallback(() => {
    if (searchCallback) {
      searchCallback();
    }
  }, [searchCallback]);

  return (
    <SearchContext.Provider value={{ onSearchTrigger, navigateToHomeAndSearch }}>
      {children}
    </SearchContext.Provider>
  );
};
