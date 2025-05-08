import React, { useEffect, useState } from 'react';
import Layout from '../layouts/Layout';
import Welcome from '../components/dashboard/welcome';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/Authslice';
import Dashboard from '../components/dashboard/Dashboard';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);
  const [sidebarVisible, setSidebarVisible] = useState(true); // State untuk mengontrol visibilitas sidebar

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate('/');
    }
  }, [isError, navigate]);

  // Fungsi untuk toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className={`layout ${sidebarVisible ? 'sidebar-visible' : ''}`}>
      <Layout toggleSidebar={toggleSidebar}>
        <Welcome>
          <div className={`w-full flex-1 h-[calc(100vh-100px)] bg-white rounded-2xl overflow-auto`}>
            <Dashboard />
          </div>
        </Welcome>
      </Layout>
    </div>
  );
};

export default DashboardPage;
