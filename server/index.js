const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const chairRoutes = require('./routes/chairRoutes');
const reviewerRoutes = require('./routes/reviewerRoutes');

app.use(cors());
app.use(express.json());

// Route Middlewares
app.use('/api/user', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/participant', userRoutes);
app.use('/api/chair', chairRoutes);
app.use('/api/reviewer', reviewerRoutes);

// Basic health check route
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  family: 4 // Force IPv4 to resolve issues on some Windows network configurations
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB. If you are on a restricted network, ensure your IP is whitelisted in MongoDB Atlas.');
    console.error('Error Details:', err.message);
  });

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
