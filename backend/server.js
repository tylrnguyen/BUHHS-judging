const {Project, Score} = require('./models'); 

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://tylern1228:lEXFuoqp9F57Cv40@cluster0.begmv.mongodb.net/cluster0?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// get all projects
app.get('/api/projects', async (req, res) => {
    try {
      const projects = await Project.find(); // Fetch all projects
      console.log('Fetched projects from DB: ', projects); 
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).send('Error fetching projects');
    }
  });  

// Submit a score
app.post('/api/scores', async (req, res) => {
try {
    const score = new Score(req.body); // Create a new score
    await score.save(); // Save it to the database
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
  
// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
