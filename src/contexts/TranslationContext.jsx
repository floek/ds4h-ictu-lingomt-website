import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TranslationService } from '../services/TranslationService';

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider = ({ children }) => {
  const [sourceLanguage, setSourceLanguage] = useState({ code: 'french', name: 'French' });
  const [targetLanguage, setTargetLanguage] = useState({ code: 'ghomala', name: 'Ghomala' });
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const translationService = new TranslationService();

  const swapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
  };

  const handleTranslation = async () => {
    if (!inputText.trim()) {
      alert('Please enter text to translate');
      return;
    }

    try {
      setIsLoading(true);
      
      const result = await translationService.translate(
        sourceLanguage.code,
        targetLanguage.code,
        inputText
      );

      const translation = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        sourceLang: sourceLanguage.code,
        targetLang: targetLanguage.code,
        originalText: inputText,
        translatedText: result.translation,
        matchType: result.matchType,
        fuzzyMatchScore: result.fuzzyMatchScore,
        matchedWord: result.matchedWord,
        isFavorite: false,
      };

      // Save current translation
      localStorage.setItem('currentTranslation', JSON.stringify(translation));

      // Add to history
      addToHistory(translation);

      // Navigate to results
      navigate('/results');
    } catch (error) {
      console.error('Translation error:', error);
      
      // Create a "not found" translation object for 404 errors
      if (error.message.includes('404') || error.message.includes('No translation found')) {
        const translation = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          sourceLang: sourceLanguage.code,
          targetLang: targetLanguage.code,
          originalText: inputText,
          translatedText: `No translation found for '${inputText}'`,
          matchType: 'none',
          suggestion: 'Consider contributing a translation',
          isFavorite: false,
        };

        localStorage.setItem('currentTranslation', JSON.stringify(translation));
        addToHistory(translation);
        navigate('/results');
      } else {
        alert('An error occurred during translation. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addToHistory = (translation) => {
    const history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
    history.unshift(translation);
    const updatedHistory = history.slice(0, 100);
    localStorage.setItem('translationHistory', JSON.stringify(updatedHistory));
  };

  const value = {
    sourceLanguage,
    targetLanguage,
    inputText,
    isLoading,
    setSourceLanguage,
    setTargetLanguage,
    setInputText,
    swapLanguages,
    handleTranslation
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

// Remove the problematic export at the end
// export { TranslationContext };