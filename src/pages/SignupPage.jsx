import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { AuthService } from '../services/AuthService';
import './AuthPages.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const authService = new AuthService();

  // ... rest of the component code remains the same
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
      const user = await authService.signUp(formData.email, formData.password, formData.username);
      
      showMessage('Signup successful! Redirecting to login...', 'success');
      setTimeout(() => {
        navigate('/auth/login');
      }, 1500);
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        showMessage('This email is already registered. Please use login instead.', 'error');
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } else {
        showMessage(error.message || 'Signup failed. Please try again.', 'error');
      }
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
          <p className="login-subtitle">Create an account</p>
        </div>

        <div className="auth-form">
          {message.text && (
            <div className="message-container">
              <p className={`message ${message.type}`}>{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>

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
              <label htmlFor="password">Password (min. 6 characters)</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                minLength="6"
                required
              />
            </div>

            <div className="form-group">
              <button 
                type="submit" 
                className="btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Signing up...
                  </>
                ) : (
                  'Signup'
                )}
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/auth/login" className="login-link">
                Log in
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

export default SignupPage;

/**
 * 
 * keppler
 * ndedilan1504@gmail.com
 * pK@%9DgcQB$VwwaB9P#e@YM2w?Gc2p4UE8Z9cYs27TYdncnpQdJK#2Rd?5SWM2kDw+C3hu4mDYcPy#kcD@!s#MWTzz3KYV#&!mPqjF#PC&&Qd$MXtGaHgY4WTn2wBhYW$vTBtYehYp6j3EkZWPmRf4HA#H9At@VYYK9U
 */