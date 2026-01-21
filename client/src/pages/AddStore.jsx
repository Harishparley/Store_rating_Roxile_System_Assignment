import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddStore = () => {
  const [formData, setFormData] = useState({ name: '', address: '', email: '', ownerEmail: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/stores/add', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/dashboard');
    } catch (err) { alert(err.response?.data?.error || "Error adding store"); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Store</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Store Name" required onChange={e => setFormData({...formData, name: e.target.value})} />
          <input className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Address" required onChange={e => setFormData({...formData, address: e.target.value})} />
          <input className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Public Email (Optional)" onChange={e => setFormData({...formData, email: e.target.value})} />
          <div className="border-t border-gray-100 pt-4">
             <label className="text-xs text-gray-500 uppercase font-bold">Link Store Owner</label>
             <input className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Owner's User Email" required onChange={e => setFormData({...formData, ownerEmail: e.target.value})} />
          </div>
          <div className="flex gap-4 pt-2">
             <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Cancel</button>
             <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md">Create Store</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddStore;