import React from 'react';

/**
 * Toolbar component provides controls for formatting text elements,
 * such as font style, color, size, and alignment.
 */
const Toolbar = ({ selectedElement, onUpdateElement, onAddText, onDeleteElement }) => {
  // No element selected, render minimal toolbar
  if (!selectedElement) {
    return (
      <div className="toolbar">
        <button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={onAddText}
        >
          Add Text
        </button>
        <div className="text-gray-500">
          Select a text element to edit its properties
        </div>
      </div>
    );
  }

  // Update text element properties
  const handlePropertyChange = (property, value) => {
    onUpdateElement({
      ...selectedElement,
      [property]: value
    });
  };

  // Font size control
  const handleFontSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    handlePropertyChange('fontSize', size);
  };

  // Font family control
  const handleFontFamilyChange = (e) => {
    handlePropertyChange('fontFamily', e.target.value);
  };

  // Text color control
  const handleColorChange = (e) => {
    handlePropertyChange('color', e.target.value);
  };

  // Text alignment control
  const handleAlignmentChange = (alignment) => {
    handlePropertyChange('textAlign', alignment);
  };

  // Font weight control
  const toggleBold = () => {
    const newWeight = selectedElement.fontWeight === 'bold' ? 'normal' : 'bold';
    handlePropertyChange('fontWeight', newWeight);
  };

  // Font style control
  const toggleItalic = () => {
    const newStyle = selectedElement.fontStyle === 'italic' ? 'normal' : 'italic';
    handlePropertyChange('fontStyle', newStyle);
  };

  // Text decoration control
  const toggleUnderline = () => {
    const newDecoration = selectedElement.textDecoration === 'underline' ? 'none' : 'underline';
    handlePropertyChange('textDecoration', newDecoration);
  };

  // Opacity control
  const handleOpacityChange = (e) => {
    const opacity = parseFloat(e.target.value);
    handlePropertyChange('opacity', opacity);
  };

  // Z-index control
  const handleZIndexChange = (e) => {
    const zIndex = parseInt(e.target.value, 10);
    handlePropertyChange('zIndex', zIndex);
  };

  // Rotation control
  const handleRotationChange = (e) => {
    const rotation = parseInt(e.target.value, 10);
    handlePropertyChange('rotation', rotation);
  };

  // Delete text element
  const handleDelete = () => {
    onDeleteElement(selectedElement.id);
  };

  return (
    <div className="toolbar flex flex-wrap items-center">
      <button
        className="bg-primary text-white px-3 py-1 rounded hover:bg-blue-600 transition mr-2"
        onClick={onAddText}
      >
        Add Text
      </button>
      
      {/* Font Family */}
      <select
        value={selectedElement.fontFamily}
        onChange={handleFontFamilyChange}
        className="border rounded px-2 py-1 mr-2"
      >
        <option value="Arial">Arial</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
        <option value="Georgia">Georgia</option>
        <option value="Verdana">Verdana</option>
        <option value="Impact">Impact</option>
      </select>
      
      {/* Font Size */}
      <div className="flex items-center mr-2">
        <label htmlFor="fontSize" className="mr-1">Size:</label>
        <input
          id="fontSize"
          type="number"
          min="8"
          max="200"
          value={selectedElement.fontSize}
          onChange={handleFontSizeChange}
          className="border rounded w-16 px-2 py-1"
        />
      </div>
      
      {/* Color Picker */}
      <div className="color-picker mr-2">
        <input
          type="color"
          value={selectedElement.color}
          onChange={handleColorChange}
          title="Text Color"
        />
      </div>
      
      {/* Text Style Buttons */}
      <div className="flex mr-2">
        <button
          className={`px-2 py-1 border rounded-l ${selectedElement.fontWeight === 'bold' ? 'bg-gray-200' : ''}`}
          onClick={toggleBold}
          title="Bold"
        >
          B
        </button>
        <button
          className={`px-2 py-1 border-t border-b border-r ${selectedElement.fontStyle === 'italic' ? 'bg-gray-200' : ''}`}
          onClick={toggleItalic}
          title="Italic"
        >
          I
        </button>
        <button
          className={`px-2 py-1 border-t border-b border-r rounded-r ${selectedElement.textDecoration === 'underline' ? 'bg-gray-200' : ''}`}
          onClick={toggleUnderline}
          title="Underline"
        >
          U
        </button>
      </div>
      
      {/* Text Alignment */}
      <div className="flex mr-2">
        <button
          className={`px-2 py-1 border rounded-l ${selectedElement.textAlign === 'left' ? 'bg-gray-200' : ''}`}
          onClick={() => handleAlignmentChange('left')}
          title="Align Left"
        >
          ←
        </button>
        <button
          className={`px-2 py-1 border-t border-b border-r ${selectedElement.textAlign === 'center' ? 'bg-gray-200' : ''}`}
          onClick={() => handleAlignmentChange('center')}
          title="Align Center"
        >
          ↔
        </button>
        <button
          className={`px-2 py-1 border-t border-b border-r rounded-r ${selectedElement.textAlign === 'right' ? 'bg-gray-200' : ''}`}
          onClick={() => handleAlignmentChange('right')}
          title="Align Right"
        >
          →
        </button>
      </div>
      
      {/* Opacity Slider */}
      <div className="flex items-center mr-2">
        <label htmlFor="opacity" className="mr-1">Opacity:</label>
        <input
          id="opacity"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={selectedElement.opacity}
          onChange={handleOpacityChange}
          className="w-24"
        />
      </div>
      
      {/* Z-Index Control */}
      <div className="flex items-center mr-2">
        <label htmlFor="zIndex" className="mr-1">Layer:</label>
        <input
          id="zIndex"
          type="number"
          min="1"
          max="10"
          value={selectedElement.zIndex}
          onChange={handleZIndexChange}
          className="border rounded w-16 px-2 py-1"
        />
      </div>
      
      {/* Rotation Control */}
      <div className="flex items-center mr-2">
        <label htmlFor="rotation" className="mr-1">Rotate:</label>
        <input
          id="rotation"
          type="range"
          min="0"
          max="360"
          value={selectedElement.rotation}
          onChange={handleRotationChange}
          className="w-24"
        />
      </div>
      
      {/* Delete Button */}
      <button
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        onClick={handleDelete}
        title="Delete Text"
      >
        Delete
      </button>
    </div>
  );
};

export default Toolbar;
