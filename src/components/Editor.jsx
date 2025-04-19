import React, { useRef, useCallback, useState } from 'react';
import { saveAs } from 'file-saver';
import * as htmlToImage from 'html-to-image';
import TextLayer from './TextLayer';
import Toolbar from './Toolbar';
import ImageUploader from './ImageUploader';
import TextFormatPanel from './TextFormatPanel';
import ExportPreview from './ExportPreview';
import { captureCompositeImage } from '../utils/imageUtils';
import useTextElements from '../hooks/useTextElements';
import useImageHandler from '../hooks/useImageHandler';

/**
 * Editor is the main component that combines all the functionality
 * of the text-behind-image editor into a complete editing experience.
 */
const Editor = () => {
  // Use custom hooks for text and image management
  const {
    textElements,
    selectedElementId,
    selectedElement,
    addTextElement,
    updateTextElement,
    deleteTextElement,
    selectTextElement,
    deselectTextElement
  } = useTextElements();
  
  const {
    backgroundImage,
    foregroundImage,
    bgImageUrl,
    fgImageUrl,
    blendMode,
    setBlendMode,
    handleImageUpload,
    areImagesLoaded
  } = useImageHandler();
  
  // State for UI elements
  const [showFormatPanel, setShowFormatPanel] = useState(false);
  const [showExportPreview, setShowExportPreview] = useState(false);
  
  // Ref for the editor container
  const editorRef = useRef(null);
  
  // Toggle format panel visibility
  const toggleFormatPanel = () => {
    setShowFormatPanel(prev => !prev);
  };
  
  // Show export preview
  const openExportPreview = () => {
    setShowExportPreview(true);
  };
  
  // Hide export preview
  const closeExportPreview = () => {
    setShowExportPreview(false);
  };
  
  // Handle click outside of text elements to deselect
  const handleEditorClick = (e) => {
    if (e.target === editorRef.current) {
      deselectTextElement();
    }
  };
  
  // Change blend mode
  const handleBlendModeChange = (e) => {
    setBlendMode(e.target.value);
  };
  
  // Quick export image with text behind foreground
  const handleQuickExport = useCallback(async () => {
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
  
  // Clone the selected text element
  const handleCloneElement = () => {
    if (selectedElement) {
      const clonedElement = {
        ...selectedElement,
        id: `text-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        position: {
          x: selectedElement.position.x + 20,
          y: selectedElement.position.y + 20
        }
      };
      
      const newElements = [...textElements, clonedElement];
      textElements.push(clonedElement);
      selectTextElement(clonedElement.id);
    }
  };
  
  // Render image upload section if images aren't loaded
  if (!areImagesLoaded) {
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
          onUpdateElement={updateTextElement}
          onAddText={addTextElement}
          onDeleteElement={deleteTextElement}
        />
      </div>
      
      <div className="mb-4 flex items-center flex-wrap gap-2">
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
        
        {selectedElement && (
          <button
            className="ml-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            onClick={toggleFormatPanel}
          >
            {showFormatPanel ? 'Hide' : 'Show'} Advanced Options
          </button>
        )}
        
        {selectedElement && (
          <button
            className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition"
            onClick={handleCloneElement}
          >
            Clone Text
          </button>
        )}
        
        <div className="ml-auto flex gap-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            onClick={handleQuickExport}
          >
            Quick Export
          </button>
          
          <button
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-green-600 transition"
            onClick={openExportPreview}
          >
            Advanced Export
          </button>
        </div>
      </div>
      
      {/* Format Panel */}
      {showFormatPanel && selectedElement && (
        <div className="mb-4">
          <TextFormatPanel
            selectedElement={selectedElement}
            onUpdateElement={updateTextElement}
          />
        </div>
      )}
      
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
          onSelectElement={selectTextElement}
          onUpdateElement={updateTextElement}
          onDeleteElement={deleteTextElement}
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
      
      {/* Export Preview Modal */}
      {showExportPreview && (
        <ExportPreview
          textElements={textElements}
          bgImageUrl={bgImageUrl}
          fgImageUrl={fgImageUrl}
          blendMode={blendMode}
          onClose={closeExportPreview}
        />
      )}
    </div>
  );
};

export default Editor;
