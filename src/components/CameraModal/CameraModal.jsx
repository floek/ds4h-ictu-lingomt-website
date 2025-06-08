import React, { useEffect, useContext } from 'react';
import { useCamera } from '../../hooks/useCamera';
import { TranslationContext } from '../../contexts/TranslationContext';
import { ImageRecognitionService } from '../../services/ImageRecognitionService';

const CameraModal = () => {
  const {
    isModalOpen,
    capturedImage,
    isCapturing,
    videoRef,
    canvasRef,
    closeCamera,
    capturePhoto,
    retakePhoto,
    usePhoto
  } = useCamera();

  const { setInputText, sourceLanguage } = useContext(TranslationContext);
  const recognitionService = new ImageRecognitionService();

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeCamera();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isModalOpen, closeCamera]);

  const handleUsePhoto = async () => {
    const imageDataUrl = usePhoto();
    
    if (imageDataUrl) {
      try {
        // Show loading state
        setInputText('Analyzing image...');
        
        // Recognize text in the image
        const recognizedText = await recognitionService.recognizeImage(
          imageDataUrl,
          sourceLanguage.name
        );

        // Set the recognized text in the input
        if (recognizedText && recognizedText !== 'No text recognized in image') {
          setInputText(recognizedText);
        } else {
          setInputText('');
          alert('No text could be recognized in the image. Please try a different image.');
        }
      } catch (error) {
        console.error('Error analyzing image:', error);
        setInputText('');
        alert('Error analyzing image. Please try again.');
      }
    }
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      closeCamera();
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="modal show" onClick={handleModalClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Camera Access</h3>
          <span className="close-modal" onClick={closeCamera}>
            &times;
          </span>
        </div>
        <div className="modal-body">
          <p>
            CamMT would like to access your camera to capture an image for
            translation.
          </p>
          <div className="camera-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ display: isCapturing ? 'none' : 'block' }}
            />
            <canvas
              ref={canvasRef}
              style={{ 
                display: isCapturing ? 'block' : 'none',
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
          <div className="camera-controls">
            {!isCapturing ? (
              <button id="capture-btn" onClick={capturePhoto}>
                <i className="fas fa-camera"></i> Capture
              </button>
            ) : (
              <>
                <button id="retake-btn" onClick={retakePhoto}>
                  <i className="fas fa-redo"></i> Retake
                </button>
                <button id="use-photo-btn" onClick={handleUsePhoto}>
                  <i className="fas fa-check"></i> Use Photo
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraModal;