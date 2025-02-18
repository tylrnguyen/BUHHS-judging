import React, { useEffect, useState } from 'react';
import { fetchResults, fetchProjects } from '../api/api';

const Leaderboard = () => {
  const [results, setResults] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function loadData() {
      const projectData = await fetchProjects();
      const resultsData = await fetchResults();
      setProjects(projectData);
      setResults(resultsData);
    }
    loadData();
  }, []);

  return (
    <div>
      <h1>Leaderboard</h1>
      {results.map(entry => {
        const project = projects.find(p => p._id === entry._id);
        return project ? (
          <div key={entry._id}>
            <h2>{project.title}</h2>
            <p>Total Score: {entry.totalScore}</p>
          </div>
        ) : null;
      })}
    </div>
  );
};

export default Leaderboard;
