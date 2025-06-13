const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed', 'Reopened'],
    default: 'Open'
  },
  screenshot: {
    type: String,
    trim: true
  },
  assignedTo: {
    type: String,
    trim: true
  },
  project: {
    type: String,
    trim: true,
    required: true
  },
  reporter: {
    type: String,
    trim: true,
    required: true
  },
  dueDate: {
    type: Date
  },
  estimatedTime: {
    type: Number, // in hours
    min: 0
  },
  actualTime: {
    type: Number, // in hours
    min: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  history: [{
    field: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    changedBy: String,
    changedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
bugSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Bug', bugSchema); 