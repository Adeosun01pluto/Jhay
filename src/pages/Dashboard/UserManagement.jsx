import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Adjust the import path as needed
import { ThreeDots } from 'react-loader-spinner';

const UserManagement = () => {
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        setUsers(usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
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

  const handleToggleAdmin = async (id, makeAdmin) => {
    const action = makeAdmin ? 'make this user an admin' : 'remove admin privileges from this user';
    const isConfirmed = window.confirm(`Are you sure you want to ${action}?`);
  
    if (!isConfirmed) {
      return;
    }
  
    setLoadingUsers(prev => ({ ...prev, [id]: true }));
    try {
      await updateDoc(doc(db, 'users', id), {
        isAdmin: makeAdmin,
      });
      setUsers(users.map(user => user.id === id ? { ...user, isAdmin: makeAdmin } : user));
      alert(`User is now ${makeAdmin ? 'an admin' : 'no longer an admin'}.`);
    } catch (error) {
      console.error(`Error ${makeAdmin ? 'making' : 'removing'} user ${makeAdmin ? 'admin' : 'from admin'}: `, error);
    } finally {
      setLoadingUsers(prev => ({ ...prev, [id]: false }));
    }
  };

  if (loading) return (
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
  );

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
            <button
              className={`w-full ${user.isAdmin ? 'bg-red-500 hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-300' : 'bg-green-500 hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-300'} text-white px-3 py-1 rounded text-sm transition duration-300`}
              onClick={() => handleToggleAdmin(user.id, !user.isAdmin)}
              disabled={loadingUsers[user.id]}
            >
              {loadingUsers[user.id] ? (
                <ThreeDots
                  visible={true}
                  height="24"
                  width="24"
                  color="#FFFFFF"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                user.isAdmin ? 'Remove Admin' : 'Make Admin'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;