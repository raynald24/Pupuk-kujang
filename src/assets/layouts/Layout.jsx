import React from 'react';
import Sidebar from '../components/appbar/Sidebar';

function Layout({ children }) {
  return (
    <React.Fragment>
      <div className="flex bg-gray-50 h-screen">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Layout;
