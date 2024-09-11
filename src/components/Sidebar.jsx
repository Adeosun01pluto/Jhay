import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaHome, FaFileAlt, FaBell, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase'; // Adjust the import path as needed
import useAuth from '../hooks/useAuth';
import { ThreeDots } from 'react-loader-spinner';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toggleSidebar();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };
  if (loading) return <div className="text-center w-[100%] flex items-center justify-center">
  <ThreeDots
    visible={true}
    height="100"
    width="100"
    color="#FF900D"
    ariaLabel="three-circles-loading"
    wrapperStyle={{}}
    wrapperClass=""
    />
  </div>;
  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-white text-[#FF900D] dark:bg-gray-800 dark:text-gray-300 transition duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between p-6">
        <h2 className="text-lg md:text-2xl font-bold">{isAdmin ? "Admin Panel" : "Panel" }</h2>
        <button onClick={toggleSidebar} className="lg:hidden">
          <FaTimes size={24} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      <nav className="md:mt-2">
        {
          isAdmin  ? 
          <>
            <Link to="" className="flex items-center py-2 px-6 hover:bg-[#FF900D] hover:text-white dark:hover:bg-[#FF900D] dark:hover:text-white" onClick={toggleSidebar}>
              <FaHome className="mr-3" />
              Overview
            </Link>
            <Link to="blogs" className="flex items-center py-2 px-6 hover:bg-[#FF900D] hover:text-white dark:hover:bg-[#FF900D] dark:hover:text-white" onClick={toggleSidebar}>
              <FaFileAlt className="mr-3" />
              Blogs
            </Link>
            <Link to="price-list" className="flex items-center py-2 px-6 hover:bg-[#FF900D] hover:text-white dark:hover:bg-[#FF900D] dark:hover:text-white" onClick={toggleSidebar}>
              <FaFileAlt className="mr-3" />
              Price List
            </Link>
            <Link to="notices" className="flex items-center py-2 px-6 hover:bg-[#FF900D] hover:text-white dark:hover:bg-[#FF900D] dark:hover:text-white" onClick={toggleSidebar}>
              <FaBell className="mr-3" />
              Notices
            </Link>
            <Link to="users" className="flex items-center py-2 px-6 hover:bg-[#FF900D] hover:text-white dark:hover:bg-[#FF900D] dark:hover:text-white" onClick={toggleSidebar}>
              <FaUsers className="mr-3" />
              Users
            </Link>
          </> : null
        }
        <Link to="orders" className="flex items-center py-2 px-6 hover:bg-[#FF900D] hover:text-white dark:hover:bg-[#FF900D] dark:hover:text-white" onClick={toggleSidebar}>
          <FaBell className="mr-3" />
          Orders
        </Link>
        <button onClick={handleLogout} className="flex items-center py-2 px-6 hover:bg-[#FF900D] hover:text-white dark:hover:bg-[#FF900D] dark:hover:text-white w-full text-left">
          <FaSignOutAlt className="mr-3" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
