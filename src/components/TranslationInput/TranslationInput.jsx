import React, { useState, useContext, useRef } from 'react';
import { TranslationContext } from '../../contexts/TranslationContext';
import ImagePreview from '../ImagePreview/ImagePreview';
import VirtualKeyboard from '../VirtualKeyboard/VirtualKeyboard';
import { useImageHandler } from '../../hooks/useImageHandler';
import { useCamera } from '../../hooks/useCamera';

const TranslationInput = () => {
  const {
    inputText,
    setInputText,
    sourceLanguage,
    targetLanguage,
    handleTranslation
  } = useContext(TranslationContext);

  const [showKeyboard, setShowKeyboard] = useState(false);
  const fileInputRef = useRef(null);

  const {
    previewImage,
    recognizedText,
    isLoading,
    handleImageUpload,
    removeImage
  } = useImageHandler();

  const { openCamera } = useCamera();

  const handleTranslate = async () => {
    await handleTranslation();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTranslate();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    openCamera();
  };

  const handleKeyboardToggle = () => {
    setShowKeyboard(!showKeyboard);
  };

  const handleCloseKeyboard = () => {
    setShowKeyboard(false);
  };

  return (
    <>
      <div className="translation-input">
        <input
          type="text"
          id="translation-text"
          placeholder={`Translate from ${sourceLanguage.name} into ${targetLanguage.name}`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        
        <button 
          className="camera-btn" 
          title="Capture image"
          onClick={handleCameraClick}
        >
          <i className="fas fa-camera"></i>
        </button>
        
        <button 
          className="upload-btn" 
          title="Upload image"
          onClick={handleUploadClick}
        >
          <i className="fas fa-image"></i>
        </button>
        
        <button 
          className={`keyboard-btn ${showKeyboard ? 'active' : ''}`}
          onClick={handleKeyboardToggle}
        >
          <i className="fas fa-keyboard"></i>
        </button>
        
        <button 
          className="search-btn" 
          onClick={handleTranslate}
        >
          <i className="fas fa-search"></i>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </div>

      {previewImage && (
        <ImagePreview
          image={previewImage}
          recognizedText={recognizedText}
          isLoading={isLoading}
          onRemove={removeImage}
        />
      )}

      <VirtualKeyboard 
        isVisible={showKeyboard}
        onClose={handleCloseKeyboard}
      />
    </>
  );
};

export default TranslationInput;