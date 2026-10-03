const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Route files
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const contactRoutes = require('./routes/contactRoutes');
const heroRoutes = require('./routes/heroRoutes');
const aboutRoutes = require('./routes/aboutRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all incoming origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware to ensure DB connection before processing API requests
app.use(async (req, res, next) => {
  // Allow root and health check endpoints without blocking for DB
  if (req.path === '/' || req.path === '/api' || req.path === '/api/health') {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error in request:', error.message);
    return res.status(500).json({
      error: 'Database connection failed',
      message: 'Failed to connect to MongoDB. Make sure MONGODB_URI is set in Vercel and MongoDB Atlas Network Access allows 0.0.0.0/0.',
      details: error.message,
    });
  }
});

// Helper function to test DB connection
const getDbStatus = async () => {
  try {
    await connectDB();
    return {
      connected: mongoose.connection.readyState === 1,
      error: null,
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message,
    };
  }
};

// Root & Health check routes
app.get('/', async (req, res) => {
  const dbStatus = await getDbStatus();
  res.json({
    message: 'Portfolio API is running...',
    status: 'ok',
    mongodb: dbStatus.connected ? 'connected' : 'disconnected',
    ...(dbStatus.error ? { mongodbError: dbStatus.error } : {}),
  });
});

app.get('/api', async (req, res) => {
  const dbStatus = await getDbStatus();
  res.json({
    message: 'Portfolio API is running...',
    status: 'ok',
    mongodb: dbStatus.connected ? 'connected' : 'disconnected',
    ...(dbStatus.error ? { mongodbError: dbStatus.error } : {}),
  });
});

app.get('/api/health', async (req, res) => {
  const dbStatus = await getDbStatus();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: dbStatus.connected ? 'connected' : 'disconnected',
    ...(dbStatus.error ? { mongodbError: dbStatus.error } : {}),
  });
});



// Routes - Support both /api/* and /* prefixes for flexibility

// Example :---
// app.use('/api/projects', projectRoutes);
// app.use('/projects', projectRoutes);









// Only start listening when run directly via node / nodemon, not when required by serverless
if (require.main === module) {
  connectDB().catch((err) => console.error('Initial DB connection error:', err.message));
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;

