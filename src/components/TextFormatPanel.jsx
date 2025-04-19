import React from 'react';

/**
 * TextFormatPanel provides advanced text formatting options
 * in a compact, expandable panel.
 */
const TextFormatPanel = ({ selectedElement, onUpdateElement }) => {
  if (!selectedElement) {
    return null;
  }

  const handlePropertyChange = (property, value) => {
    onUpdateElement({
      ...selectedElement,
      [property]: value
    });
  };

  const fontFamilies = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Impact',
    'Comic Sans MS',
    'Palatino',
    'Garamond',
    'Bookman',
    'Tahoma',
    'Trebuchet MS'
  ];

  // Handle advanced styling properties
  const handleLetterSpacingChange = (e) => {
    const value = parseFloat(e.target.value);
    handlePropertyChange('letterSpacing', value);
  };

  const handleLineHeightChange = (e) => {
    const value = parseFloat(e.target.value);
    handlePropertyChange('lineHeight', value);
  };

  const handleTextShadowChange = (property, value) => {
    const currentShadow = selectedElement.textShadow || {
      offsetX: 0,
      offsetY: 0,
      blur: 0,
      color: '#000000'
    };
    
    onUpdateElement({
      ...selectedElement,
      textShadow: {
        ...currentShadow,
        [property]: value
      }
    });
  };

  const handleTransformChange = (transform) => {
    handlePropertyChange('textTransform', transform);
  };

  // Convert shadow object to CSS
  const getShadowStyle = () => {
    if (!selectedElement.textShadow) return 'none';
    
    const { offsetX, offsetY, blur, color } = selectedElement.textShadow;
    return `${offsetX}px ${offsetY}px ${blur}px ${color}`;
  };

  return (
    <div className="text-format-panel bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-3">Advanced Formatting</h3>
      
      {/* Font Family */}
      <div className="mb-3">
        <label htmlFor="fontFamily" className="block text-sm font-medium mb-1">Font Family</label>
        <select
          id="fontFamily"
          value={selectedElement.fontFamily}
          onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
          className="w-full border rounded p-2"
        >
          {fontFamilies.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>
      
      {/* Letter Spacing */}
      <div className="mb-3">
        <label htmlFor="letterSpacing" className="block text-sm font-medium mb-1">
          Letter Spacing ({selectedElement.letterSpacing || 0}px)
        </label>
        <input
          id="letterSpacing"
          type="range"
          min="-5"
          max="10"
          step="0.5"
          value={selectedElement.letterSpacing || 0}
          onChange={handleLetterSpacingChange}
          className="w-full"
        />
      </div>
      
      {/* Line Height */}
      <div className="mb-3">
        <label htmlFor="lineHeight" className="block text-sm font-medium mb-1">
          Line Height ({selectedElement.lineHeight || 1.2})
        </label>
        <input
          id="lineHeight"
          type="range"
          min="0.8"
          max="3"
          step="0.1"
          value={selectedElement.lineHeight || 1.2}
          onChange={handleLineHeightChange}
          className="w-full"
        />
      </div>
      
      {/* Text Transform */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Text Transform</label>
        <div className="flex gap-2 flex-wrap">
          {['none', 'uppercase', 'lowercase', 'capitalize'].map((transform) => (
            <button
              key={transform}
              onClick={() => handleTransformChange(transform)}
              className={`px-3 py-1 border rounded text-sm ${selectedElement.textTransform === transform ? 'bg-blue-100 border-blue-400' : ''}`}
            >
              {transform.charAt(0).toUpperCase() + transform.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Text Shadow */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-2">Text Shadow</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="shadowX" className="block text-xs mb-1">Offset X</label>
            <input
              id="shadowX"
              type="range"
              min="-10"
              max="10"
              value={selectedElement.textShadow?.offsetX || 0}
              onChange={(e) => handleTextShadowChange('offsetX', parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="shadowY" className="block text-xs mb-1">Offset Y</label>
            <input
              id="shadowY"
              type="range"
              min="-10"
              max="10"
              value={selectedElement.textShadow?.offsetY || 0}
              onChange={(e) => handleTextShadowChange('offsetY', parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="shadowBlur" className="block text-xs mb-1">Blur</label>
            <input
              id="shadowBlur"
              type="range"
              min="0"
              max="20"
              value={selectedElement.textShadow?.blur || 0}
              onChange={(e) => handleTextShadowChange('blur', parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="shadowColor" className="block text-xs mb-1">Color</label>
            <input
              id="shadowColor"
              type="color"
              value={selectedElement.textShadow?.color || '#000000'}
              onChange={(e) => handleTextShadowChange('color', e.target.value)}
              className="w-full h-8"
            />
          </div>
        </div>
        <div className="mt-2 text-center">
          <span
            className="inline-block p-2 border"
            style={{
              fontFamily: selectedElement.fontFamily,
              textShadow: getShadowStyle(),
              fontSize: '16px'
            }}
          >
            Text Shadow Preview
          </span>
        </div>
      </div>
    </div>
  );
};

export default TextFormatPanel;
