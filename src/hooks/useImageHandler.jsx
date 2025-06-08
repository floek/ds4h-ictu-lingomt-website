import { useState } from 'react';
import { ImageRecognitionService } from '../services/ImageRecognitionService';

export const useImageHandler = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const recognitionService = new ImageRecognitionService();

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setIsLoading(true);
    setRecognizedText('');

    try {
      const recognizedText = await recognitionService.recognizeImage(file, 'french');
      setRecognizedText(recognizedText || 'No text recognized');
    } catch (error) {
      console.error('Error analyzing image:', error);
      setRecognizedText('Error analyzing image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setRecognizedText('');
  };

  return {
    previewImage,
    recognizedText,
    isLoading,
    handleImageUpload,
    removeImage
  };
};