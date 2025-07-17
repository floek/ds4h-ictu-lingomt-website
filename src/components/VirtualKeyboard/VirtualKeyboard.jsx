import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import './VirtualKeyboard.css';

const VirtualKeyboard = ({ isVisible, onClose }) => {
  const [activeKey, setActiveKey] = useState(null);
  const [keyboardSize, setKeyboardSize] = useState('medium');
  const [currentLayout, setCurrentLayout] = useState('ghomala');
  const [isMinimized, setIsMinimized] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showPreview, setShowPreview] = useState(true);
  
  const { inputText, setInputText } = useTranslation();
  const textAreaRef = useRef(null);
  const previewRef = useRef(null);

  // Different keyboard layouts for different languages
  const keyboardLayouts = {
    ghomala: [
      ['p', 't', 'k', 'kp', 'b', 'd', 'g', 'gb', 'ɓ', 'ɗ', 'ƴ'],
      ['pf', 'tf', 'ts', 'c', 'kf', 'bv', 'dv', 'dz', 'j', 'gv'],
      ['f', 's', 'sh', 'x', 'xf', 'h', 'v', 'z', 'zh', 'gh', 'hv'],
      ['m', 'n', 'ny', 'ŋ', 'ŋm', 'l', 'sl', 'zl', 'ʙ', 'vb'],
      ['r', 'ẅ', 'y', 'w', '␣', 'Backspace', 'Enter']
    ],
    vowels: [
      ['i', 'ɨ', 'ʉ', 'u', 'e', 'ø', 'ɤ', 'o'],
      ['ɛ', 'œ', 'ə', 'ɔ', 'æ', 'a', 'ɑ', 'α'],
      ['Space', 'Backspace', 'Enter']
    ],
    numbers: [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      ['.', ',', '!', '?', ';', ':', '-', '(', ')', '"'],
      ['Space', 'Backspace', 'Enter']
    ]
  };

  // Smart positioning based on screen size and input field location
  useEffect(() => {
    if (isVisible && textAreaRef.current) {
      const inputElement = document.querySelector('.translation-input textarea, .translation-input input');
      if (inputElement) {
        const rect = inputElement.getBoundingClientRect();
        const keyboardHeight = 300; // Approximate keyboard height
        
        // Position keyboard above input if there's space, otherwise below
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        if (spaceBelow < keyboardHeight && spaceAbove > keyboardHeight) {
          // Position above
          document.documentElement.style.setProperty('--keyboard-position', 'above');
        } else {
          // Position below (default)
          document.documentElement.style.setProperty('--keyboard-position', 'below');
        }
      }
    }
  }, [isVisible]);

  // Auto-scroll preview to cursor position
  useEffect(() => {
    if (previewRef.current && showPreview) {
      const preview = previewRef.current;
      const textBeforeCursor = inputText.slice(0, cursorPosition);
      const lines = textBeforeCursor.split('\n');
      const currentLine = lines.length;
      
      // Scroll to current line if needed
      const lineHeight = 24; // Approximate line height
      const scrollTop = Math.max(0, (currentLine - 2) * lineHeight);
      preview.scrollTop = scrollTop;
    }
  }, [cursorPosition, inputText, showPreview]);

  // Handle key press with cursor position awareness
  const handleKeyPress = (char) => {
    setActiveKey(char);
    setTimeout(() => setActiveKey(null), 150);

    const currentText = inputText;
    let newText = currentText;
    let newCursorPos = cursorPosition;

    switch (char) {
      case '␣':
      case 'Space':
        newText = currentText.slice(0, cursorPosition) + ' ' + currentText.slice(cursorPosition);
        newCursorPos = cursorPosition + 1;
        break;
      
      case 'Backspace':
        if (cursorPosition > 0) {
          newText = currentText.slice(0, cursorPosition - 1) + currentText.slice(cursorPosition);
          newCursorPos = cursorPosition - 1;
        }
        break;
      
      case 'Enter':
        newText = currentText.slice(0, cursorPosition) + '\n' + currentText.slice(cursorPosition);
        newCursorPos = cursorPosition + 1;
        break;
      
      default:
        newText = currentText.slice(0, cursorPosition) + char + currentText.slice(cursorPosition);
        newCursorPos = cursorPosition + char.length;
        break;
    }

    setInputText(newText);
    setCursorPosition(newCursorPos);

    // Add haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  // Handle cursor position updates from input field
  // const handleCursorChange = (e) => {
  //   setCursorPosition(e.target.selectionStart || 0);
  // };

  // Toggle keyboard size
  const toggleSize = () => {
    const sizes = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(keyboardSize);
    setKeyboardSize(sizes[(currentIndex + 1) % sizes.length]);
  };

  // Switch between layouts
  const switchLayout = (layout) => {
    setCurrentLayout(layout);
  };

  // Clear all text
  const clearText = () => {
    setInputText('');
    setCursorPosition(0);
  };

  // Render text with cursor
  const renderPreviewText = () => {
    if (!inputText && cursorPosition === 0) {
      return <span className="placeholder-text">Start typing...</span>;
    }

    const beforeCursor = inputText.slice(0, cursorPosition);
    const afterCursor = inputText.slice(cursorPosition);
    
    return (
      <>
        {beforeCursor}
        <span className="cursor-indicator">|</span>
        {afterCursor}
      </>
    );
  };

  if (!isVisible) return null;

  const currentKeys = keyboardLayouts[currentLayout] || keyboardLayouts.ghomala;

  return (
    <>
      {/* Overlay for better focus */}
      <div className="keyboard-overlay" onClick={onClose} />
      
      <div className={`virtual-keyboard ${keyboardSize} ${isMinimized ? 'minimized' : ''}`}>
        {/* Enhanced Header */}
        <div className="keyboard-header">
          <div className="keyboard-title">
            <span className="keyboard-icon">⌨️</span>
            Virtual Keyboard
          </div>
          
          <div className="keyboard-controls">
            {/* Layout Switcher */}
            <div className="layout-switcher">
              <button 
                className={currentLayout === 'ghomala' ? 'active' : ''}
                onClick={() => switchLayout('ghomala')}
                title="Ghomala Characters"
              >
                ɓɗ
              </button>
              <button 
                className={currentLayout === 'vowels' ? 'active' : ''}
                onClick={() => switchLayout('vowels')}
                title="Vowels & Special"
              >
                əɔ
              </button>
              <button 
                className={currentLayout === 'numbers' ? 'active' : ''}
                onClick={() => switchLayout('numbers')}
                title="Numbers & Symbols"
              >
                123
              </button>
            </div>

            {/* Utility Controls */}
            <button 
              onClick={() => setShowPreview(!showPreview)} 
              className={`preview-toggle ${showPreview ? 'active' : ''}`} 
              title="Toggle Preview"
            >
              👁️
            </button>
            <button onClick={toggleSize} className="size-toggle" title="Toggle Size">
              📏
            </button>
            <button onClick={() => setIsMinimized(!isMinimized)} className="minimize-btn" title="Minimize">
              {isMinimized ? '⬆️' : '⬇️'}
            </button>
            <button onClick={onClose} className="close-btn" title="Close">
              ✕
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Live Preview Section */}
            {showPreview && (
              <div className="text-preview-section">
                <div className="preview-header">
                  <span className="preview-title">
                    <span className="preview-icon">📝</span>
                    Live Preview
                  </span>
                  <div className="preview-stats">
                    <span className="char-count">{inputText.length} chars</span>
                    <span className="word-count">{inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words</span>
                  </div>
                </div>
                <div className="text-preview" ref={previewRef}>
                  <div className="preview-content">
                    {renderPreviewText()}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="quick-actions">
              <button onClick={clearText} className="quick-action clear" title="Clear All">
                🗑️ Clear
              </button>
              <button 
                onClick={() => handleKeyPress('Backspace')} 
                className="quick-action backspace"
                title="Backspace"
              >
                ⌫ Delete
              </button>
              <span className="cursor-position">
                Position: {cursorPosition}/{inputText.length}
              </span>
            </div>

            {/* Keyboard Keys */}
            <div className="keyboard-body">
              {currentKeys.map((row, rowIndex) => (
                <div key={rowIndex} className="keyboard-row">
                  {row.map((char, charIndex) => {
                    const isSpecialKey = ['Space', 'Backspace', 'Enter', '␣'].includes(char);
                    const isActive = activeKey === char;
                    
                    return (
                      <button
                        key={charIndex}
                        className={`
                          keyboard-key 
                          ${isSpecialKey ? 'special-key' : ''} 
                          ${char === '␣' || char === 'Space' ? 'space-key' : ''}
                          ${char === 'Backspace' ? 'backspace-key' : ''}
                          ${char === 'Enter' ? 'enter-key' : ''}
                          ${isActive ? 'active' : ''}
                        `}
                        onClick={() => handleKeyPress(char)}
                        onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                      >
                        {char === '␣' || char === 'Space' ? '___' : 
                         char === 'Backspace' ? '⌫' :
                         char === 'Enter' ? '↵' : char}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Enhanced Footer */}
            <div className="keyboard-footer">
              <div className="word-suggestions">
                <small>💡 Tip: Use the preview to see your text in real-time</small>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default VirtualKeyboard;