import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { isImageFile } from '../utils/imageUtils';

/**
 * ImageUploader component provides a dropzone for uploading images
 * with drag and drop functionality.
 */
const ImageUploader = ({ onImageUpload, type, className }) => {
  // Handle file drop using react-dropzone
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Filter for image files
      const imageFile = acceptedFiles.find(isImageFile);
      
      if (imageFile) {
        onImageUpload(imageFile, type);
      } else {
        alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP).');
      }
    },
    [onImageUpload, type]
  );

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/webp': []
    }
  });

  return (
    <div 
      {...getRootProps()} 
      className={`dropzone ${isDragActive ? 'active' : ''} ${className || ''}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12 text-gray-400 mb-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        {isDragActive ? (
          <p className="text-primary">Drop the image here...</p>
        ) : (
          <div className="text-center">
            <p>Drag & drop an image here, or click to select</p>
            <p className="text-sm text-gray-500 mt-1">
              {type === 'foreground' 
                ? 'Upload the foreground image (with transparent background)' 
                : 'Upload the background image'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
