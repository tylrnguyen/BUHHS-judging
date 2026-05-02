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
  console.log('[POST /api/scores] Incoming score request:', req.body);

  try {
    const { projectId, judgeName, fit, innovation, functionality, presentation } = req.body;

    if (!projectId) {
      console.warn('[POST /api/scores] Missing projectId');
      return res.status(400).json({ message: 'Project is required.' });
    }

    if (!judgeName || typeof judgeName !== 'string' || !judgeName.trim()) {
      console.warn('[POST /api/scores] Missing or invalid judgeName:', judgeName);
      return res.status(400).json({ message: 'Judge name is required.' });
    }

    const normalizedJudgeName = judgeName.trim().toLowerCase();

    const scoreData = {
      projectId,
      judgeName: normalizedJudgeName,
      fit,
      innovation,
      functionality,
      presentation
    };

    console.log('[POST /api/scores] Normalized score data:', scoreData);

    const existing = await Score.findOne({
      projectId,
      judgeName: normalizedJudgeName
    });

    if (existing) {
      console.log('[POST /api/scores] Existing score found. Updating:', {
        scoreId: existing._id,
        projectId,
        judgeName: normalizedJudgeName
      });

      Object.assign(existing, scoreData);
      await existing.save();

      console.log('[POST /api/scores] Score updated successfully:', existing._id);
      return res.json({ message: 'Score updated successfully!' });
    }

    console.log('[POST /api/scores] No existing score found. Creating new score.');

    const score = new Score(scoreData);
    await score.save();

    console.log('[POST /api/scores] Score submitted successfully:', score._id);
    res.json({ message: 'Score submitted successfully!' });
  } catch (error) {
    console.error('[POST /api/scores] Error saving score:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack
    });

    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Duplicate score detected. Try refreshing and submitting again.'
      });
    }

    res.status(500).json({ message: 'Error saving score' });
  }
});

// Calculate Top Results 
app.get('/api/results', async (req, res) => {
  try {
    const getLeaderboard = async (scoreField, outputField = 'score') => {
      return Score.aggregate([
        {
          $group: {
            _id: '$projectId',
            [outputField]: { $sum: `$${scoreField}` },
            scoreCount: { $sum: 1 }
          }
        },
        { $sort: { [outputField]: -1 } },
        { $limit: 3 }
      ]);
    };

    const overall = await Score.aggregate([
      {
        $group: {
          _id: '$projectId',
          totalScore: {
            $sum: {
              $add: ['$fit', '$innovation', '$functionality', '$presentation']
            }
          },
          scoreCount: { $sum: 1 }
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: 3 }
    ]);

    const presentation = await getLeaderboard('presentation', 'presentationScore');
    const socialImpact = await getLeaderboard('fit', 'socialImpactScore');

    res.json({
      overall,
      presentation,
      socialImpact
    });
  } catch (error) {
    console.error('[GET /api/results] Error calculating results:', error);
    res.status(500).json({ message: 'Error calculating results' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
  
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
