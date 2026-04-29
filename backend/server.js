require('dotenv').config();

const { Project, Score } = require('./models');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

// CORS setup
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching projects');
  }
});

// get all projects
app.post('/api/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).send('Error creating project');
  }
});

// Submit a score
app.post('/api/scores', async (req, res) => {
  try {
    const { projectId, judgeName } = req.body;

    const existing = await Score.findOne({ projectId, judgeName });

    if (existing) {
      // update instead of duplicate
      Object.assign(existing, req.body);
      await existing.save();
      return res.json({ message: 'Score updated successfully!' });
    }

    const score = new Score(req.body);
    await score.save();

    res.json({ message: 'Score submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving score');
  }
});

// Calculate Top Results 
app.get('/api/results', async (req, res) => {
try {
    const results = await Score.aggregate([
    {
        $group: {
        _id: '$projectId',
        totalScore: {
            $sum: { $add: ['$fit', '$innovation', '$functionality', '$presentation'] },
        },
        },
    },
    { $sort: { totalScore: -1 } }, // Sort by highest score
    { $limit: 3 }, // Limit to top 3
    ]);
    res.json(results);
} catch (error) {
    console.error(error);
    res.status(500).send('Error calculating results');
}
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
  
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
