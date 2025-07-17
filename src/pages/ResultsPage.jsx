import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/TranslationContext';
import Header from '../components/Header/Header';
import './ResultsPage.css';

const ResultsPage = () => {
  const [currentTranslation, setCurrentTranslation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [contributionData, setContributionData] = useState({
    sourceText: '',
    targetText: '',
    exampleSource: '',
    exampleTarget: ''
  });
  const [isSubmittingContribution, setIsSubmittingContribution] = useState(false);
  const [translationHistory, setTranslationHistory] = useState([]);
  
  const navigate = useNavigate();
  const { setInputText, setSourceLanguage, setTargetLanguage } = useTranslation();

  useEffect(() => {
    loadCurrentTranslation();
    loadTranslationHistory();
  }, []);

  const loadCurrentTranslation = () => {
    try {
      const savedTranslation = localStorage.getItem('currentTranslation');
      if (savedTranslation) {
        const translation = JSON.parse(savedTranslation);
        setCurrentTranslation(translation);
        
        // Pre-fill contribution form with current translation data
        setContributionData(prev => ({
          ...prev,
          sourceText: translation.originalText || ''
        }));
        
        // Check if this is a "not found" result and show contribution modal
        if (translation.translatedText && 
            (translation.translatedText.includes('No translation found') || 
             translation.matchType === 'none')) {
          setShowContributionModal(true);
        }
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading translation:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTranslationHistory = () => {
    try {
      const history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
      setTranslationHistory(history.slice(0, 5)); // Show last 5 translations
    } catch (error) {
      console.error('Error loading translation history:', error);
    }
  };

  const handleNewTranslation = () => {
    navigate('/');
  };

  const handleRetranslate = () => {
    if (currentTranslation) {
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

  const handleHistoryItemClick = (historyItem) => {
    // Set as current translation and reload
    localStorage.setItem('currentTranslation', JSON.stringify(historyItem));
    window.location.reload();
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
      // You could replace this with a toast notification
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  const handleContributionSubmit = async (e) => {
    e.preventDefault();
    
    if (!contributionData.sourceText.trim() || !contributionData.targetText.trim()) {
      alert('Please fill in both source and target text fields.');
      return;
    }

    setIsSubmittingContribution(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/contribute', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_text: contributionData.sourceText,
          target_text: contributionData.targetText,
          source_language: currentTranslation.sourceLang,
          target_language: currentTranslation.targetLang,
          source_example: contributionData.exampleSource,
          target_example: contributionData.exampleTarget,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      // Update current translation with the contributed translation
      const updatedTranslation = {
        ...currentTranslation,
        translatedText: contributionData.targetText,
        matchType: 'contributed',
        isContributed: true
      };

      setCurrentTranslation(updatedTranslation);
      localStorage.setItem('currentTranslation', JSON.stringify(updatedTranslation));

      // Close modal and show success message
      setShowContributionModal(false);
      alert('Thank you for your contribution! It has been submitted for review.');

    } catch (error) {
      console.error('Error submitting contribution:', error);
      alert('Error submitting your translation. Please try again.');
    } finally {
      setIsSubmittingContribution(false);
    }
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
      machine: { text: 'Machine Translation', class: 'machine' },
      contributed: { text: 'Community Contribution', class: 'contributed' },
      none: { text: 'No Translation Found', class: 'none' }
    };
    
    return matchTypes[translation.matchType] || null;
  };

  const isTranslationNotFound = () => {
    return currentTranslation && 
           (currentTranslation.translatedText?.includes('No translation found') || 
            currentTranslation.matchType === 'none');
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
      
      <main className="main results-main">
       
        {/* Main results area */}
        <div className="results-container">
          <div className="results-header">
            <h1>
              <i className="fas fa-language"></i> 
              Translation of "{currentTranslation.originalText}"
            </h1>
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

            <div className={`translation-card translated ${isTranslationNotFound() ? 'no-result' : ''}`}>
              <div className="card-header">
                <h3>{getLanguageName(currentTranslation.targetLang)}</h3>
                {!isTranslationNotFound() && (
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
                )}
              </div>
              <div className="card-content">
                {isTranslationNotFound() ? (
                  <div className="no-translation-content">
                    <p>
                      <i className="fas fa-exclamation-circle"></i>
                      No translation found for "{currentTranslation.originalText}"
                    </p>
                    <p className="suggestion-text">
                      Maybe you can contribute a translation? Check automatic translation, 
                      translation memory or help build our community dictionary.
                    </p>
                  </div>
                ) : (
                  <p>{currentTranslation.translatedText}</p>
                )}
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

          {/* Contribution section */}
          {isTranslationNotFound() && (
            <div className="add-translation-section">
              <button 
                onClick={() => setShowContributionModal(true)}
                className="add-translation-btn"
              >
                <i className="fas fa-plus"></i> ADD TRANSLATION
              </button>
            </div>
          )}

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
        </div>

         {/* Sidebar for search and history */}
        <div className="search-sidebar">
          <h3 className="search-sidebar-title">
            🔍 Find Results • 🕒 Previous Searches • 🤝 Contribute
          </h3>
          
          <div className="search-input-container">
            <input
              type="text"
              value={currentTranslation.originalText}
              placeholder="Search for translations..."
              readOnly
              className="search-input-readonly"
            />
          </div>

          <div className="recent-searches">
            <h4>Recent Searches</h4>
            {translationHistory.length > 0 ? (
              translationHistory.map((item) => (
                <div 
                  key={item.id} 
                  className="search-item"
                  onClick={() => handleHistoryItemClick(item)}
                >
                  <div className="search-text">{item.originalText}</div>
                  <div className="search-langs">
                    {getLanguageName(item.sourceLang)} → {getLanguageName(item.targetLang)}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-recent">No recent searches</p>
            )}
          </div>
        </div>

      </main>

      {/* Contribution Modal */}
      {showContributionModal && (
        <div className="modal-overlay" onClick={() => setShowContributionModal(false)}>
          <div className="contribution-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-hands-helping"></i>
                Add New Translation
              </h2>
              <button 
                className="modal-close"
                onClick={() => setShowContributionModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="language-display">
                <span className="lang-badge source">
                  {getLanguageName(currentTranslation.sourceLang)}
                </span>
                <i className="fas fa-arrow-right"></i>
                <span className="lang-badge target">
                  {getLanguageName(currentTranslation.targetLang)}
                </span>
              </div>

              <form onSubmit={handleContributionSubmit}>
                <div className="form-group">
                  <label htmlFor="sourceText">Source Text:</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="sourceText"
                      value={contributionData.sourceText}
                      onChange={(e) => setContributionData(prev => ({
                        ...prev,
                        sourceText: e.target.value
                      }))}
                      required
                      maxLength={500}
                    />
                    <span className="char-count">
                      {contributionData.sourceText.length}/500
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="targetText">Translation:</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="targetText"
                      value={contributionData.targetText}
                      onChange={(e) => setContributionData(prev => ({
                        ...prev,
                        targetText: e.target.value
                      }))}
                      required
                      maxLength={500}
                      placeholder={`Enter translation in ${getLanguageName(currentTranslation.targetLang)}`}
                    />
                    <span className="char-count">
                      {contributionData.targetText.length}/500
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="exampleSource">Example Sentence (Optional):</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="exampleSource"
                      value={contributionData.exampleSource}
                      onChange={(e) => setContributionData(prev => ({
                        ...prev,
                        exampleSource: e.target.value
                      }))}
                      maxLength={500}
                      placeholder={`Example in ${getLanguageName(currentTranslation.sourceLang)}`}
                    />
                    <span className="char-count">
                      {contributionData.exampleSource.length}/500
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="exampleTarget">Example Translation (Optional):</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="exampleTarget"
                      value={contributionData.exampleTarget}
                      onChange={(e) => setContributionData(prev => ({
                        ...prev,
                        exampleTarget: e.target.value
                      }))}
                      maxLength={500}
                      placeholder={`Example in ${getLanguageName(currentTranslation.targetLang)}`}
                    />
                    <span className="char-count">
                      {contributionData.exampleTarget.length}/500
                    </span>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowContributionModal(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingContribution}
                    className="submit-btn"
                  >
                    {isSubmittingContribution ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        Submit Translation
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;