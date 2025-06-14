const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bugRoutes = require('./routes/bugs');
const fs = require('fs');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://bug-tracker.onrender.com', 'http://localhost:3000']
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/bugs', bugRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://subashree:subashreevjc@cluster0.w72rf.mongodb.net/bug-tracker?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1); // Exit if cannot connect to database
});

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
        project: 'Website',
        reporter: 'System',
        assignedTo: 'John Doe',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
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
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
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
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        estimatedTime: 2,
        tags: ['Search', 'Filter']
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
  const clientBuildPath = path.join(__dirname, '../client/build');
  console.log('Client build path:', clientBuildPath);
  
  // Check if build directory exists
  if (!fs.existsSync(clientBuildPath)) {
    console.error('Build directory not found at:', clientBuildPath);
    console.log('Current directory:', __dirname);
    console.log('Directory contents:', fs.readdirSync(path.join(__dirname, '..')));
  }
  
  // Serve static files from the React app
  app.use(express.static(clientBuildPath));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res, next) => {
    const indexPath = path.join(clientBuildPath, 'index.html');
    console.log('Serving index from:', indexPath);
    
    // Check if the file exists before sending
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error('Build files not found at:', indexPath);
      res.status(404).send('Build files not found. Please check the deployment process.');
    }
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 