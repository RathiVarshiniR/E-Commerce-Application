const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Server running' }));

const startServer = () => {
  const port = process.env.PORT || 5000;
  const host = process.env.HOST || '0.0.0.0';

  app.listen(port, host, () => {
    console.log(`🚀 Server running at http://${host}:${port}`);
  });
};

// Connect to MongoDB when available, but keep the API usable for local frontend work.
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ MongoDB connected');
    startServer();
  })
  .catch(err => {
    console.warn('⚠️ MongoDB connection failed:', err.message);
    console.warn('⚠️ Starting with in-memory auth storage for this session.');
    startServer();
  });

module.exports = app;
