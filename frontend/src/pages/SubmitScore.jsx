import React, { useEffect, useState } from 'react';
import { fetchProjects, submitScore } from '../api/api';

const SubmitScore = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [judgeName, setJudgeName] = useState('');
  const [fit, setFit] = useState(5);
  const [innovation, setInnovation] = useState(5);
  const [functionality, setFunctionality] = useState(5);
  const [presentation, setPresentation] = useState(5);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProjects() {
      const data = await fetchProjects();
      setProjects(data);
    }
    loadProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const scoreData = {
      projectId: selectedProject,
      judgeName,
      fit,
      innovation,
      functionality,
      presentation,
    };
    const response = await submitScore(scoreData);
    setMessage(response.message);
  };

  return (
    <div>
      <h1>Submit a Score</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Project:</label>
        <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} required>
          <option value="">Select a project</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>{p.title}</option>
          ))}
        </select>
        <br />
        <label>Judge Name:</label>
        <input type="text" value={judgeName} onChange={(e) => setJudgeName(e.target.value)} required />
        <br />
        <label>Fit:</label>
        <input type="number" min="1" max="10" value={fit} onChange={(e) => setFit(Number(e.target.value))} required />
        <br />
        <label>Innovation:</label>
        <input type="number" min="1" max="10" value={innovation} onChange={(e) => setInnovation(Number(e.target.value))} required />
        <br />
        <label>Functionality:</label>
        <input type="number" min="1" max="10" value={functionality} onChange={(e) => setFunctionality(Number(e.target.value))} required />
        <br />
        <label>Presentation:</label>
        <input type="number" min="1" max="10" value={presentation} onChange={(e) => setPresentation(Number(e.target.value))} required />
        <br />
        <button type="submit">Submit Score</button>
      </form>
    </div>
  );
};

export default SubmitScore;
