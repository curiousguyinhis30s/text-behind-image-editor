import { useState, useCallback, useEffect } from 'react';
import { createObjectURL, revokeObjectURL } from '../utils/imageUtils';

/**
 * Custom hook for managing background and foreground images
 * Handles loading, storing, and cleaning up image URLs
 */
const useImageHandler = () => {
  // State for image files and URLs
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [foregroundImage, setForegroundImage] = useState(null);
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [fgImageUrl, setFgImageUrl] = useState('');
  
  // State for blend mode
  const [blendMode, setBlendMode] = useState('multiply');

  // Clean up object URLs when component unmounts or when URLs change
  useEffect(() => {
    return () => {
      if (bgImageUrl) {
        revokeObjectURL(bgImageUrl);
      }
      if (fgImageUrl) {
        revokeObjectURL(fgImageUrl);
      }
    };
  }, [bgImageUrl, fgImageUrl]);

  // Handle background image upload
  const handleBackgroundImageUpload = useCallback((file) => {
    if (bgImageUrl) {
      revokeObjectURL(bgImageUrl);
    }
    const url = createObjectURL(file);
    setBackgroundImage(file);
    setBgImageUrl(url);
  }, [bgImageUrl]);

  // Handle foreground image upload
  const handleForegroundImageUpload = useCallback((file) => {
    if (fgImageUrl) {
      revokeObjectURL(fgImageUrl);
    }
    const url = createObjectURL(file);
    setForegroundImage(file);
    setFgImageUrl(url);
  }, [fgImageUrl]);

  // Handle image upload based on type
  const handleImageUpload = useCallback((file, type) => {
    if (type === 'background') {
      handleBackgroundImageUpload(file);
    } else if (type === 'foreground') {
      handleForegroundImageUpload(file);
    }
  }, [handleBackgroundImageUpload, handleForegroundImageUpload]);

  // Reset all images
  const resetImages = useCallback(() => {
    if (bgImageUrl) {
      revokeObjectURL(bgImageUrl);
    }
    if (fgImageUrl) {
      revokeObjectURL(fgImageUrl);
    }
    setBackgroundImage(null);
    setForegroundImage(null);
    setBgImageUrl('');
    setFgImageUrl('');
  }, [bgImageUrl, fgImageUrl]);

  // Check if both images are loaded
  const areImagesLoaded = Boolean(backgroundImage && foregroundImage);

  return {
    backgroundImage,
    foregroundImage,
    bgImageUrl,
    fgImageUrl,
    blendMode,
    setBlendMode,
    handleImageUpload,
    resetImages,
    areImagesLoaded
  };
};

export default useImageHandler;
