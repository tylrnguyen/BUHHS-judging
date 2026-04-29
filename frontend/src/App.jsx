import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Projects from './pages/Projects';
import SubmitScore from './pages/SubmitScore';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import { useState, useEffect } from 'react';

const navigation = [
  { to: '/', label: 'Projects' },
  { to: '/submit-score', label: 'Score a Project' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

const Shell = ({ children }) => {
  const location = useLocation();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">BUHHS Hackathon 2026</p>
          <h1>Judging Console</h1>
          <p className="hero-copy">
            Review one project at a time, move through the rubric with clear prompts,
            and submit scores without hunting for controls.
          </p>
        </div>
        <nav className="app-nav" aria-label="Primary">
          {navigation.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={location.pathname === item.to ? 'nav-link active' : 'nav-link'}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="app-main">{children}</main>
    </div>
  );
};

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('auth') === 'true') {
      setIsAuth(true);
    }
  }, []);

  if (!isAuth) {
    return <Login onLogin={() => setIsAuth(true)} />;
  }

  return (
    <Router>
      <Shell>
        <Routes>
          <Route path="/" element={<Projects />} />
          <Route path="/submit-score" element={<SubmitScore />} />
          <Route path="/submit-score/:projectId" element={<SubmitScore />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Shell>
    </Router>
  );
};

export default App;
