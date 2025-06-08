import React, { useState, useContext, useRef, useEffect } from 'react';
import { TranslationContext } from '../../contexts/TranslationContext';

const VirtualKeyboard = ({ isVisible, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const { inputText, setInputText } = useContext(TranslationContext);
  const keyboardRef = useRef(null);

  const keyboardLayout = [
    ['p', 't', 'k', 'kp', 'b', 'd', 'g', 'gb', 'ɓ', 'ɗ', 'ƴ', 'pf', 'tf', 'ts', 'c', 'kf', 'bv'],
    ['dv', 'dz', 'j', 'gv', 'f', 's', 'sh', 'x', 'xf', 'h', 'v', 'z', 'zh', 'gh', 'hv'],
    ['m', 'n', 'ny', 'ŋ', 'ŋm', 'l', 'sl', 'zl', 'ʙ', 'vb', 'r', 'ẅ', 'y', 'w'],
    ['i', 'ɨ', 'ʉ', 'u', 'e', 'ø', 'ɤ', 'o', 'ɛ', 'œ', 'ə', 'ɔ', 'æ', 'a', 'ɑ', 'α'],
    ['␣']
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = keyboardRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleKeyPress = (char) => {
    if (char === '␣') {
      setInputText(inputText + ' ');
    } else {
      setInputText(inputText + char);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div
      ref={keyboardRef}
      className="keyboard-container"
      style={{
        display: 'flex',
        position: 'fixed',
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 1000
      }}
    >
      <div className="keyboard-content">
        <div 
          className="keyboard-header"
          onMouseDown={handleMouseDown}
        >
          <button className="close-keyboard" onClick={handleClose}>
            X
          </button>
        </div>

        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((char, charIndex) => (
              <button
                key={charIndex}
                className={`key ${char === '␣' ? 'space' : ''}`}
                onClick={() => handleKeyPress(char)}
              >
                {char}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualKeyboard;