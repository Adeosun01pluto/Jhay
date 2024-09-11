import React, { useState, useEffect } from 'react';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Adjust the import path as needed
import axios from 'axios'; // For fetching token prices and names

const PriceListManagement = () => {
  const [tokens, setTokens] = useState([]);
  const [editingToken, setEditingToken] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const rapidApiKey = import.meta.env.VITE_RAPID_API_KEY;

  // Fetch tokens from Firebase and API
  useEffect(() => {
    const fetchTokensFromApiAndDb = async () => {
      try {
        // Fetch token prices and names from API
        const options = {
          method: 'GET',
          url: 'https://coinranking1.p.rapidapi.com/coins',
          headers: {
            'x-rapidapi-key': rapidApiKey,
            'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
          }
        };

        const response = await axios.request(options);
        const apiTokens = response.data.data.coins.map(coin => ({
          id: coin.uuid,
          name: coin.name,
          price: parseFloat(coin.price).toFixed(2),
        }));

        // Fetch token details from Firebase
        const tokenCollection = collection(db, 'pricelist');
        const tokenSnapshot = await getDocs(tokenCollection);
        const firebaseTokens = tokenSnapshot.docs.map(doc => doc.data());

        // Merge API tokens with Firebase data
        const mergedTokens = apiTokens.map(token => {
          const firebaseToken = firebaseTokens.find(t => t.tokenId === token.id) || {};
          return {
            ...token,
            network: firebaseToken.network || 'N/A',
            walletAddress: firebaseToken.walletAddress || 'N/A',
            buyRate: firebaseToken.buyRate || 'N/A',
            sellRate: firebaseToken.sellRate || 'N/A',
            accountNumber: firebaseToken.accountNumber || 'N/A',
            accountNameAndBank: firebaseToken.accountNameAndBank || 'N/A',
          };
        });

        setTokens(mergedTokens);
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchTokensFromApiAndDb();
  }, [rapidApiKey]);

  const handleEditToken = (token) => {
    setEditingToken({
      ...token,
      network: token.network !== 'N/A' ? token.network : '',
      walletAddress: token.walletAddress !== 'N/A' ? token.walletAddress : '',
      buyRate: token.buyRate !== 'N/A' ? token.buyRate : '',
      sellRate: token.sellRate !== 'N/A' ? token.sellRate : '',
      accountNumber: token.accountNumber !== 'N/A' ? token.accountNumber : '',
      accountNameAndBank: token.accountNameAndBank !== 'N/A' ? token.accountNameAndBank : '',
    });
  };

  const handleUpdateToken = async (token) => {
    try {
      await setDoc(doc(db, 'pricelist', editingToken.id), {
        tokenId: token.id,
        tokenName: token.name,
        network: editingToken.network,
        walletAddress: editingToken.walletAddress,
        buyRate: editingToken.buyRate,
        sellRate: editingToken.sellRate,
        accountNumber: editingToken.accountNumber,
        accountNameAndBank: editingToken.accountNameAndBank
      });

      // Update token list with edited token
      setTokens(tokens.map(t => t.id === editingToken.id ? editingToken : t));
      setEditingToken(null);
      alert('Token updated successfully.');
    } catch (error) {
      console.error('Error updating token:', error);
    }
  };

  // Filter tokens based on search term
  const filteredTokens = tokens.filter(token =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.network.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.accountNameAndBank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Manage Token Prices</h2>

      {/* Search Bar */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by token name, network, account number, or account name and bank"
        className="border mb-4 p-2 rounded w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Token Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Wallet Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Network</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Buy Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Sell Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Account Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Account Name and Bank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {filteredTokens.map((token) => (
              <tr key={token.id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-100">{token.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-100">${token.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingToken && editingToken.id === token.id ? (
                    <input
                      type="text"
                      value={editingToken.walletAddress}
                      onChange={(e) => setEditingToken({...editingToken, walletAddress: e.target.value})}
                      className="border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  ) : (
                    token.walletAddress
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingToken && editingToken.id === token.id ? (
                    <input
                      type="text"
                      value={editingToken.network}
                      onChange={(e) => setEditingToken({...editingToken, network: e.target.value})}
                      className="border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  ) : (
                    token.network
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingToken && editingToken.id === token.id ? (
                    <input
                      type="text"
                      value={editingToken.buyRate}
                      onChange={(e) => setEditingToken({...editingToken, buyRate: e.target.value})}
                      className="border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  ) : (
                    token.buyRate || 'N/A'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingToken && editingToken.id === token.id ? (
                    <input
                      type="text"
                      value={editingToken.sellRate}
                      onChange={(e) => setEditingToken({...editingToken, sellRate: e.target.value})}
                      className="border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  ) : (
                    token.sellRate || 'N/A'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingToken && editingToken.id === token.id ? (
                    <input
                      type="text"
                      value={editingToken.accountNumber}
                      onChange={(e) => setEditingToken({...editingToken, accountNumber: e.target.value})}
                      className="border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  ) : (
                    token.accountNumber || 'N/A'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingToken && editingToken.id === token.id ? (
                    <input
                      type="text"
                      value={editingToken.accountNameAndBank}
                      onChange={(e) => setEditingToken({...editingToken, accountNameAndBank: e.target.value})}
                      className="border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  ) : (
                    token.accountNameAndBank || 'N/A'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingToken && editingToken.id === token.id ? (
                    <button
                      onClick={() => handleUpdateToken(token)}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2 dark:bg-green-900 dark:text-green-300"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditToken(token)}
                      className="bg--100 text-[#FF900D]/80 px-2 py-1 rounded text-sm dark:bg-[#FF900D]/90 dark:text-[#FF900D]/30"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceListManagement;
