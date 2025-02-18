const mongoose = require('mongoose');
const { Project } = require('./models');

// Connect to MongoDB
mongoose.connect('mongodb+srv://tylern1228:lEXFuoqp9F57Cv40@cluster0.begmv.mongodb.net/cluster0?retryWrites=true&w=majority&appName=Cluster0');

// Add sample projects
const seedProjects = async () => {
  const projects = [
    { title: 'AI Chatbot', description: 'A chatbot to help with mental health.', team: ['Alice', 'Bob'] },
    { title: 'Weather App', description: 'A weather prediction app.', team: ['Charlie', 'Dave'] },
    { title: 'Fitness Tracker', description: 'An app to track your fitness.', team: ['Eve', 'Frank'] },
  ];

  try {
    await Project.insertMany(projects);
    console.log('Sample projects added!');
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
};

seedProjects();
