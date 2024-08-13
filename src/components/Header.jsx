import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import logo from "../assets/react.png";
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { MdAccountCircle } from "react-icons/md";
import { MdSpaceDashboard } from "react-icons/md";
import useAuth from '../hooks/useAuth';



const Header = () => {
  const {  isAdmin } = useAuth();
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
  const toggleMenu = () => {
    setIsMenuOpen(false)
    console.log("is Open menu " ,isMenuOpen)
  };

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
          setIsMenuOpen(false)
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
    <header className="bg-white text-white shadow-lg">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-bold">
            <img className="w-16 h-16" src={logo} alt="Logo" />
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/tokens" className="hover:text-[#FF900D] text-[#FF900D] font-semibold transition">Tokens</Link>
            <Link to="/convert" className="hover:text-[#FF900D] text-[#FF900D] font-semibold transition">Convert</Link>
            <Link to="/blogs" className="hover:text-[#FF900D] text-[#FF900D] font-semibold transition">Blogs</Link>
            <Link to="/help" className="hover:text-[#FF900D] text-[#FF900D] font-semibold transition">Help</Link>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tokens..."
                className="w-full py-2 px-4 pr-10 rounded-full bg-[#FF900D] text-white placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-[#FF900D]/50"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#fff]">
                <FaSearch />
              </button>
            </form>
            {
              isUserLoggedIn ? 
                <div className=''>
                  <Link to="/account" className='text-[#FF900D] text-3xl font-semibold '>
                    <MdAccountCircle />
                  </Link>
                </div> : null
            }
            {
              isAdmin ? 
              <Link to="/dashboard" className='text-[#FF900D] text-3xl font-semibold '>
                <MdSpaceDashboard />
              </Link> : null
            }
            {!isUserLoggedIn ? (
              <Link to="/signin" className="bg-white text-[#FF900D] py-2 px-4 rounded-full font-semibold hover:bg-[#FF900D]/30 transition">Sign In</Link>
            ) : (
              <button onClick={signUserOut} className="bg-white text-[#FF900D] py-2 px-4 rounded-full font-semibold hover:bg-[#FF900D]/30 transition">Logout</button>
            )}
          </div>
          <button className="md:hidden text-2xl text-[#FF900D]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-[#FF900D] py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tokens..."
                className="w-full py-2 px-4 pr-10 rounded-full bg-[#fff] text-[#FF900D] placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-[#FF900D]/50"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FF900D]">
                <FaSearch />
              </button>
            </form>
            <Link onClick={()=>toggleMenu()} to="/tokens" className="hover:text-[#fff] text-[#ff] font-semibold transition">Tokens</Link>
            <Link onClick={()=>toggleMenu()} to="/convert" className="hover:text-[#ff] text-[#ff] font-semibold transition">Convert</Link>
            <Link onClick={()=>toggleMenu()} to="/blogs" className="hover:text-[#ff] text-[#ff] font-semibold transition">Blogs</Link>
            <Link onClick={()=>toggleMenu()} to="/help" className="hover:text-[#ff] text-[#ff] font-semibold transition">Help</Link>
            {
              isUserLoggedIn ? 
                <Link onClick={()=>toggleMenu()} to="/account" className="hover:text-[#ff] text-[#ff] font-semibold transition">
                  Account
                </Link>
                : null
            }
            {
              isAdmin ? 
              <Link onClick={()=>toggleMenu()} to="/dashboard" className="hover:text-[#ff] text-[#ff] font-semibold transition">Dashboard</Link>
               : null
            }
            
            {!isUserLoggedIn ? (
              <Link onClick={()=>toggleMenu()} to="/signin" className="bg-white text-[#FF900D] py-2 px-4 rounded-full font-semibold transition">Sign In</Link>
            ) : (
              <div onClick={()=>toggleMenu()}>
                <button onClick={signUserOut} className="bg-white text-[#FF900D] py-2 px-4 rounded-full font-semibold transition">Logout</button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
