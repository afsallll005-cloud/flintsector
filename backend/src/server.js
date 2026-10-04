const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Route files
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Ensure public/uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploaded files
app.use('/uploads', express.static(uploadsDir));

// Middleware to ensure DB connection before processing API requests
app.use(async (req, res, next) => {
  // Allow root, health, uploads, and upload endpoint without blocking for DB
  if (
    req.path === '/' ||
    req.path === '/api' ||
    req.path === '/api/health' ||
    req.path.startsWith('/uploads') ||
    req.path === '/api/upload'
  ) {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error in request:', error.message);
    return res.status(500).json({
      error: 'Database connection failed',
      message:
        'Failed to connect to MongoDB. Make sure MONGODB_URI is set properly and MongoDB Atlas Network Access allows 0.0.0.0/0.',
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
    name: 'FLINT SECTOR API',
    message: 'Flint Sector Backend API is running smoothly',
    status: 'ok',
    mongodb: dbStatus.connected ? 'connected' : 'disconnected',
    ...(dbStatus.error ? { mongodbError: dbStatus.error } : {}),
  });
});

app.get('/api', async (req, res) => {
  const dbStatus = await getDbStatus();
  res.json({
    name: 'FLINT SECTOR API',
    message: 'Flint Sector Backend API is running smoothly',
    status: 'ok',
    mongodb: dbStatus.connected ? 'connected' : 'disconnected',
    endpoints: {
      products: '/api/products',
      orders: '/api/orders',
      admin: '/api/admin',
      upload: '/api/upload',
      health: '/api/health',
    },
    ...(dbStatus.error ? { mongodbError: dbStatus.error } : {}),
  });
});

app.get('/api/health', async (req, res) => {
  const dbStatus = await getDbStatus();
  res.json({
    status: 'ok',
    app: 'FLINT SECTOR',
    timestamp: new Date().toISOString(),
    mongodb: dbStatus.connected ? 'connected' : 'disconnected',
    ...(dbStatus.error ? { mongodbError: dbStatus.error } : {}),
  });
});

// Dedicated Image Upload Endpoint (handles base64 or data url, saves to disk & returns URL)
app.post('/api/upload', (req, res) => {
  try {
    const { image, filename } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'No image data provided' });
    }

    // If it's already an external URL, return as-is
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return res.status(200).json({ success: true, url: image });
    }

    // Extract base64 format
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Expected base64 Data URL or HTTP URL.',
      });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Extension from mime
    let ext = 'jpg';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('gif')) ext = 'gif';
    else if (mimeType.includes('svg')) ext = 'svg';

    const safeFilename = (filename || 'product')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);

    const uniqueFilename = `${safeFilename}-${Date.now()}.${ext}`;
    const filePath = path.join(uploadsDir, uniqueFilename);

    fs.writeFileSync(filePath, buffer);

    const protocol = req.protocol;
    const host = req.get('host');
    const fileUrl = `${protocol}://${host}/uploads/${uniqueFilename}`;

    res.status(200).json({
      success: true,
      url: fileUrl,
      filename: uniqueFilename,
      size: buffer.length,
      message: 'Image uploaded and saved successfully',
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Routes
app.use('/api/products', productRoutes);
app.use('/products', productRoutes);

app.use('/api/orders', orderRoutes);
app.use('/orders', orderRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Only start listening when run directly via node / nodemon, not when required by serverless
if (require.main === module) {
  connectDB().catch((err) =>
    console.error('Initial DB connection error:', err.message)
  );
  app.listen(port, () => {
    console.log(`FLINT SECTOR Server running on port ${port}`);
  });
}

module.exports = app;
