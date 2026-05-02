import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchProjects, submitScore } from '../api/api';

const criteria = [
  {key: 'fit', label: 'Social Impact', hint: 'How meaningful is the project’s potential impact on people, communities, or society?'},
  { key: 'innovation', label: 'Innovation', hint: 'How original or creative is the approach?' },
  { key: 'functionality', label: 'Functionality', hint: 'How complete and reliable is the build?' },
  { key: 'presentation', label: 'Presentation', hint: 'How clearly is the project communicated?' },
];

const scoreOptions = Array.from({ length: 10 }, (_, index) => index + 1);

const SubmitScore = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [judgeName, setJudgeName] = useState('');
  const [fit, setFit] = useState(5);
  const [innovation, setInnovation] = useState(5);
  const [functionality, setFunctionality] = useState(5);
  const [presentation, setPresentation] = useState(5);
  const [message, setMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    async function loadProjects() {
      const data = await fetchProjects();
      setProjects(data);
    }
    loadProjects();
  }, []);

  useEffect(() => {
    if (projectId) {
      setSelectedProject(projectId);
    }
  }, [projectId]);

  useEffect(() => {
  if (!message) return;

  const timer = setTimeout(() => {
    setMessage('');
  }, 3000);

  return () => clearTimeout(timer);
  }, [message]);

  const selectedProjectData = useMemo(
    () => projects.find((project) => project._id === selectedProject),
    [projects, selectedProject]
  );

  const stepTotal = criteria.length + 3;
  const progress = Math.round(((currentStep + 1) / stepTotal) * 100);

  const scoreState = {
    fit,
    innovation,
    functionality,
    presentation,
  };

  const updateScore = (key, value) => {
    if (key === 'fit') setFit(value);
    if (key === 'innovation') setInnovation(value);
    if (key === 'functionality') setFunctionality(value);
    if (key === 'presentation') setPresentation(value);
  };

  const canAdvance =
    (currentStep === 0 && selectedProject) ||
    (currentStep === 1 && judgeName.trim()) ||
    currentStep >= 2;

  const handleNext = () => {
    if (currentStep < stepTotal - 1 && canAdvance) {
      setCurrentStep((step) => step + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
      return;
    }

    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep < stepTotal - 1) {
      if (canAdvance) {
        handleNext();
      }
      return;
    }

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
    setCurrentStep(0);
  };

  const currentCriterion = criteria[currentStep - 2];
  const stepLabel = projectId ? 'Survey step' : 'Step';

  const renderStepBody = () => {
    if (currentStep === 0) {
      return (
        <section className="survey-panel">
          <div className="section-header">
            <p className="section-kicker">{stepLabel} 1 of {stepTotal}</p>
            <h2>Pick the project</h2>
            <p>Choose the team you are evaluating. Everything else in the survey will follow this selection.</p>
          </div>
          <label className="field">
            <span>Project</span>
            <select
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setMessage('');
              }}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
          </label>
        </section>
      );
    }

    if (currentStep === 1) {
      return (
        <section className="survey-panel">
          <div className="section-header">
            <p className="section-kicker">{stepLabel} 2 of {stepTotal}</p>
            <h2>Who is judging?</h2>
            <p>Enter your name once. It will stay attached to this score submission.</p>
          </div>
          <label className="field">
            <span>Judge name</span>
            <input
              type="text"
              value={judgeName}
              onChange={(e) => setJudgeName(e.target.value)}
              placeholder="Your name"
            />
          </label>
        </section>
      );
    }

    if (currentCriterion) {
      const value = scoreState[currentCriterion.key];

      return (
        <section className="survey-panel">
          <div className="section-header">
            <p className="section-kicker">{stepLabel} {currentStep + 1} of {stepTotal}</p>
            <h2>{currentCriterion.label}</h2>
            <p>{currentCriterion.hint}</p>
          </div>

          <div className="score-scale" role="radiogroup" aria-label={currentCriterion.label}>
            {scoreOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={option === value ? 'score-option selected' : 'score-option'}
                onClick={() => updateScore(currentCriterion.key, option)}
              >
                <span>{option}</span>
              </button>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className="survey-panel review-panel">
        <div className="section-header">
          <p className="section-kicker">Final step</p>
          <h2>Review before submit</h2>
          <p>Double-check the project, judge, and rubric scores. Then submit in one click.</p>
        </div>

        <div className="review-grid">
          <div>
            <span className="review-label">Project</span>
            <strong>{selectedProjectData?.title || 'Not selected'}</strong>
          </div>
          <div>
            <span className="review-label">Judge</span>
            <strong>{judgeName || 'Not entered'}</strong>
          </div>
          {criteria.map((criterion) => (
            <div key={criterion.key}>
              <span className="review-label">{criterion.label}</span>
              <strong>{scoreState[criterion.key]}</strong>
            </div>
          ))}
        </div>

        <div className="review-actions">
          <button type="button" className="button secondary" onClick={handleBack}>
            Back to scores
          </button>
        </div>
      </section>
    );
  };

  return (
    <form
        className="survey-layout qualtrics-style"
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && currentStep < stepTotal - 1) {
            e.preventDefault();
          }
        }}
      >
      <div className="survey-progress-header">
        <div className="progress-wrap" aria-label={`Progress ${progress}%`}>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-label">{progress}%</span>
        </div>
      </div>

      {message && <div className="toast success">{message}</div>}

      <div className="survey-container">
        <div className="survey-content">
          <div className="survey-header-info">
            {selectedProjectData && (
              <>
                <h3 className="current-project">{selectedProjectData.title}</h3>
                <p className="current-judge">Judging as: <strong>{judgeName || 'Not entered'}</strong></p>
              </>
            )}
          </div>

          {renderStepBody()}
        </div>
      </div>

      <div className="survey-footer">
        <button 
          type="button" 
          className="button secondary" 
          onClick={handleBack}
        >
          {currentStep === 0 ? '← Back to projects' : '← Back'}
        </button>

        <div className="footer-actions">
          <Link to="/leaderboard" className="button secondary survey-link">
            View leaderboard
          </Link>
          {currentStep < stepTotal - 1 ? (
            <button type="button" className="button primary" onClick={handleNext} disabled={!canAdvance}>
              Next →
            </button>
          ) : (
            <button type="submit" className="button primary" disabled={!selectedProject || !judgeName.trim()}>
              Submit score →
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default SubmitScore;
