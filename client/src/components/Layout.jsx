import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-brand-lightest/30 overflow-hidden">
      {/* Sidebar with mobile state */}
      <Sidebar isOpen={isSidebarOpen} close={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Mobile Overlay for Sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
