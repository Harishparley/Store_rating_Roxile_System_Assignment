import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic frontend validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/auth/change-password', 
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(res.data.message);
      
      // Optional: Redirect after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || "Failed to update password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Current Password</label>
            <input 
              type="password" 
              name="oldPassword" 
              className="w-full p-2 border rounded"
              value={formData.oldPassword}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
            <input 
              type="password" 
              name="newPassword" 
              className="w-full p-2 border rounded"
              placeholder="8-16 chars, 1 Upper, 1 Special"
              value={formData.newPassword}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              className="w-full p-2 border rounded"
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Update Password
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button onClick={() => navigate(-1)} className="text-gray-500 text-sm hover:underline">
            Cancel / Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;