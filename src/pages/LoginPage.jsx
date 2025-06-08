import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { AuthService } from '../services/AuthService';
import './AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const authService = new AuthService();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await authService.signIn(formData.email, formData.password);
      
      // Update auth context
      login(user.email);
      
      showMessage('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      showMessage(error.message || 'Login failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <header>
        <div className="nav-left">
          <button className="back-btn" onClick={handleBack}>
            <i className="fas fa-arrow-left"></i> Back
          </button>
        </div>
      </header>

      <main className="main">
        <div className="logo-container">
          <h1 className="app-name">CamMT</h1>
          <p className="login-subtitle">Log in to your account</p>
        </div>

        <div className="auth-form">
          {message.text && (
            <div className="message-container">
              <p className={`message ${message.type}`}>{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="forgot-password">
              <Link to="/auth/forgot-password">Forgot password?</Link>
            </div>

            <div className="button-group">
              <button 
                type="submit" 
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
              <Link to="/" className="continue-btn">
                Continue <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/auth/signup" className="signup-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer>
        <p>
          CamMT provides not only full translation experience intranslations,
          but also dictionaries for every existing pairs of languages - online
          and for free.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;