import { useState } from 'react';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const sitePassword = import.meta.env.VITE_SITE_PASSWORD;

    if (!sitePassword) {
      setError('Site password is not configured.');
      return;
    }

    if (password === sitePassword) {
      localStorage.setItem('auth', 'true');
      onLogin();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="eyebrow">BUHHS Hackathon 2026</p>
        <h1>Judge Login</h1>
        <p className="login-copy">
          Enter the judging password to access projects, score submissions, and the leaderboard.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Site password</span>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              autoComplete="current-password"
              autoFocus
            />
          </label>

          {error && <div className="toast error">{error}</div>}

          <button type="submit" className="button primary login-button">
            Enter judging console →
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;