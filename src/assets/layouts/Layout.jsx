import React from 'react';
import Sidebar from '../components/appbar/Sidebar'

function Layout({ children }) {
  return (
    <React.Fragment>
      <div className="flex bg-gray-50">
        <Sidebar />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </React.Fragment>
  )
}

export default Layout;
