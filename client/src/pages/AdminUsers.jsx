import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [filterRole, setFilterRole] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Load Data
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [filterRole, searchEmail]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/users?role=${filterRole}&email=${searchEmail}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">System Admin</h1>
        <div>
          <button onClick={() => navigate('/add-store')} className="bg-green-600 text-white px-4 py-2 rounded mr-2">Add Store</button>
          <button onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold">{stats.users || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500">Total Stores</h3>
          <p className="text-2xl font-bold">{stats.stores || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500">Total Ratings</h3>
          <p className="text-2xl font-bold">{stats.ratings || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-4 items-center">
        <span className="font-bold">Filter Users:</span>
        <select 
          className="border p-2 rounded" 
          value={filterRole} 
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">Normal User</option>
          <option value="owner">Store Owner</option>
        </select>
        <input 
          type="text" 
          placeholder="Search Email..." 
          className="border p-2 rounded flex-grow"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
      </div>

      {/* User Table */}
      <div className="bg-white rounded shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Address</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    u.role === 'admin' ? 'bg-red-100 text-red-800' :
                    u.role === 'owner' || u.role === 'store_owner' ? 'bg-purple-100 text-purple-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-3 truncate max-w-xs">{u.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;