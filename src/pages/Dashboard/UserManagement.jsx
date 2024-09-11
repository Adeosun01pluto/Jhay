import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Adjust the import path as needed

const UserManagement = () => {
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      setUsers(usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'users'), {
        name: newUser.name,
        email: newUser.email,
        isAdmin: false,
      });
      setNewUser({ name: '', email: '' });
      alert('New user added successfully.');
    } catch (error) {
      console.error('Error adding user: ', error);
    }
  };

  const handleMakeAdmin = async (id) => {
    try {
      await updateDoc(doc(db, 'users', id), {
        isAdmin: true,
      });
      setUsers(users.map(user => user.id === id ? { ...user, isAdmin: true } : user));
      alert('User is now an admin.');
    } catch (error) {
      console.error('Error making user admin: ', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Manage Users</h2>
      <form onSubmit={handleAddUser} className="space-y-4 mb-6">
        <input
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          placeholder="User Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          placeholder="User Email"
          type="email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button
          type="submit"
          className="w-full bg-[#FF900D]/60 text-white px-4 py-2 rounded hover:bg-[#FF900D]/70 dark:bg-[#FF900D]/50 dark:hover:bg-[#FF900D]/40"
        >
          Add User
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div key={user.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-100">{user.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{user.email}</p>
            <p className="text-sm font-medium mb-2">
              Status: <span className={user.isAdmin ? "text-green-600" : "text-[#FF900D]/60"}>
                {user.isAdmin ? 'Admin' : 'User'}
              </span>
            </p>
            {!user.isAdmin && (
              <button
                className="w-full bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition duration-300 dark:bg-green-400 dark:hover:bg-green-300"
                onClick={() => handleMakeAdmin(user.id)}
              >
                Make Admin
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
