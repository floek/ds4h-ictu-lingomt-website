import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TranslationContext } from '../contexts/TranslationContext';
import Header from '../components/Header/Header';
import './ResultsPage.css';

const ResultsPage = () => {
  const [currentTranslation, setCurrentTranslation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { setInputText, setSourceLanguage, setTargetLanguage } = useContext(TranslationContext);

  useEffect(() => {
    loadCurrentTranslation();
  }, []);

  const loadCurrentTranslation = () => {
    try {
      const savedTranslation = localStorage.getItem('currentTranslation');
      if (savedTranslation) {
        setCurrentTranslation(JSON.parse(savedTranslation));
      } else {
        // If no current translation, redirect to home
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading translation:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTranslation = () => {
    navigate('/');
  };

  const handleRetranslate = () => {
    if (currentTranslation) {
      // Set up the form with current translation data
      setInputText(currentTranslation.originalText);
      setSourceLanguage({ 
        code: currentTranslation.sourceLang, 
        name: getLanguageName(currentTranslation.sourceLang) 
      });
      setTargetLanguage({ 
        code: currentTranslation.targetLang, 
        name: getLanguageName(currentTranslation.targetLang) 
      });
      navigate('/');
    }
  };

  const toggleFavorite = () => {
    if (currentTranslation) {
      const updatedTranslation = {
        ...currentTranslation,
        isFavorite: !currentTranslation.isFavorite
      };
      
      setCurrentTranslation(updatedTranslation);
      localStorage.setItem('currentTranslation', JSON.stringify(updatedTranslation));
      
      // Update in history as well
      const history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
      const updatedHistory = history.map(item =>
        item.id === updatedTranslation.id ? updatedTranslation : item
      );
      localStorage.setItem('translationHistory', JSON.stringify(updatedHistory));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  const getLanguageName = (code) => {
    const languages = {
      french: 'French',
      english: 'English', 
      ghomala: 'Ghomala',
      fulfulde: 'Fulfulde'
    };
    return languages[code] || code;
  };

  const getMatchTypeDisplay = (translation) => {
    if (!translation.matchType) return null;
    
    const matchTypes = {
      exact: { text: 'Exact Match', class: 'exact' },
      fuzzy: { text: `Fuzzy Match (${translation.fuzzyMatchScore}%)`, class: 'fuzzy' },
      machine: { text: 'Machine Translation', class: 'machine' }
    };
    
    return matchTypes[translation.matchType] || null;
  };

  if (isLoading) {
    return (
      <div className="container">
        <Header />
        <main className="main">
          <div className="loading-container">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading translation...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!currentTranslation) {
    return (
      <div className="container">
        <Header />
        <main className="main">
          <div className="error-container">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>No translation found</h2>
            <p>Please start a new translation.</p>
            <button onClick={handleNewTranslation} className="new-translation-btn">
              Start Translating
            </button>
          </div>
        </main>
      </div>
    );
  }

  const matchType = getMatchTypeDisplay(currentTranslation);

  return (
    <div className="container">
      <Header />
      
      <main className="main">
        <div className="results-header">
          <h1><i className="fas fa-language"></i> Translation Result</h1>
          <div className="language-pair-display">
            <span className="source-lang">{getLanguageName(currentTranslation.sourceLang)}</span>
            <i className="fas fa-arrow-right"></i>
            <span className="target-lang">{getLanguageName(currentTranslation.targetLang)}</span>
          </div>
        </div>

        <div className="translation-result">
          <div className="translation-card original">
            <div className="card-header">
              <h3>{getLanguageName(currentTranslation.sourceLang)}</h3>
              <button 
                onClick={() => copyToClipboard(currentTranslation.originalText)}
                className="copy-btn"
                title="Copy original text"
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
            <div className="card-content">
              <p>{currentTranslation.originalText}</p>
            </div>
          </div>

          <div className="translation-arrow">
            <i className="fas fa-arrow-down"></i>
          </div>

          <div className="translation-card translated">
            <div className="card-header">
              <h3>{getLanguageName(currentTranslation.targetLang)}</h3>
              <div className="card-actions">
                <button
                  onClick={() => copyToClipboard(currentTranslation.translatedText)}
                  className="copy-btn"
                  title="Copy translation"
                >
                  <i className="fas fa-copy"></i>
                </button>
                <button
                  onClick={toggleFavorite}
                  className={`favorite-btn ${currentTranslation.isFavorite ? 'active' : ''}`}
                  title={currentTranslation.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <i className={`fas fa-heart ${currentTranslation.isFavorite ? '' : 'far'}`}></i>
                </button>
              </div>
            </div>
            <div className="card-content">
              <p>{currentTranslation.translatedText}</p>
            </div>
            {matchType && (
              <div className="match-type-indicator">
                <span className={`match-badge ${matchType.class}`}>
                  {matchType.text}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="result-actions">
          <button onClick={handleRetranslate} className="retranslate-btn">
            <i className="fas fa-redo"></i> Translate Again
          </button>
          <button onClick={handleNewTranslation} className="new-translation-btn">
            <i className="fas fa-plus"></i> New Translation
          </button>
        </div>

        <div className="translation-info">
          <p className="timestamp">
            <i className="fas fa-clock"></i>
            Translated {new Date(currentTranslation.timestamp).toLocaleString()}
          </p>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;