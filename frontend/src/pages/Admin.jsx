import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Railway FIR Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-4xl font-bold text-indigo-600 mb-4">Admin Dashboard</h2>
          <p className="text-lg text-gray-700">
            Welcome to the Admin Dashboard. You have full access to system management and configuration.
          </p>
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-600">
            <p className="text-gray-800">Role: <span className="font-bold text-indigo-600">Administrator</span></p>
            <p className="text-gray-800">User ID: <span className="font-bold">{user.id}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
