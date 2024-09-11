import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/firebase';
import { updateUserProfile } from '../../helper/help';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const AccountPage = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountNameAndBank, setAccountNameAndBank] = useState('');
  const [username, setUsername] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [orderCount, setOrderCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const user = auth.currentUser;
      if (user) {
        setName(user.displayName || '');
        setCreationDate(user.metadata.creationTime || '');
        
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setPhoneNumber(userData.phoneNumber || '');
          setBio(userData.bio || '');
          setAccountNumber(userData.accountNumber || '');
          setAccountNameAndBank(userData.accountNameAndBank || '');
          setUsername(userData.username || '');
          setOrderCount(userData.orderCount || 0);
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsUpdating(true);

    try {
      const user = auth.currentUser;
      if (user) {
        // Update user profile in Firebase Auth
        await updateUserProfile(user, { displayName: name });

        // Update user data in Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          bio,
          phoneNumber,
          accountNumber,
          accountNameAndBank,
          username
        });

        setSuccessMessage('Profile updated successfully.');
      }
    } catch (error) {
      setErrorMessage('Failed to update profile: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#6b5f52]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-md my-12">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Account Settings</h2>
      <form onSubmit={handleUpdateProfile} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email (read-only)</label>
          <input
            type="email"
            value={auth.currentUser?.email || ''}
            readOnly
            className="mt-1 block w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[#FF900D] focus:border-[#FF900D] sm:text-sm px-3 py-2 outline-none text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[#FF900D] focus:border-[#FF900D] sm:text-sm px-3 py-2 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[#FF900D] focus:border-[#FF900D] sm:text-sm px-3 py-2 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[#FF900D] focus:border-[#FF900D] sm:text-sm px-3 py-2 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Tell us about yourself"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[#FF900D] focus:border-[#FF900D] sm:text-sm px-3 py-2 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Number</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[#FF900D] focus:border-[#FF900D] sm:text-sm px-3 py-2 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Enter your account number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Name and Bank</label>
          <input
            type="text"
            value={accountNameAndBank}
            onChange={(e) => setAccountNameAndBank(e.target.value)}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[#FF900D] focus:border-[#FF900D] sm:text-sm px-3 py-2 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Enter your account name and bank"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Created On (read-only)</label>
          <input
            type="text"
            value={creationDate}
            readOnly
            className="mt-1 block w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[#FF900D] focus:border-[#FF900D] sm:text-sm px-3 py-2 outline-none text-gray-900 dark:text-gray-100"
          />
        </div>
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Number of Orders (read-only)</label>
          <input
            type="number"
            value={orderCount}
            readOnly
            className="mt-1 block w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[#FF900D] focus:border-[#FF900D] sm:text-sm px-3 py-2 outline-none text-gray-900 dark:text-gray-100"
          />
        </div> */}
        {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
        {successMessage && <div className="text-green-500 text-sm">{successMessage}</div>}
        <div>
          <button
            type="submit"
            disabled={isUpdating}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF900D] hover:bg-[#e68200] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF900D]'
            }`}
          >
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountPage;