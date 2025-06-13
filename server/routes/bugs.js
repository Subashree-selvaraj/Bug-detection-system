const express = require('express');
const router = express.Router();
const Bug = require('../models/Bug');

// Helper function to track changes
const trackChanges = (bug, oldBug, changedBy) => {
  const changes = [];
  const fields = ['status', 'priority', 'assignedTo', 'dueDate', 'estimatedTime', 'actualTime'];
  
  fields.forEach(field => {
    if (oldBug[field] !== bug[field]) {
      changes.push({
        field,
        oldValue: oldBug[field],
        newValue: bug[field],
        changedBy,
        changedAt: new Date()
      });
    }
  });

  if (changes.length > 0) {
    bug.history = [...(bug.history || []), ...changes];
  }
};

// Get all bugs with filtering and search
router.get('/', async (req, res) => {
  try {
    const {
      status,
      priority,
      project,
      assignedTo,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // Apply filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (project) query.project = project;
    if (assignedTo) query.assignedTo = assignedTo;

    // Apply search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Bug.countDocuments(query);

    // Get bugs with sorting and pagination
    const bugs = await Bug.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      bugs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bug statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Bug.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Bug.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const projectStats = await Bug.aggregate([
      {
        $group: {
          _id: '$project',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      statusStats: stats,
      priorityStats,
      projectStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new bug
router.post('/', async (req, res) => {
  const bug = new Bug({
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    project: req.body.project,
    reporter: req.body.reporter,
    screenshot: req.body.screenshot,
    dueDate: req.body.dueDate,
    estimatedTime: req.body.estimatedTime,
    tags: req.body.tags || []
  });

  try {
    const newBug = await bug.save();
    res.status(201).json(newBug);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a single bug
router.get('/:id', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    res.json(bug);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a bug
router.put('/:id', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    const oldBug = { ...bug.toObject() };

    // Update fields
    const fields = [
      'status', 'priority', 'assignedTo', 'dueDate',
      'estimatedTime', 'actualTime', 'title', 'description',
      'project', 'screenshot', 'tags'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        bug[field] = req.body[field];
      }
    });

    // Track changes
    trackChanges(bug, oldBug, req.body.changedBy || 'System');

    const updatedBug = await bug.save();
    res.json(updatedBug);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a bug
router.delete('/:id', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    await bug.deleteOne();
    res.json({ message: 'Bug deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 