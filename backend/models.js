const mongoose = require('mongoose'); 

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true}, 
    description: {type: String, required: true},
    team: [String],
});

const ScoreSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectID, ref: 'Project', required: true },
    judgeName: { type: String, required: true},
    fit: {type: Number, required: true},
    innovation: {type: Number, required: true},
    functionality: {type: Number, required: true},
    presentation: {type: Number, required: true},
});

const Project = mongoose.model('Project', ProjectSchema);
const Score = mongoose.model('Score', ScoreSchema); 

module.exports = {Project, Score}; 
