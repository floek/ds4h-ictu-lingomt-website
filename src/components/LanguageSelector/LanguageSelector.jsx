import React, { useState, useContext, useRef, useEffect } from 'react';
import { TranslationContext } from '../../contexts/TranslationContext';

const LanguageSelector = () => {
  const {
    sourceLanguage,
    targetLanguage,
    setSourceLanguage,
    setTargetLanguage,
    swapLanguages
  } = useContext(TranslationContext);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const sourceLanguages = [
    { code: 'french', name: 'French' },
    { code: 'english', name: 'English' }
  ];

  const targetLanguages = [
    { code: 'ghomala', name: 'Ghomala' },
    { code: 'fulfulde', name: 'Fulfulde' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleLanguageSelect = (language, type) => {
    if (type === 'source') {
      setSourceLanguage(language);
    } else {
      setTargetLanguage(language);
    }
    setActiveDropdown(null);
  };

  return (
    <div className="language-selector" ref={dropdownRef}>
      {/* Source Language Dropdown */}
      <div className={`dropdown ${activeDropdown === 'source' ? 'active' : ''}`}>
        <button 
          className="dropdown-btn"
          onClick={() => handleDropdownToggle('source')}
        >
          {sourceLanguage.name} <i className="fas fa-chevron-down"></i>
        </button>
        <div className="dropdown-content">
          {sourceLanguages.map((lang) => (
            <a
              key={lang.code}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLanguageSelect(lang, 'source');
              }}
            >
              {lang.name}
            </a>
          ))}
        </div>
      </div>

      {/* Swap Button */}
      <button className="swap-btn" onClick={swapLanguages}>
        <i className="fas fa-exchange-alt"></i>
      </button>

      {/* Target Language Dropdown */}
      <div className={`dropdown ${activeDropdown === 'target' ? 'active' : ''}`}>
        <button 
          className="dropdown-btn"
          onClick={() => handleDropdownToggle('target')}
        >
          {targetLanguage.name} <i className="fas fa-chevron-down"></i>
        </button>
        <div className="dropdown-content">
          {targetLanguages.map((lang) => (
            <a
              key={lang.code}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLanguageSelect(lang, 'target');
              }}
            >
              {lang.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;