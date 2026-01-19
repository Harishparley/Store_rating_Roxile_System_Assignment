const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');

const authRoutes = require('./routes/authRoutes');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Database Connection & Server Start
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync(); // This creates tables if they don't exist
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log('Error: ' + err);
  });