import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Overview = () => {
  const userStats = [
    { name: 'Jan', activeUsers: 400, newSignups: 240 },
    { name: 'Feb', activeUsers: 300, newSignups: 139 },
    { name: 'Mar', activeUsers: 200, newSignups: 980 },
    { name: 'Apr', activeUsers: 278, newSignups: 390 },
    { name: 'May', activeUsers: 189, newSignups: 480 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">User Statistics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={userStats}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:stroke-gray-600" />
          <XAxis dataKey="name" stroke="#8884d8" className="dark:stroke-gray-400" />
          <YAxis stroke="#8884d8" className="dark:stroke-gray-400" />
          <Tooltip />
          <Legend />
          <Bar dataKey="activeUsers" fill="#8884d8" />
          <Bar dataKey="newSignups" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Overview;
