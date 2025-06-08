import React from 'react';

const ImagePreview = ({ image, recognizedText, isLoading, onRemove }) => {
  if (!image) return null;

  return (
    <div className="image-preview-container" style={{ display: 'block' }}>
      <img
        src={image}
        alt="Preview"
        className="image-preview"
      />
      
      {isLoading && (
        <div className="loading-indicator" style={{ display: 'block' }}>
          <i className="fas fa-spinner fa-spin"></i> Analyzing image...
        </div>
      )}
      
      {recognizedText && !isLoading && (
        <div className="recognized-text">
          Recognized: {recognizedText}
        </div>
      )}
      
      <button 
        className="remove-image-btn"
        onClick={onRemove}
      >
        <i className="fas fa-times"></i> Remove image
      </button>
    </div>
  );
};

export default ImagePreview;