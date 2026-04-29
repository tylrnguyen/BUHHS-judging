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
    <section className="page-section">
      <div className="section-header">
        <p className="section-kicker">Live results</p>
        <h2>Leaderboard</h2>
        <p>Top scores update here so judges can quickly compare the frontrunners.</p>
      </div>

      <div className="leaderboard-list">
        {results.map((entry, index) => {
          const project = projects.find((projectItem) => projectItem._id === entry._id);
          return project ? (
            <article key={entry._id} className="leaderboard-row">
              <div className="rank-badge">{index + 1}</div>
              <div className="leaderboard-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
              <div className="score-badge">{entry.totalScore}</div>
            </article>
          ) : null;
        })}
      </div>
    </section>
  );
};

export default Leaderboard;
