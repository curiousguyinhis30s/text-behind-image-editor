import React, { useState, useRef, useCallback } from 'react';
import { saveAs } from 'file-saver';
import * as htmlToImage from 'html-to-image';
import TextLayer from './TextLayer';
import Toolbar from './Toolbar';
import ImageUploader from './ImageUploader';
import { createObjectURL, revokeObjectURL, captureCompositeImage } from '../utils/imageUtils';
import { createNewTextElement } from '../utils/textUtils';

/**
 * Editor is the main component that combines all the functionality
 * of the text-behind-image editor into a complete editing experience.
 */
const Editor = () => {
  // State for images
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [foregroundImage, setForegroundImage] = useState(null);
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [fgImageUrl, setFgImageUrl] = useState('');
  
  // State for text elements
  const [textElements, setTextElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  
  // State for blend mode
  const [blendMode, setBlendMode] = useState('multiply');
  
  // Ref for the editor container
  const editorRef = useRef(null);
  
  // Get selected text element
  const selectedElement = textElements.find(el => el.id === selectedElementId);
  
  // Handle background image upload
  const handleBackgroundImageUpload = (file) => {
    if (bgImageUrl) {
      revokeObjectURL(bgImageUrl);
    }
    const url = createObjectURL(file);
    setBackgroundImage(file);
    setBgImageUrl(url);
  };
  
  // Handle foreground image upload
  const handleForegroundImageUpload = (file) => {
    if (fgImageUrl) {
      revokeObjectURL(fgImageUrl);
    }
    const url = createObjectURL(file);
    setForegroundImage(file);
    setFgImageUrl(url);
  };
  
  // Handle image upload based on type
  const handleImageUpload = (file, type) => {
    if (type === 'background') {
      handleBackgroundImageUpload(file);
    } else if (type === 'foreground') {
      handleForegroundImageUpload(file);
    }
  };
  
  // Add new text element
  const handleAddText = () => {
    const newTextElement = createNewTextElement();
    setTextElements([...textElements, newTextElement]);
    setSelectedElementId(newTextElement.id);
  };
  
  // Update text element
  const handleUpdateElement = (updatedElement) => {
    setTextElements(
      textElements.map(el => (el.id === updatedElement.id ? updatedElement : el))
    );
  };
  
  // Delete text element
  const handleDeleteElement = (id) => {
    setTextElements(textElements.filter(el => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };
  
  // Handle click outside of text elements to deselect
  const handleEditorClick = (e) => {
    if (e.target === editorRef.current) {
      setSelectedElementId(null);
    }
  };
  
  // Change blend mode
  const handleBlendModeChange = (e) => {
    setBlendMode(e.target.value);
  };
  
  // Export image with text behind foreground
  const handleExport = useCallback(async () => {
    if (!editorRef.current || !backgroundImage || !foregroundImage) {
      alert('Please upload both background and foreground images before exporting.');
      return;
    }
    
    try {
      const blob = await captureCompositeImage(editorRef.current, htmlToImage);
      saveAs(blob, 'text-behind-image.png');
    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Failed to export image. Please try again.');
    }
  }, [backgroundImage, foregroundImage]);
  
  // Render image upload section if images aren't loaded
  if (!backgroundImage || !foregroundImage) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Text Behind Image Editor</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Step 1: Upload Background Image</h2>
            <ImageUploader
              onImageUpload={handleImageUpload}
              type="background"
              className={backgroundImage ? 'border-green-500' : ''}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Step 2: Upload Foreground Image</h2>
            <p className="text-sm text-gray-500 mb-2">
              For best results, use an image with transparent background (PNG)
            </p>
            <ImageUploader
              onImageUpload={handleImageUpload}
              type="foreground"
              className={foregroundImage ? 'border-green-500' : ''}
            />
          </div>
        </div>
      </div>
    );
  }
  
  // Render editor once images are loaded
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Text Behind Image Editor</h1>
      
      <div className="mb-6">
        <Toolbar
          selectedElement={selectedElement}
          onUpdateElement={handleUpdateElement}
          onAddText={handleAddText}
          onDeleteElement={handleDeleteElement}
        />
      </div>
      
      <div className="mb-4 flex items-center">
        <label htmlFor="blendMode" className="mr-2">Foreground Blend Mode:</label>
        <select
          id="blendMode"
          value={blendMode}
          onChange={handleBlendModeChange}
          className="border rounded px-2 py-1"
        >
          <option value="multiply">Multiply</option>
          <option value="screen">Screen</option>
          <option value="overlay">Overlay</option>
          <option value="normal">Normal</option>
        </select>
        
        <button
          className="ml-auto bg-secondary text-white px-4 py-2 rounded hover:bg-green-600 transition"
          onClick={handleExport}
        >
          Export Image
        </button>
      </div>
      
      <div 
        ref={editorRef}
        className="image-container border rounded overflow-hidden"
        onClick={handleEditorClick}
      >
        {bgImageUrl && (
          <img
            src={bgImageUrl}
            alt="Background"
            className="background-image"
          />
        )}
        
        <TextLayer
          textElements={textElements}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
        />
        
        {fgImageUrl && (
          <img
            src={fgImageUrl}
            alt="Foreground"
            className={`foreground-image ${blendMode !== 'normal' ? `blend-${blendMode}` : ''}`}
          />
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>
          <strong>Instructions:</strong> Add text elements using the "Add Text" button. 
          Click on a text element to select it. Double-click to edit its content. 
          Use the toolbar to format selected text. When finished, click "Export Image".
        </p>
        <p className="mt-2">
          <strong>Tip:</strong> For best results, use a foreground image with transparent background (PNG format).
        </p>
      </div>
    </div>
  );
};

export default Editor;
