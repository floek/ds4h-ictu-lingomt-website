import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header/Header';
import './HistoryPage.css';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // ... rest of the component remains the same
  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [history, searchQuery, filterBy]);

  const loadHistory = () => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem('translationHistory') || '[]');
      setHistory(savedHistory);
    } catch (error) {
      console.error('Error loading history:', error);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterHistory = () => {
    let filtered = [...history];

    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.translatedText.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (filterBy) {
      case 'favorites':
        filtered = filtered.filter(item => item.isFavorite);
        break;
      case 'recent':
        filtered = filtered.slice(0, 20);
        break;
      default:
        break;
    }

    setFilteredHistory(filtered);
  };

  const toggleFavorite = (id) => {
    const updatedHistory = history.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    setHistory(updatedHistory);
    localStorage.setItem('translationHistory', JSON.stringify(updatedHistory));
  };

  const deleteHistoryItem = (id) => {
    if (window.confirm('Are you sure you want to delete this translation?')) {
      const updatedHistory = history.filter(item => item.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem('translationHistory', JSON.stringify(updatedHistory));
    }
  };

  const clearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      setHistory([]);
      localStorage.removeItem('translationHistory');
    }
  };

  const retranslate = (item) => {
    localStorage.setItem('retranslateData', JSON.stringify({
      sourceLang: item.sourceLang,
      targetLang: item.targetLang,
      text: item.originalText
    }));
    navigate('/');
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
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

  if (isLoading) {
    return (
      <div className="container">
        <Header />
        <main className="main">
          <div className="loading-container">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading history...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <Header />
      
      <main className="main">
        <div className="history-header">
          <h1><i className="fas fa-history"></i> Translation History</h1>
          
          <div className="history-controls">
            <div className="search-container">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search translations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="filter-buttons">
              <button 
                className={filterBy === 'all' ? 'active' : ''}
                onClick={() => setFilterBy('all')}
              >
                All
              </button>
              <button 
                className={filterBy === 'recent' ? 'active' : ''}
                onClick={() => setFilterBy('recent')}
              >
                Recent
              </button>
              <button 
                className={filterBy === 'favorites' ? 'active' : ''}
                onClick={() => setFilterBy('favorites')}
              >
                <i className="fas fa-heart"></i> Favorites
              </button>
            </div>
            
            {history.length > 0 && (
              <button className="clear-history-btn" onClick={clearAllHistory}>
                <i className="fas fa-trash"></i> Clear All
              </button>
            )}
          </div>
        </div>

        <div className="history-content">
          {filteredHistory.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-history"></i>
              <h3>
                {searchQuery ? 'No matches found' : 
                 filterBy === 'favorites' ? 'No favorites yet' : 
                 'No translation history'}
              </h3>
              <p>
                {searchQuery ? 'Try adjusting your search terms' :
                 filterBy === 'favorites' ? 'Mark translations as favorites to see them here' :
                 'Your translation history will appear here'}
              </p>
              {!searchQuery && filterBy === 'all' && (
                <button onClick={() => navigate('/')} className="start-translating-btn">
                  Start Translating
                </button>
              )}
            </div>
          ) : (
            <div className="history-list">
              {filteredHistory.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-item-header">
                    <div className="language-pair">
                      <span className="source-lang">{getLanguageName(item.sourceLang)}</span>
                      <i className="fas fa-arrow-right"></i>
                      <span className="target-lang">{getLanguageName(item.targetLang)}</span>
                    </div>
                    <div className="item-actions">
                      <button
                        className={`favorite-btn ${item.isFavorite ? 'active' : ''}`}
                        onClick={() => toggleFavorite(item.id)}
                        title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <i className={`fas fa-heart ${item.isFavorite ? '' : 'far'}`}></i>
                      </button>
                      <button
                        className="retranslate-btn"
                        onClick={() => retranslate(item)}
                        title="Translate again"
                      >
                        <i className="fas fa-redo"></i>
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteHistoryItem(item.id)}
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="translation-content">
                    <div className="original-text">
                      <h4>Original:</h4>
                      <p>{item.originalText}</p>
                    </div>
                    <div className="translated-text">
                      <h4>Translation:</h4>
                      <p>{item.translatedText}</p>
                    </div>
                  </div>
                  
                  <div className="history-item-footer">
                    <span className="timestamp">{formatDate(item.timestamp)}</span>
                    {item.matchType && (
                      <span className={`match-type ${item.matchType}`}>
                        {item.matchType === 'exact' ? 'Exact match' :
                         item.matchType === 'fuzzy' ? `Fuzzy match (${item.fuzzyMatchScore}%)` :
                         'Machine translation'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;