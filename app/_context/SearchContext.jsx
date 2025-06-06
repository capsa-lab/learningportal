// _context/SearchContext.js
import { createContext, useContext, useState } from 'react';

// Create the SearchContext
export const SearchContext = createContext();

// Provider component for SearchContext
export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook for convenience, optional
export const useSearch = () => useContext(SearchContext);
