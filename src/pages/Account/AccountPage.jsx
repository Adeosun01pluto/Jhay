import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase/firebase';
import { updateUserProfile } from '../../helper/help';

const AccountPage = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch user data from Firebase Auth
    const user = auth.currentUser;
    if (user) {
      setName(user.displayName || '');
      setBio(user.bio || ''); // Assuming you have a bio field in user profile
      setPhoneNumber(''); // Leave phone number blank initially
    }
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Update user profile in Firebase
      await updateUserProfile(auth.currentUser, { displayName: name, bio });
      setSuccessMessage('Profile updated successfully.');
    } catch (error) {
      setErrorMessage('Failed to update profile: ' + error.message);
    }
  };

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
        {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
        {successMessage && <div className="text-green-500 text-sm">{successMessage}</div>}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF900D] hover:bg-[#e68200] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF900D]"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountPage;
