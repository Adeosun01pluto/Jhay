import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import logo from "../assets/react.png"


const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="text-lg text-[#FF900D] font-bold">
              Jhay's Exchange 
            </Link>
            <p className="text-gray-400">Trade tokens securely and efficiently on our platform.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-[#FF900D]/50 transition">About Us</Link></li>
              <li><Link to="/tokens" className="hover:text-[#FF900D]/50 transition">Token Listings</Link></li>
              <li><Link to="/help" className="hover:text-[#FF900D]/50 transition">Help & Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-[#FF900D]/50 transition"><FaTwitter /></a>
              <a href="#" className="text-2xl hover:text-[#FF900D]/50 transition"><FaFacebook /></a>
              <a href="#" className="text-2xl hover:text-[#FF900D]/50 transition"><FaLinkedin /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2024 P2P Trading. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
