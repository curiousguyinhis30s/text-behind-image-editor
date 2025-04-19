import React, { useRef, useCallback, useState, useEffect } from 'react';
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
    deselectTextElement,
    cloneTextElement,
    handleKeyboardShortcut,
    undo,
    redo,
    canUndo,
    canRedo
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
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  
  // Ref for the editor container
  const editorRef = useRef(null);
  
  // Set up keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      handleKeyboardShortcut(e);
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyboardShortcut]);
  
  // Toggle format panel visibility
  const toggleFormatPanel = () => {
    setShowFormatPanel(prev => !prev);
  };
  
  // Toggle keyboard shortcuts help
  const toggleKeyboardShortcuts = () => {
    setShowKeyboardShortcuts(prev => !prev);
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
      cloneTextElement(selectedElement.id);
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
        
        {/* Undo/Redo Buttons */}
        <div className="flex mt-2 space-x-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`px-3 py-1 rounded flex items-center ${canUndo ? 'bg-blue-100 hover:bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-400'}`}
            title="Undo (Ctrl+Z)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`px-3 py-1 rounded flex items-center ${canRedo ? 'bg-blue-100 hover:bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-400'}`}
            title="Redo (Ctrl+Shift+Z or Ctrl+Y)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            Redo
          </button>
          
          <button
            onClick={toggleKeyboardShortcuts}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 ml-auto"
          >
            Keyboard Shortcuts
          </button>
        </div>
      </div>
      
      {/* Keyboard Shortcuts Panel */}
      {showKeyboardShortcuts && (
        <div className="mb-4 p-4 bg-white rounded shadow-md border">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">Keyboard Shortcuts</h3>
            <button onClick={toggleKeyboardShortcuts} className="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="mb-1"><strong>Ctrl+Z</strong>: Undo</div>
              <div className="mb-1"><strong>Ctrl+Y</strong> or <strong>Ctrl+Shift+Z</strong>: Redo</div>
              <div className="mb-1"><strong>Delete</strong> or <strong>Backspace</strong>: Delete selected element</div>
            </div>
            <div>
              <div className="mb-1"><strong>Ctrl+D</strong>: Duplicate selected element</div>
              <div className="mb-1"><strong>Escape</strong>: Deselect element</div>
              <div className="mb-1"><strong>Ctrl+S</strong>: Quick export</div>
            </div>
          </div>
        </div>
      )}
      
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
            title="Clone Text (Ctrl+D)"
          >
            Clone Text
          </button>
        )}
        
        <div className="ml-auto flex gap-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            onClick={handleQuickExport}
            title="Quick Export (Ctrl+S)"
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
          Press the "Keyboard Shortcuts" button to see available shortcuts.
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
