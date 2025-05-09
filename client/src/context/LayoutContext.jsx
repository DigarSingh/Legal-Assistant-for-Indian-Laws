import React, { createContext, useContext, useState } from 'react';

const LayoutContext = createContext();

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider = ({ children }) => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);

  const hideSidebar = () => setShowLeftSidebar(false);
  const showSidebar = () => setShowLeftSidebar(true);

  return (
    <LayoutContext.Provider value={{ showLeftSidebar, hideSidebar, showSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
};
