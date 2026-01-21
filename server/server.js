const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stores', require('./routes/storeRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// ... imports

// Database Connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to MySQL Database.');
    
    // 👇 EMPTY BRACKETS () mean: "If table exists, DO NOT TOUCH IT."
    return sequelize.sync(); 
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Database Error:', err);
  });