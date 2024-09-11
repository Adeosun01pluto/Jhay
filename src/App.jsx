// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HelpSupport from './components/HelpSupport';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/HomePage/Home';
import TokenListingsPage from './pages/Token/TokenListingsPage';
import TokenDetailsPage from './pages/Token/TokenDetailsPage ';
import Converter from './pages/Converter/Converter';
import AuthPage from './pages/Auth/AuthPage';
import AccountPage from './pages/Account/AccountPage';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import Blogs from './pages/Blogs/Blogs';
import useAuth from './hooks/useAuth';
import BlogPost from './pages/Blogs/BlogPost';
import { ThreeCircles } from 'react-loader-spinner';

// &#8358 naira 


const App = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className='w-100% h-[100vh] flex-col justify-center items-center flex'>
      <ThreeCircles
        visible={true}
        height="100"
        width="100"
        color="#FF900D"
        ariaLabel="three-circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />
        <h2 className='text-[#FF900D] text-2xl font-semibold'>Jhay Exchange</h2>
    </div>; // Show a loading indicator while checking auth status
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header/>
        <main className="flex-grow bg-white dark:bg-gray-800">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/help" element={<HelpSupport />} />
            <Route path="/tokens" element={<TokenListingsPage />} />
            <Route path="/token/:id" element={<TokenDetailsPage />} />
            <Route path="/convert" element={<Converter />} />
            <Route
              path="/account"
              element={user ? <AccountPage /> : <Navigate to="/signin" />}
            />
            <Route path="/signin" element={<AuthPage />} />
            <Route
              path="/dashboard/*"
              element={user ? <AdminDashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/blogs"
              element={user ? <Blogs /> : <Navigate to="/signin" />}
            />
            <Route
              path="/blog/:id"
              element={user ? <BlogPost /> : <Navigate to="/signin" />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
