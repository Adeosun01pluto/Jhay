import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaWhatsapp, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import CurrencyConverter from '../components/CurrencyConverter';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TokenDetailsPage = () => {
  const { id } = useParams();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTokenDetails();
  }, [id]);
  const rapidApiKey = import.meta.env.VITE_RAPID_API_KEY;


  const fetchTokenDetails = async () => {
    setLoading(true);
    try {
      const options = {
        method: 'GET',
        url: `https://coinranking1.p.rapidapi.com/coin/${id}`,
        params: { referenceCurrencyUuid: 'yhjMzLPhuIDl', timePeriod: '24h' },
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      setToken(response.data.data.coin);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch token details. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!token) return <div className="text-center py-10">No token data available.</div>;

  const chartData = {
    labels: token.sparkline.map((_, index) => `${24 - index}h ago`),
    datasets: [
      {
        label: 'Price (USD)',
        data: token.sparkline.reverse(),
        fill: false,
        borderColor: token.color || 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '24 Hour Price History'
      }
    }
  };

  const priceChange = parseFloat(token.change);
  const priceDirection = priceChange >= 0 ? 'up' : 'down';

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <img src={token.iconUrl} alt={token.name} className="w-16 h-16 mr-4" />
              <div>
                <h1 className="text-3xl font-bold">{token.name} ({token.symbol})</h1>
                <p className="text-gray-600">Rank: #{token.rank}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Price Information</h2>
                <p className="text-3xl font-bold text-[#FF900D]">${parseFloat(token.price).toFixed(2)} USD</p>
                <p className={`text-lg ${priceDirection === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  {priceDirection === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                  {Math.abs(priceChange)}% ({priceDirection})
                </p>
                <p className="text-gray-600">BTC Price: {parseFloat(token.btcPrice).toFixed(8)} BTC</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">Market Information</h2>
                <p className="text-gray-600">Market Cap: ${parseInt(token.marketCap).toLocaleString()}</p>
                <p className="text-gray-600">24h Volume: ${parseInt(token['24hVolume']).toLocaleString()}</p>
                <p className="text-gray-600">Listed: {new Date(token.listedAt * 1000).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Price Chart</h2>
              <div className="h-64 md:h-96">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Token Overview</h2>
              <p className="text-gray-700">{token.description}</p>
            </div>

            <div className="bg-white rounded-lg overflow-hidden mb-8">
                <div className="p-6">
                    <CurrencyConverter initialCoin={token} />
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
              {/* <div className="w-full md:w-auto">
                <button className="w-full md:w-auto bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition duration-300">
                  Buy {token.symbol}
                </button>
              </div> */}
              {/* <div className="w-full md:w-auto">
                <button className="w-full md:w-auto bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition duration-300">
                  Sell {token.symbol}
                </button>
              </div> */}
              <div className="w-full md:w-auto">
                <a
                  href={`https://wa.me/send?text=I'm interested in buying ${token.name} (${token.symbol}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto inline-flex items-center justify-center bg-[#FF900D] text-white px-6 py-3 rounded-full font-semibold hover:bg-green-500 transition duration-300"
                >
                  <FaWhatsapp className="mr-2" /> Buy/Sell {token.symbol} Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetailsPage;