const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bugRoutes = require('./routes/bugs');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bugs', bugRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bug-tracker')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Seed initial data if database is empty
const Bug = require('./models/Bug');
Bug.countDocuments().then(count => {
  if (count === 0) {
    const sampleBugs = [
      {
        title: 'Login Button Not Working',
        description: 'The login button does not respond when clicked',
        priority: 'High',
        status: 'Open',
        project: 'Website'
      },
      {
        title: 'Profile Page Loading Slow',
        description: 'Profile page takes more than 5 seconds to load',
        priority: 'Medium',
        status: 'In Progress',
        project: 'Mobile App'
      },
      {
        title: 'Search Results Not Filtering',
        description: 'Search results do not filter based on selected criteria',
        priority: 'Low',
        status: 'Resolved',
        project: 'Website'
      }
    ];
    Bug.insertMany(sampleBugs)
      .then(() => console.log('Sample bugs added'))
      .catch(err => console.error('Error adding sample bugs:', err));
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 