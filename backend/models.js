const mongoose = require('mongoose'); 

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

  // Keeps your current frontend working
  team: [String],

  // Google Form fields
  submitterEmail: String,
  teamName: String,

  members: [
    {
      name: String,
      email: String
    }
  ],

  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const ScoreSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectID, ref: 'Project', required: true },
    judgeName: { type: String, required: true},
    fit: {type: Number, required: true},
    innovation: {type: Number, required: true},
    functionality: {type: Number, required: true},
    presentation: {type: Number, required: true},
});

ScoreSchema.index({ projectId: 1, judgeName: 1 }, { unique: true });

const Project = mongoose.model('Project', ProjectSchema);
const Score = mongoose.model('Score', ScoreSchema); 

module.exports = {Project, Score}; 
