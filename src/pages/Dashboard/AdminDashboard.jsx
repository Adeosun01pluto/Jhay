import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FaUsers, FaFileAlt, FaBell, FaChartBar } from 'react-icons/fa';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase'; // Adjust path as needed
import { useAuthState } from 'react-firebase-hooks/auth';

const AdminDashboard = () => {
  const [user] = useAuthState(auth);
  const [blogPost, setBlogPost] = useState({ title: '', content: '' });
  const [notice, setNotice] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [blogs, setBlogs] = useState([]);
  const [notices, setNotices] = useState([]);
  const [users, setUsers] = useState([]);

  const userStats = [
    { name: 'Jan', activeUsers: 400, newSignups: 240 },
    { name: 'Feb', activeUsers: 300, newSignups: 139 },
    { name: 'Mar', activeUsers: 200, newSignups: 980 },
    { name: 'Apr', activeUsers: 278, newSignups: 390 },
    { name: 'May', activeUsers: 189, newSignups: 480 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const blogsSnapshot = await getDocs(collection(db, 'blogs'));
      const noticesSnapshot = await getDocs(collection(db, 'notices'));
      const usersSnapshot = await getDocs(collection(db, 'users'));

      setBlogs(blogsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setNotices(noticesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setUsers(usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    fetchData();
  }, []);

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, 'blogs'), {
        title: blogPost.title,
        content: blogPost.content,
        author: user.email,
        createdAt: serverTimestamp(),
      });
      setBlogPost({ title: '', content: '' });
      alert('Blog post submitted successfully.');
    } catch (error) {
      console.error('Error adding blog post: ', error);
    }
  };

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

  const handleDeleteBlog = async (id) => {
    try {
      await deleteDoc(doc(db, 'blogs', id));
      setBlogs(blogs.filter(blog => blog.id !== id));
    } catch (error) {
      console.error('Error deleting blog post: ', error);
    }
  };

  const handleMakeAdmin = async (id) => {
    try {
      await updateDoc(doc(db, 'users', id), {
        isAdmin: true,
      });
      alert('User is now an admin.');
    } catch (error) {
      console.error('Error making user admin: ', error);
    }
  };

  const isAdmin = () => {
    return users.find((u) => u.email === user?.email)?.isAdmin;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {['Overview', 'Blog', 'Notice', 'Users'].map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-[#ff8903]
                ring-white ring-opacity-60 ring-offset-2 ring-offset-[#FF900D] focus:outline-none focus:ring-2
                ${
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-[#FF900D]'
                }`
              }
            >
              {category === 'Overview' && <FaChartBar className="inline mr-2" />}
              {category === 'Blog' && <FaFileAlt className="inline mr-2" />}
              {category === 'Notice' && <FaBell className="inline mr-2" />}
              {category === 'Users' && <FaUsers className="inline mr-2" />}
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel className="rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="activeUsers" fill="#8884d8" />
                  <Bar dataKey="newSignups" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Tab.Panel>
          <Tab.Panel className="rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Post a New Blog</h2>
              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Blog Title"
                  value={blogPost.title}
                  onChange={(e) =>
                    setBlogPost({ ...blogPost, title: e.target.value })
                  }
                />
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Blog Content"
                  rows={6}
                  value={blogPost.content}
                  onChange={(e) =>
                    setBlogPost({ ...blogPost, content: e.target.value })
                  }
                />
                <button
                  type="submit"
                  className="bg-[#FF900D] text-white px-4 py-2 rounded hover:bg-[#ff8903]"
                >
                  Post Blog
                </button>
              </form>
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">All Blogs</h2>
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-gray-100 p-4 mb-4 rounded-md shadow-sm"
                  >
                    <h3 className="font-bold text-lg">{blog.title}</h3>
                    <p>{blog.content}</p>
                    <p className="text-sm text-gray-600">
                      Author: {blog.author}
                    </p>
                    <button
                      className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm mt-2"
                      onClick={() => handleDeleteBlog(blog.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel className="rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Post a Notice</h2>
              <form onSubmit={handleNoticeSubmit} className="space-y-4">
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Notice Content"
                  rows={4}
                  value={notice}
                  onChange={(e) => setNotice(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-[#FF900D] text-white px-4 py-2 rounded hover:bg-[#ff8903]"
                >
                  Post Notice
                </button>
              </form>
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Current Notices</h2>
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="bg-gray-100 p-4 mb-4 rounded-md shadow-sm"
                  >
                    <p>{notice.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel className="rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
              <form onSubmit={handleAddUser} className="space-y-4 mb-6">
                <input
                  className="w-full p-2 border rounded"
                  placeholder="User Name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
                <input
                  className="w-full p-2 border rounded"
                  placeholder="User Email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
                <button
                  type="submit"
                  className="bg-[#FF900D] text-white px-4 py-2 rounded hover:bg-[#ff8903]"
                >
                  Add User
                </button>
              </form>

              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isAdmin ? 'Admin' : 'User'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!user.isAdmin && (
                          <button
                            className="bg-gray-100 text-gray-800 px-2 py-1 rounded mr-2 text-sm"
                            onClick={() => handleMakeAdmin(user.id)}
                          >
                            Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default AdminDashboard;
