import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaWhatsapp, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import CurrencyConverter from '../Converter/CurrencyConverter';
import { ThreeDots } from 'react-loader-spinner';
import useAuth from "../../hooks/useAuth";
import { db } from '../../firebase/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TokenDetailsPage = () => {
  const { id } = useParams();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [action, setAction] = useState('buy');
  const [amount, setAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [currency, setCurrency] = useState('naira');
  const [total, setTotal] = useState(0);
  const [priceListData, setPriceListData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userWalletAddress, setUserWalletAddress] = useState("");
  const [userNetwork, setUserNetwork] = useState("");
  const [userAccountNumber, setUserAccountNumber] = useState("");
  const [userAccountNameAndBank, setUserAccountNameAndBank] = useState("");
  const navigate = useNavigate(); // Define navigate function
  useEffect(() => {
    fetchTokenDetails();
    fetchPriceListData();
  }, [id]);

  useEffect(() => {
    if (action === 'buy' && priceListData && (amount || tokenAmount)) {
      const rate = priceListData?.buyRate;
      const tokenPriceInUSD = Number(token?.price);
      let convertedAmount;
      if (currency === 'usd') {
        convertedAmount = parseFloat(Number(amount) / tokenPriceInUSD);
      } else if (currency === 'naira') {
        convertedAmount = parseFloat((Number(amount) / rate) / tokenPriceInUSD);
      }

      if (amount) {
        setTokenAmount((convertedAmount).toFixed(8));
        setTotal((convertedAmount).toFixed(8));
      }
    }
  }, [action, amount, tokenAmount, currency, priceListData]);

  useEffect(() => {
    if (action === 'sell' && priceListData && (amount || tokenAmount)) {
      const rate = priceListData?.sellRate;
      const tokenPriceInUSD = Number(token?.price);
      let convertedAmount;
      if (currency === 'usd') {
        convertedAmount = parseFloat(tokenPriceInUSD * Number(tokenAmount));
      } else if (currency === 'naira') {
        convertedAmount = (parseFloat((tokenPriceInUSD * Number(tokenAmount)) * rate));
      }

      if (tokenAmount) {
        setTotal(convertedAmount.toFixed(2));
        setAmount((convertedAmount).toFixed(2));
      } else if (amount) {
        setTokenAmount((parseFloat(amount) / rate).toFixed(8));
        setTotal(parseFloat(amount).toFixed(2));
      }
    }
  }, [action, amount, tokenAmount, currency, priceListData]);

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

  const fetchPriceListData = async () => {
    try {
      const q = query(collection(db, 'pricelist'), where('tokenId', '==', id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setPriceListData(querySnapshot.docs[0].data());
      }
    } catch (error) {
      console.error('Error fetching price list data:', error);
    }
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const generateUniqueCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const length = 8;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }

    return result;
  };
  const [confirmOrderLoading, setConfirmOrderLoading] = useState(false);
  const confirmOrder = async () => {
    // Prevent multiple submissions
    if (confirmOrderLoading) return;
    // Start loading
    setConfirmOrderLoading(true);

    // Validation for Buy action
    if (action === 'buy') {
      if (!tokenAmount || !amount || !userWalletAddress || !userNetwork) {
        alert('Please provide token amount, amount, wallet address, and network.');
        setConfirmOrderLoading(false); // Stop loading on error
        return;
      }
    }

    // Validation for Sell action
    if (action === 'sell') {
      if (currency === 'usd') {
        if (!tokenAmount || !amount || !userWalletAddress || !userNetwork) {
          alert('Please provide token amount, amount, wallet address, and network for selling in USD.');
          setConfirmOrderLoading(false); // Stop loading on error
          return;
        }
      } else {
        if (!tokenAmount || !amount || !userAccountNumber || !userAccountNameAndBank) {
          alert('Please provide token amount, amount, account number, and account name and bank for selling.');
          setConfirmOrderLoading(false); // Stop loading on error
          return;
        }
      }
    }

    const uniqueCode = generateUniqueCode();
    const orderData = {
      userId: user.uid,
      token: {
        name: token.name,
        symbol: token.symbol,
        id: id
      },
      action,
      amount: parseFloat(amount),
      currency,
      tokenAmount: parseFloat(tokenAmount),
      rate: action === 'buy' ? priceListData?.buyRate : priceListData?.sellRate,
      total: parseFloat(total),
      status: 'pending',
      orderCode: uniqueCode,
      ...(action === 'buy' ? {
        userWalletAddress,
        userNetwork,
        adminAccountNumber: priceListData.accountNumber,
        adminAccountNameandBank: priceListData.accountNameAndBank,
      } : {
        userAccountNumber,
        userAccountNameAndBank,
        adminWalletAddress: priceListData.walletAddress,
        adminNetwork: priceListData.network
      })
    };
    try {
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      alert("Your order has been proceeded sucessfully")
      resetForm();
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error adding order: ', error);
      setError('Failed to place order. Please try again.');
    } finally {
      // Stop loading after the request is complete
      setConfirmOrderLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setTokenAmount('');
    setUserWalletAddress('');
    setUserNetwork('');
    setUserAccountNumber('');
    setUserAccountNameAndBank('');
    setTotal("");
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
  const handleSignIn = () => {
    navigate('/signin'); // Navigate to /signin when button is clicked
  };

  // ... (previous code remains the same)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 md:py-8">
      <div className="container mx-auto md:px-4">
        <div className="bg-white dark:bg-gray-800 md:rounded-lg shadow-lg overflow-hidden">
          {/* ... (previous content remains the same) */}
          <div className="p-6">
            <div className="flex items-center mb-4">
              <img src={token.iconUrl} alt={token.name} className="md:w-16 md:h-16 w-12 h-12 mr-4" />
              <div>
                <h1 className="text-lg md:text-3xl font-bold text-gray-900 dark:text-white">{token.name} ({token.symbol})</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rank: #{token.rank}</p>
              </div>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-sm md:text-lg font-semibold mb-2 text-gray-900 dark:text-white">Price Information</h2>
                <p className="text-2xl md:text-3xl font-bold text-[#FF900D] dark:text-[#FF900D]">${parseFloat(token.price).toFixed(2)} USD</p>
                <p className={`text-sm md:text-lg ${priceDirection === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  {priceDirection === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                  {Math.abs(priceChange)}% ({priceDirection})
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">BTC Price: {parseFloat(token.btcPrice).toFixed(8)} BTC</p>
              </div>
              <div>
                <h2 className="text-lg md:text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Market Information</h2>
                <p className="text-gray-600 dark:text-gray-400">Market Cap: ${parseInt(token.marketCap).toLocaleString()}</p>
                <p className="text-gray-600 dark:text-gray-400">24h Volume: ${parseInt(token['24hVolume']).toLocaleString()}</p>
                <p className="text-gray-600 dark:text-gray-400">Listed: {new Date(token.listedAt * 1000).toLocaleDateString()}</p>
              </div>
            </div>
  
            <div className="mb-2 md:mb-8">
              <h2 className="text-lg md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Price Chart</h2>
              <div className="h-32 md:h-96">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
          {/* <div className="md:p-6">
                    <CurrencyConverter initialCoin={token} />
                </div> */}
  
          {/* New Form Section */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700">
            <h2 className="text-lg md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Buy/Sell {token.symbol}</h2>
            <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 gap-4">
              <div>
                <label className="font-semibold text-gray-900 dark:text-white">Action</label>
                <select
                  value={action}
                  onChange={(e) => {
                    setAction(e.target.value);
                    resetForm();
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>
  
              <div>
                <label className="font-semibold text-gray-900 dark:text-white">Currency {action === 'buy' ? "to make Payment" : "to receive Payment"}</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="naira">Naira</option>
                  <option value="usd">USD</option>
                </select>
              </div>
  
              {action === 'buy' && (
                <>
                  <div>
                    <label className="font-semibold text-gray-900 dark:text-white">Amount in {currency === 'token' ? token.symbol : currency}</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setTokenAmount('');
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder={`Enter amount in ${currency === 'token' ? token.symbol : currency}`}
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-900 dark:text-white">Amount of ({token.symbol})</label>
                    <input
                      type="number"
                      value={tokenAmount}
                      onChange={(e) => {
                        setTokenAmount(e.target.value);
                        setAmount('');
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder={`Enter amount in ${token.symbol}`}
                      required
                      disabled
                    />
                  </div>
  
                  {currency === 'usd' ? (
                    <>
                      <div>
                        <label className="font-semibold text-gray-900 dark:text-white">Admin USD Wallet Address</label>
                        <input
                          type="text"
                          value={priceListData?.walletAddress}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-900 dark:text-white">Network</label>
                        <input
                          type="text"
                          value={priceListData?.network}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          readOnly
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="font-semibold text-gray-900 dark:text-white">Admin Account Number</label>
                        <input
                          type="text"
                          value={priceListData?.accountNumber}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-900 dark:text-white">Admin Account Name & Bank</label>
                        <input
                          type="text"
                          value={priceListData?.accountNameAndBank}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          readOnly
                        />
                      </div>
                    </>
                  )}
  
                  <div>
                    <label className="font-semibold text-gray-900 dark:text-white">Your Wallet Address (To Receive Token)</label>
                    <input
                      type="text"
                      value={userWalletAddress}
                      onChange={(e) => setUserWalletAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-900 dark:text-white">Your Network (To Receive Token)</label>
                    <input
                      type="text"
                      value={userNetwork}
                      onChange={(e) => setUserNetwork(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </>
              )}
  
              {action === 'sell' && (
                <>
                  <div>
                    <label className="font-semibold text-gray-900 dark:text-white">Amount ({token.symbol})</label>
                    <input
                      type="number"
                      value={tokenAmount}
                      onChange={(e) => {
                        setTokenAmount(e.target.value);
                        setAmount('');
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder={`Enter amount in ${token.symbol}`}
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-900 dark:text-white">Amount in Naira</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setTokenAmount('');
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Enter amount in Naira"
                      required
                      disabled
                    />
                  </div>
  
                  <div>
                    <label className="font-semibold text-gray-900 dark:text-white">Admin Account Number</label>
                    <input
                      type="text"
                      value={priceListData?.accountNumber}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-900 dark:text-white">Admin Account Name & Bank</label>
                    <input
                      type="text"
                      value={priceListData?.accountNameAndBank}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      readOnly
                    />
                  </div>
                  {currency === 'usd' ? (
                    <>
                      <div>
                        <label className="font-semibold text-gray-900 dark:text-white">User USD Wallet Address</label>
                        <input
                          required
                          type="text"
                          value={userWalletAddress}
                          onChange={(e)=>setUserWalletAddress(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-900 dark:text-white">Network</label>
                        <input
                          required
                          type="text"
                          value={userNetwork}
                          onChange={(e)=>setUserNetwork(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="font-semibold text-gray-900 dark:text-white">User Account Number</label>
                        <input
                          required
                          type="text"
                          value={userAccountNumber}
                          onChange={(e)=>setUserAccountNumber(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-900 dark:text-white">User Account Name & Bank</label>
                        <input
                          required
                          type="text"
                          value={userAccountNameAndBank}
                          onChange={(e)=>setUserAccountNameAndBank(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                    </>
                  )}
                </>
              )}
  
              <button
              type="submit"
              className={`w-full px-4 py-2 ${priceListData ? 'bg-[#FF900D] dark:bg-[#FF900D] hover:bg-[#FF900D]/70 dark:hover:bg-[#FF900D]/80' : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'} text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 ${priceListData ? 'focus:ring-[#FF900D]/50 dark:focus:ring-[#FF900D]/60' : 'focus:ring-gray-500 dark:focus:ring-gray-700'}`}
              disabled={!priceListData}
            >
              {priceListData ? 'Place Order' : "Can't Place Order Yet"}
            </button>
            </form>
          </div>
           {showConfirmation && (
            <div className="p-4 border-t dark:text-white border-gray-200">
              <h2 className="text-lg font-semibold mb-2">Order Summary</h2>

              {action === 'buy' ? (
                <>
                  <p className="mb-2">
                    <strong>Operation:</strong> Buy {token.symbol}
                  </p>
                  <p className="mb-2">
                    <strong>Amount to Pay: </strong> {currency === "usd" ? "$" : String.fromCharCode(8358)}{Number(amount).toLocaleString()} {currency} only
                  </p>
                  <p className="mb-2">
                    <strong>Rate:</strong> {priceListData?.buyRate} {currency} per USD
                  </p>
                  <p className="mb-2">
                    <strong>Token Amount:</strong> {tokenAmount} {token.symbol}
                  </p>
                  {currency === 'usd' ? (
                    <>
                      <p className="mb-2">
                        <strong>Admin Wallet Address:</strong> {priceListData?.walletAddress}
                      </p>
                      <p className="mb-2">
                        <strong>Network:</strong> {priceListData?.network}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mb-2">
                        <strong>Admin Account Number:</strong> {priceListData?.accountNumber}
                      </p>
                      <p className="mb-2">
                        <strong>Admin Account Name & Bank:</strong> {priceListData?.accountNameAndBank}
                      </p>
                    </>
                  )}
                  <p className="mb-2">
                    <strong>Your Wallet Address:</strong> {userWalletAddress}
                  </p>
                  <p className="mb-2">
                    <strong>Your Network:</strong> {userNetwork}
                  </p>
                  <p className="text-sm text-gray-500">You will receive {tokenAmount} {token.symbol} for your purchase.</p>
                </>
              ) : (
                <>
                  <p className="mb-2">
                    <strong>Operation:</strong> Sell {token.symbol}
                  </p>
                  <p className="mb-2">
                    <strong>Token Amount:</strong> {tokenAmount} {token.symbol}
                  </p>
                  <p className="mb-2">
                    <strong>Rate:</strong> {priceListData?.sellRate} {currency} per {token.symbol}
                  </p>
                  <p className="mb-2">
                    <strong>Admin Wallet Address:</strong> {priceListData?.walletAddress}
                  </p>
                  <p className="mb-2">
                    <strong>Network:</strong> {priceListData?.network}
                  </p>
                  {
                    currency !== 'usd' ? 
                    <>
                      <p className="mb-2">
                        <strong>Your Account Number:</strong> {userAccountNumber}
                      </p>
                      <p className="mb-2">
                        <strong>Your Account Name & Bank:</strong> {userAccountNameAndBank}
                      </p>
                    </>
                    :
                    <>
                      <p className="mb-2">
                        <strong>Your Wallet Address:</strong> {userWalletAddress}
                      </p>
                      <p className="mb-2">
                        <strong>Your Network:</strong> {userNetwork}
                      </p>
                    </> 
                  }
                  <p className="text-sm text-gray-500">You will receive {currency === "usd" ? "$" : String.fromCharCode(8358)}{total} {currency} for selling {tokenAmount} {token.symbol}.</p>
                </>
              )}
              {user?.uid ? (
                <div className="flex gap-4 mt-4">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center justify-center"
                    onClick={confirmOrder}
                    disabled={confirmOrderLoading}
                  >
                    {confirmOrderLoading && (
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                    )}
                    {confirmOrderLoading ? 'Processing...' : 'Continue'}
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="text-white px-4 py-2 rounded-md bg-red-500"
                  onClick={handleSignIn} // Call handleSignIn function
                >
                  Sign in to proceed
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default TokenDetailsPage;