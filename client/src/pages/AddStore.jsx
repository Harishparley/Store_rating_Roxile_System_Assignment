import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddStore = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',    // The public email displayed for the store
    address: '',
    ownerEmail: '' // The email of the User who owns this store (REQUIRED)
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      // Send the data to the backend
      await axios.post('http://localhost:5000/api/stores/add', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Store Created Successfully!");
      // If successful, go back to dashboard
      navigate('/dashboard');
    } catch (err) {
      // Show specific error from backend (e.g. "Owner not found")
      setError(err.response?.data?.error || 'Failed to add store');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Store</h2>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Name</label>
            <input 
              type="text" name="name" required
              minLength={20} maxLength={60} // Requirement: 20-60 Chars
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              value={formData.name} onChange={handleChange}
              placeholder="Min 20 characters..."
            />
            <p className="text-xs text-gray-400 mt-1">Must be between 20 and 60 characters.</p>
          </div>

          {/* Store Public Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Public Email</label>
            <input 
              type="email" name="email" required
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              value={formData.email} onChange={handleChange}
            />
          </div>

          {/* Store Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea 
              name="address" required rows="3"
              maxLength={400} // Requirement: Max 400 Chars
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              value={formData.address} onChange={handleChange}
            ></textarea>
             <p className="text-xs text-gray-400 mt-1">Max 400 characters.</p>
          </div>

          {/* Owner Email (New Field) */}
          <div className="bg-purple-50 p-3 rounded border border-purple-100">
            <label className="block text-sm font-bold text-purple-700">Store Owner's User Email</label>
            <input 
              type="email" name="ownerEmail" required
              className="w-full mt-1 p-2 border border-purple-300 rounded focus:ring-2 focus:ring-purple-500"
              value={formData.ownerEmail} onChange={handleChange}
              placeholder="Enter the email of the registered user who owns this"
            />
            <p className="text-xs text-purple-600 mt-1">This links the store to a user so they can see the dashboard.</p>
          </div>

          <div className="flex gap-4 mt-6">
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold"
            >
              Create Store
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStore;