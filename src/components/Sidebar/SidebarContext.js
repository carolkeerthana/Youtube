// SidebarContext.js
import React, { createContext, useState } from "react";

const SidebarContext = createContext();

const SidebarProvider = ({ children }) => {
  const [sidebar, setSidebar] = useState(true);

  const toggleSidebar = () => {
    setSidebar((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ sidebar, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export { SidebarContext, SidebarProvider };
