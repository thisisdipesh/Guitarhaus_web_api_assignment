import React, { useState } from "react";
import Navbar from "../../components/common/admin/Navbar";
import Sidebar from "../../components/common/admin/Sidebar";


import { Outlet } from "react-router-dom";


const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />  {/* Dynamic Nested Route Content */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
