import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaSort, FaFilter } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';

const TokenListingsPage = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('marketCap');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 600000); // Refresh every minute
    return () => clearInterval(interval);
  }, [sortBy]);

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
          orderBy: sortBy,
          search: searchTerm,
          orderDirection: 'desc',
          limit: '50',
          offset: '0'
        },
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      setTokens(response.data.data.coins);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch tokens. Please try again later.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilter = (e) => {
    setFilterCategory(e.target.value);
  };

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === '' || token.category === filterCategory)
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Token Listings</h1>

        {/* Search, Sort, and Filter */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search tokens..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF900D]/50"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="flex space-x-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <select
                className="appearance-none w-full md:w-auto pl-10 pr-8 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF900D]/50"
                value={sortBy}
                onChange={handleSort}
              >
                <option value="marketCap">Market Cap</option>
                <option value="price">Price</option>
                <option value="24hVolume">24h Volume</option>
              </select>
              <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="relative w-full md:w-auto">
              <select
                className="appearance-none w-full md:w-auto pl-10 pr-8 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF900D]/50"
                value={filterCategory}
                onChange={handleFilter}
              >
                <option value="">All Categories</option>
                <option value="cryptocurrency">Cryptocurrency</option>
                <option value="defi">DeFi</option>
                <option value="nft">NFT</option>
              </select>
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>

        {/* Token Cards */}
        {loading ? (
          <div className="text-center w-[100%] flex items-center justify-center">
            <ThreeDots
              visible={true}
              height="100"
              width="100"
              color="#FF900D"
              ariaLabel="three-circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 dark:text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTokens.map(token => (
              <div key={token.uuid} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img src={token.iconUrl} alt={token.name} className="w-10 h-10 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{token.name} ({token.symbol})</h2>
                  </div>
                  <p className="text-2xl font-bold text-[#FF900D] mb-2">${parseFloat(token.price).toFixed(2)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Market Cap: ${parseInt(token.marketCap).toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">24h Volume: ${parseInt(token['24hVolume']).toLocaleString()}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{token.description}</p>
                  <Link 
                    to={`/token/${token.uuid}`}
                    className="inline-block bg-[#FF900D] text-white px-4 py-2 rounded-full hover:bg-[#FF900D]/80 transition duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenListingsPage;
