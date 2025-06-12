import React from 'react';
import Sidebar from '../components/appbar/Sidebar';

function Layout({ children }) {
  return (
    <React.Fragment>
      <div className="flex bg-gray-50 h-screen">
        <Sidebar /> {/* Sidebar tetap muncul di depan */}
        <div className="flex-1 overflow-y-auto relative bg-gray-200"> {/* Konten utama */}
          {children} {/* Konten yang akan dimuat */}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Layout;
