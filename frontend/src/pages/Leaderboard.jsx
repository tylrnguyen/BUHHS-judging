import React, { useEffect, useState } from 'react';
import { fetchResults, fetchProjects } from '../api/api';

const LeaderboardList = ({ title, description, entries, projects, scoreKey }) => {
  return (
    <section className="leaderboard-section">
      <div className="section-header compact">
        <p className="section-kicker">{title}</p>
        <p>{description}</p>
      </div>

      <div className="leaderboard-list">
        {entries?.length > 0 ? (
          entries.map((entry, index) => {
            const project = projects.find((projectItem) => projectItem._id === entry._id);

            return project ? (
              <article key={`${title}-${entry._id}`} className="leaderboard-row">
                <div className="rank-badge">{index + 1}</div>

                <div className="leaderboard-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>

                <div className="score-badge">{entry[scoreKey]}</div>
              </article>
            ) : null;
          })
        ) : (
          <div className="project-card">
            <p>No scores submitted yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

const Leaderboard = () => {
  const [results, setResults] = useState({
    overall: [],
    presentation: [],
    socialImpact: []
  });
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function loadData() {
      const projectData = await fetchProjects();
      const resultsData = await fetchResults();

      setProjects(projectData);
      setResults({
        overall: resultsData.overall || [],
        presentation: resultsData.presentation || [],
        socialImpact: resultsData.socialImpact || []
      });
    }

    loadData();
  }, []);

  return (
    <section className="page-section">
      <div className="section-header">
        <p className="section-kicker">Live results</p>
        <h2>Leaderboards</h2>
        <p>Track the top projects across overall score, presentation, and social impact.</p>
      </div>

      <div className="leaderboard-stack">
        <LeaderboardList
          title="Best Overall"
          description="Highest combined score across all judging criteria."
          entries={results.overall}
          projects={projects}
          scoreKey="totalScore"
        />

        <LeaderboardList
          title="Best Presentation"
          description="Highest total presentation score across judges."
          entries={results.presentation}
          projects={projects}
          scoreKey="presentationScore"
        />

        <LeaderboardList
          title="Best Social Impact"
          description="Highest total social impact score across judges."
          entries={results.socialImpact}
          projects={projects}
          scoreKey="socialImpactScore"
        />
      </div>
    </section>
  );
};

export default Leaderboard;