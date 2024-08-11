import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExchangeAlt } from 'react-icons/fa';

const CurrencyConverter = ({ initialCoin }) => {
  const [coins, setCoins] = useState([]);
  const [fromCoin, setFromCoin] = useState(initialCoin || { symbol: 'USD', price: 1 });
  const [toCoin, setToCoin] = useState(null);
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => {
    fetchCoins();
  }, []);

  useEffect(() => {
    if (fromCoin && toCoin) {
      convertCurrency();
    }
  }, [fromCoin, toCoin, amount]);

  const fetchCoins = async () => {
    try {
      const options = {
        method: 'GET',
        url: 'https://coinranking1.p.rapidapi.com/coins',
        params: {
          referenceCurrencyUuid: 'yhjMzLPhuIDl',
          limit: '50',
          offset: '0'
        },
        headers: {
          'x-rapidapi-key': '21c78fe1b5msh3cc9f4949cc2f42p118a2bjsn636663894f1f',
          'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      setCoins([{ symbol: 'USD', price: 1 }, ...response.data.data.coins]);
      if (!initialCoin) {
        setToCoin(response.data.data.coins[0]);
      }
    } catch (error) {
      console.error('Error fetching coins:', error);
    }
  };

  const convertCurrency = () => {
    if (fromCoin && toCoin) {
      const fromValueInUSD = amount * fromCoin.price;
      const toValueInNewCurrency = fromValueInUSD / toCoin.price;
      setConvertedAmount(toValueInNewCurrency);
    }
  };

  const handleSwap = () => {
    setFromCoin(toCoin);
    setToCoin(fromCoin);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Currency Converter</h2>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <select
            value={fromCoin?.symbol}
            onChange={(e) => setFromCoin(coins.find(c => c.symbol === e.target.value))}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF900D]"
          >
            {coins.map((coin) => (
              <option key={coin.symbol} value={coin.symbol}>
                {coin.symbol}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSwap}
          className="p-2 bg-[#FF900D] text-white rounded-full hover:bg-[#FF900D] transition duration-300"
        >
          <FaExchangeAlt />
        </button>
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <select
            value={toCoin?.symbol}
            onChange={(e) => setToCoin(coins.find(c => c.symbol === e.target.value))}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF900D]"
          >
            {coins.map((coin) => (
              <option key={coin.symbol} value={coin.symbol}>
                {coin.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF900D]"
        />
      </div>
      <div className="mt-4">
        <p className="text-lg font-semibold">
          {amount} {fromCoin?.symbol} = {convertedAmount.toFixed(6)} {toCoin?.symbol}
        </p>
      </div>
    </div>
  );
};

export default CurrencyConverter;