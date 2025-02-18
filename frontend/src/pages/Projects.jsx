import React, { useEffect, useState } from 'react';
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
    <div>
      <h1>Hackathon Projects</h1>
      {projects.map(project => (
        <div key={project._id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <p><strong>Team:</strong> {project.team.join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default Projects;
