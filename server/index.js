const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use(cors());
app.use(express.json());

// Route Middlewares
app.use('/api/user', authRoutes);
app.use('/api/admin', adminRoutes);

// Basic health check route
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Mock Data
const conferences = [
  {
    id: 1,
    title: "Global AI & Machine Learning Summit 2026",
    date: "March 15-17, 2026",
    location: "San Francisco, CA",
    attendees: 1200,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400",
    category: "Technology",
    status: "Open"
  },
  {
    id: 2,
    title: "Sustainable Energy & Environment Expo",
    date: "April 22-24, 2026",
    location: "Berlin, Germany",
    attendees: 800,
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=400",
    category: "Science",
    status: "Limited"
  },
  {
    id: 3,
    title: "International Medical Research Conference",
    date: "May 10-12, 2026",
    location: "Tokyo, Japan",
    attendees: 2500,
    image: "https://images.unsplash.com/photo-1505751172107-160de461358b?auto=format&fit=crop&q=80&w=400",
    category: "Healthcare",
    status: "Open"
  }
];

const sessions = [
  {
    id: 1,
    time: "09:00 AM - 10:30 AM",
    title: "Keynote: The Future of Quantum Computing",
    speaker: "Dr. Sarah Mitchell",
    room: "Grand Hall A",
    type: "Keynote"
  },
  {
    id: 2,
    time: "11:00 AM - 12:30 PM",
    title: "Machine Learning in Healthcare",
    speaker: "Prof. James Wilson",
    room: "Meeting Room 204",
    type: "Workshop"
  },
  {
    id: 3,
    time: "02:00 PM - 03:30 PM",
    title: "Blockchain for Supply Chain Transparency",
    speaker: "Elena Rodriguez",
    room: "Tech Hub",
    type: "Session"
  }
];

const certificates = [
  {
    id: 1,
    title: "Certificate of Participation",
    conference: "Global AI Summit 2026",
    date: "March 17, 2026",
    type: "Certificate"
  },
  {
    id: 2,
    title: "Keynote Presentation Slides",
    conference: "Global AI Summit 2026",
    date: "March 15, 2026",
    type: "Material"
  }
];

// Attendee Endpoints
app.get('/api/attendee/conferences', (req, res) => {
  res.json(conferences);
});

app.post('/api/attendee/register', (req, res) => {
  const { conferenceId } = req.body;
  res.status(201).json({ message: 'Registration successful', conferenceId });
});

app.get('/api/attendee/schedules', (req, res) => {
  res.json(sessions);
});

app.get('/api/attendee/certificates', (req, res) => {
  res.json(certificates);
});

app.get('/api/attendee/stats', (req, res) => {
  res.json({
    registeredConferences: 3,
    upcomingSessions: 12,
    certificatesEarned: 5
  });
});
// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
