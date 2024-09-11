import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Overview from './Overview';
import BlogManagement from './BlogManagement ';
import NoticeManagement from './NoticeManagement ';
import UserManagement from './UserManagement';
import Sidebar from "../../components/Sidebar";
import OrderManagement from './OrderManagement ';
import PriceListManagement from './PriceListManagement ';
import useAuth from '../../hooks/useAuth';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAdmin, loading } = useAuth();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm lg:hidden dark:bg-gray-800">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <button
                onClick={toggleSidebar}
                className="text-gray-500 dark:text-gray-400 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto md:px-6 md:py-8 py-3">
              <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Admin Dashboard</h1>
              <Routes>
                {isAdmin ? 
                  <>
                    <Route path="/blogs" element={<BlogManagement />} />
                    <Route path="/notices" element={<NoticeManagement />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/price-list" element={<PriceListManagement />} />
                  </> : null
                }
                <Route path="/" element={<Overview />} />
                <Route path="/orders" index element={<OrderManagement />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
