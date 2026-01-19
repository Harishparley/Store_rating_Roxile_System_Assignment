import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert("Registration Successful! Please Login.");
      navigate('/');
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-2 border rounded" placeholder="Full Name" 
            onChange={e => setFormData({...formData, name: e.target.value})} />
          <input className="w-full p-2 border rounded" type="email" placeholder="Email" 
            onChange={e => setFormData({...formData, email: e.target.value})} />
          <input className="w-full p-2 border rounded" type="password" placeholder="Password" 
            onChange={e => setFormData({...formData, password: e.target.value})} />
          <input className="w-full p-2 border rounded" placeholder="Address" 
            onChange={e => setFormData({...formData, address: e.target.value})} />
          
          <button className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
        </form>
        <div className="text-center mt-4">
          <Link to="/" className="text-blue-500">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;