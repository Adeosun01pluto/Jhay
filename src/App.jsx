// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import TokenListingsPage from './pages/TokenListingsPage';
import TokenDetailsPage from './pages/TokenDetailsPage ';
import Converter from './pages/Converter';
import AuthPage from './pages/AuthPage';
import HelpSupport from './components/HelpSupport';
// #FF900D

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/help" element={<HelpSupport />} />
            <Route path="/tokens" element={<TokenListingsPage />} />
            <Route path="/token/:id" element={<TokenDetailsPage />} />
            <Route path="/convert" element={<Converter />} />
            <Route path="/signup" element={<AuthPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;