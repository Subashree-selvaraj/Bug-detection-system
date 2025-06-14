const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bugRoutes = require('./routes/bugs');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://bugtracker-vbr3.onrender.com', 'http://localhost:3000']
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// API routes
app.use('/api/bugs', bugRoutes);

// Test default API route
app.get('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/bug-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

// Seed data if empty
const Bug = require('./models/Bug');
Bug.countDocuments().then(count => {
  if (count === 0) {
    const sampleBugs = [
      {
        title: 'Login Button Not Working',
        description: 'The login button does not respond when clicked',
        priority: 'High',
        status: 'Open',
        project: 'Website',
        reporter: 'System',
        assignedTo: 'John Doe',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimatedTime: 4,
        tags: ['UI', 'Authentication']
      },
      {
        title: 'Profile Page Loading Slow',
        description: 'Profile page takes more than 5 seconds to load',
        priority: 'Medium',
        status: 'In Progress',
        project: 'Mobile App',
        reporter: 'System',
        assignedTo: 'Jane Smith',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        estimatedTime: 8,
        tags: ['Performance', 'Mobile']
      },
      {
        title: 'Search Results Not Filtering',
        description: 'Search results do not filter based on selected criteria',
        priority: 'Low',
        status: 'Resolved',
        project: 'Website',
        reporter: 'System',
        assignedTo: 'Mike Johnson',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        estimatedTime: 2,
        tags: ['Search', 'Filter']
      }
    ];
    Bug.insertMany(sampleBugs)
      .then(() => console.log('✅ Sample bugs added'))
      .catch(err => console.error('❌ Error adding sample bugs:', err));
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
