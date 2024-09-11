import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Adjust the import path as needed

const NoticeManagement = () => {
  const [notice, setNotice] = useState('');
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      const noticesSnapshot = await getDocs(collection(db, 'notices'));
      setNotices(noticesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchNotices();
  }, []);

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'notices'), {
        content: notice,
        createdAt: serverTimestamp(),
      });
      setNotice('');
      alert('Notice submitted successfully.');
    } catch (error) {
      console.error('Error adding notice: ', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Post a Notice</h2>
      <form onSubmit={handleNoticeSubmit} className="space-y-4">
        <textarea
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          placeholder="Notice Content"
          rows={4}
          value={notice}
          onChange={(e) => setNotice(e.target.value)}
        />
        <button
          type="submit"
          className="bg-[#FF900D]/60 text-white px-4 py-2 rounded hover:bg-[#FF900D]/70 dark:bg-[#FF900D]/50 dark:hover:bg-[#FF900D]/40"
        >
          Post Notice
        </button>
      </form>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Current Notices</h2>
        {notices.map((notice) => (
          <div key={notice.id} className="bg-gray-100 dark:bg-gray-800 p-4 mb-4 rounded-md shadow-sm">
            <p className="text-gray-700 dark:text-gray-300">{notice.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeManagement;
