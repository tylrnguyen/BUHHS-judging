import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Projects from './pages/Projects';
import SubmitScore from './pages/SubmitScore';
import Leaderboard from './pages/Leaderboard';

const App = () => {
  return (
    <Router>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/">Projects</Link> |{' '}
        <Link to="/submit-score">Submit Score</Link> |{' '}
        <Link to="/leaderboard">Leaderboard</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/submit-score" element={<SubmitScore />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
};

export default App;
