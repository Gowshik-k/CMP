const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Placeholder for MongoDB connection
/*
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));
*/

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
