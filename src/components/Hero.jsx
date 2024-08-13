import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaExchangeAlt, FaShieldAlt, FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiDogecoin } from 'react-icons/si';
import { SiSolana } from "react-icons/si";
import { SiBnbchain } from "react-icons/si";

import heroimg from "../assets/jhayhero.png"
import axios from 'axios';

const featuredTokens = [
  { id: 1, name: 'Bitcoin', symbol: 'BTC', price: '$45,000', change: '+5.2%' },
  { id: 2, name: 'Ethereum', symbol: 'ETH', price: '$3,200', change: '+3.8%' },
  { id: 3, name: 'Cardano', symbol: 'ADA', price: '$2.10', change: '+1.5%' },
];

const Hero = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);
  // const rapidApiKey = process.env.REACT_APP_RAPID_API_KEY;
  const rapidApiKey = import.meta.env.VITE_RAPID_API_KEY;


  const fetchTokens = async () => {
    setLoading(true);
    try {
      const options = {
        method: 'GET',
        url: 'https://coinranking1.p.rapidapi.com/coins',
        params: {
          referenceCurrencyUuid: 'yhjMzLPhuIDl',
          timePeriod: '24h',
          orderDirection: 'desc',
          limit: '3',
          offset: '0'
        },
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      setTokens(response.data.data.coins);
      // console.log(response.data.data)
      setLoading(false);
    } catch (error) {
      // console.error(error);
      setError('Failed to fetch tokens. Please try again later.');
      setLoading(false);
    }
  };
  

  return (
    <div>
      {/* Hero Sectionn */}
      <section className="bg-gradient-to-r from-[#FF900D] to-[#FFA940] text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Hero Text */}
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Trade Tokens with Confidence
              </h1>
              <p className="text-xl mb-8">
                Secure, efficient, and user-friendly P2P trading platform for the modern crypto enthusiast.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/signin"
                  className="bg-white text-[#FF900D] py-3 px-8 rounded-full font-semibold hover:bg-blue-100 transition duration-300 shadow-lg text-center"
                >
                  Get Started
                </Link>
                <Link
                  to="/tokens"
                  className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-full font-semibold hover:bg-white hover:text-[#FF900D] transition duration-300 text-center"
                >
                  Explore Tokens
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="w-full max-w-[300px] lg:max-w-none lg:w-1/2 relative">
              <div className="relative z-10">
                <img
                  src={heroimg}
                  alt="P2P Trading Platform"
                  className="rounded-lg shadow-2xl w-full h-auto "
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 -mt-6 -ml-6 text-[white] animate-bounce">
                <FaBitcoin size={48} />
              </div>
              <div className="absolute bottom-0 right-24 -mb-6 -mr-6 text-blue-400 animate-ping">
                <FaEthereum size={48} />
              </div>
              <div className="absolute  top-24 left-0 md:left-1/2 -mb-6 -mr-6 text-white animate-ping">
                <SiSolana size={32} />
              </div>
              <div className="absolute top-1/2 right-12 transform translate-x-1/2 -translate-y-1/2 text-yellow-400 animate-spin-slow">
                <SiDogecoin size={36} />
              </div>
              <div className="absolute bottom-24 left-12 transform translate-x-1/2 -translate-y-1/2 text-yellow-400 animate-spin-slow">
                <SiBnbchain size={36} />
              </div>

              {/* Blob Shape */}
              <div className="absolute inset-0 -m-8 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tokens */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Tokens</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tokens.map((token) => {
              const priceChange = parseFloat(token.change);
              const priceDirection = priceChange >= 0 ? 'up' : 'down';

              return (
                <div key={token.uuid} className="bg-white rounded-lg shadow-lg p-6 transition duration-300 hover:shadow-xl">
                  <h3 className="text-xl font-semibold mb-2">{token.name} ({token.symbol})</h3>
                  <p className="text-2xl text-[#FF900D] font-bold">$ {parseFloat(token.price).toFixed(3)}</p>
                  <p
                    className={`text-lg ${
                      priceDirection === 'up' ? 'text-green-500' : 'text-red-500'
                    } flex items-center`}
                  >
                    {priceDirection === 'up' ? (
                      <FaArrowUp className="mr-1" />
                    ) : (
                      <FaArrowDown className="mr-1" />
                    )}
                    {Math.abs(priceChange)}% ({priceDirection})
                  </p>
                  <Link to={`/token/${token.uuid}`} className="mt-4 inline-block text-[#FF900D] hover:underline">
                    View Details
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FaExchangeAlt className="text-5xl text-[#FF900D] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Trading</h3>
              <p className="text-gray-600">Intuitive interface for seamless token exchanges.</p>
            </div>
            <div className="text-center">
              <FaShieldAlt className="text-5xl text-[#FF900D] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
              <p className="text-gray-600">Advanced security measures to protect your assets.</p>
            </div>
            <div className="text-center">
              <FaChartLine className="text-5xl text-[#FF900D] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-gray-600">Up-to-date market data and trading insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-16 bg-gradient-to-r from-[#FF900D] to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Start Trading?</h2>
          <Link to="/signup" className="bg-white text-[#FF900D] py-3 px-8 rounded-full font-semibold hover:bg-blue-100 transition duration-300 shadow-lg">
            Create Your Account
          </Link>
        </div>
      </section> */}
    </div>
  );
};

export default Hero;