import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import { MdAccountCircle, MdSpaceDashboard } from "react-icons/md";
import logo from "../assets/react.png";
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import useAuth from '../hooks/useAuth';

const Header = () => {
  const { isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsUserLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const signUserOut = async () => {
    try {
      await signOut(auth);
      console.log('Signed Out');
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        const response = await fetch(`https://coinranking1.p.rapidapi.com/search-suggestions?query=${searchTerm}`, {
          method: 'GET',
          headers: {
            'x-rapidapi-key': '21c78fe1b5msh3cc9f4949cc2f42p118a2bjsn636663894f1f',
            'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
          }
        });
        const data = await response.json();
        if (data.data.coins && data.data.coins.length > 0) {
          navigate(`/token/${data.data.coins[0].uuid}`);
          setIsMenuOpen(false);
        } else {
          alert('No tokens found matching your search.');
        }
      } catch (error) {
        console.error('Error searching for tokens:', error);
        alert('An error occurred while searching. Please try again.');
      }
    }
  };

  return (
    <header className="bg-white text-gray-800 dark:bg-gray-900 dark:text-white shadow-lg transition-colors duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-bold">
            <img className="w-12 h-12" src={logo} alt="Logo" />
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/tokens">Tokens</NavLink>
            <NavLink to="/convert">Convert</NavLink>
            <NavLink to="/blogs">Blogs</NavLink>
            <NavLink to="/help">Help</NavLink>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
            <UserActions isUserLoggedIn={isUserLoggedIn} signUserOut={signUserOut} />
            <DarkModeToggle />
          </div>
          <button className="md:hidden text-2xl" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      <MobileMenu searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} isOpen={isMenuOpen} toggleMenu={toggleMenu} isUserLoggedIn={isUserLoggedIn} signUserOut={signUserOut} />
    </header>
  );
};

const NavLink = ({ to, children }) => (
  <Link to={to} className="hover:text-[#FF900D] font-semibold transition duration-300 dark:hover:text-orange-300">
    {children}
  </Link>
);

const SearchBar = ({ searchTerm, setSearchTerm, handleSearch }) => (
  <form onSubmit={handleSearch} className="relative">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search tokens..."
      className="w-64 py-2 px-4 pr-10 rounded-full bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF900D] dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-orange-300 transition duration-300"
    />
    <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FF900D] dark:text-orange-300">
      <FaSearch />
    </button>
  </form>
);

const UserActions = ({ isUserLoggedIn, signUserOut }) => (
  <div className="flex items-center space-x-4">
    {isUserLoggedIn && (
      <div className='md:flex hidden'>
        <Link to="/account" className="text-[#FF900D] text-2xl dark:text-orange-300">
          <MdAccountCircle />
        </Link>
        <Link to="/dashboard" className="text-[#FF900D] text-2xl dark:text-orange-300">
          <MdSpaceDashboard />
        </Link>
      </div>
    )}
    {!isUserLoggedIn ? (
      <Link to="/signin" className="bg-white text-[#FF900D] py-2 px-4 rounded-full font-semibold hover:bg-orange-600 hover:text-white dark:bg-gray-800 dark:text-orange-300 dark:hover:bg-orange-600 dark:hover:text-white transition duration-300">
        Sign In
      </Link>
    ) : (
      <button onClick={signUserOut} className="bg-red-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-800 transition duration-300">
        Logout
      </button>
    )}
  </div>
);

const DarkModeToggle = () => (
  <button
    onClick={() => document.documentElement.classList.toggle('dark')}
    className="text-xl focus:outline-none text-gray-600 dark:text-yellow-400 hover:text-[#FF900D] dark:hover:text-orange-300 transition duration-300"
  >
    {document.documentElement.classList.contains('dark') ? <FaSun /> : <FaMoon />}
  </button>
);

const MobileMenu = ({ isOpen, toggleMenu, isUserLoggedIn, signUserOut, searchTerm, handleSearch, setSearchTerm }) => (
  <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} transition-all duration-300 dark:bg-gray-800 bg-orange-100`}>
    <div className="container mx-auto px-4 py-4 flex flex-col space-y-4 ">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
      <NavLink to="/tokens" onClick={toggleMenu}>Tokens</NavLink>
      <NavLink to="/convert" onClick={toggleMenu}>Convert</NavLink>
      <NavLink to="/blogs" onClick={toggleMenu}>Blogs</NavLink>
      <NavLink to="/help" onClick={toggleMenu}>Help</NavLink>
      {isUserLoggedIn && (
        <>
          <NavLink to="/account" onClick={toggleMenu}>Profile</NavLink>
          <NavLink to="/dashboard" onClick={toggleMenu}>Dashboard</NavLink>
        </>
      )}
      <UserActions isUserLoggedIn={isUserLoggedIn} signUserOut={signUserOut} />
      <DarkModeToggle />
    </div>
  </div>
);

export default Header;
