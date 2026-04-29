import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../api/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function loadProjects() {
      const data = await fetchProjects();
      setProjects(data);
    }
    loadProjects();
  }, []);

  return (
    <section className="page-section">
      <div className="section-header">
        <p className="section-kicker">Project library</p>
        <h2>Browse the teams before judging</h2>
        <p>Each project card gives you the basics upfront so you can move into scoring with less friction.</p>
      </div>

      <div className="card-grid">
        {projects.map((project) => (
          <article key={project._id} className="project-card">
            <div className="card-title-row">
              <h3>{project.title}</h3>
              <span className="pill">Team {project.team?.length || 0}</span>
            </div>
            <p>{project.description}</p>
            <div className="tag-row">
              {project.team?.map((member) => (
                <span key={member} className="tag">
                  {member}
                </span>
              ))}
            </div>
            <div className="project-actions">
              <Link to={`/submit-score/${project._id}`} className="button primary project-action">
                Start survey
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Projects;
