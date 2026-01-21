import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/auth/change-password', passwords, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert("Password updated!");
      navigate('/dashboard');
    } catch (err) { alert("Failed to update password"); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" placeholder="Current Password" required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} />
          <input type="password" placeholder="New Password" required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" onChange={e => setPasswords({...passwords, newPassword: e.target.value})} />
          <div className="flex gap-2 pt-4">
            <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200">Cancel</button>
            <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 shadow-md">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ChangePassword;