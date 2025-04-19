import React, { useState, useRef, useCallback } from 'react';
import { saveAs } from 'file-saver';
import * as htmlToImage from 'html-to-image';
import TextLayer from './TextLayer';
import { captureCompositeImage } from '../utils/imageUtils';

/**
 * ExportPreview provides a preview of how the exported image will look
 * and allows users to export the image in different formats and sizes.
 */
const ExportPreview = ({ 
  textElements, 
  bgImageUrl, 
  fgImageUrl, 
  blendMode,
  onClose 
}) => {
  const [exportFormat, setExportFormat] = useState('png');
  const [exportQuality, setExportQuality] = useState(0.95);
  const [exportName, setExportName] = useState('text-behind-image');
  const [exportScale, setExportScale] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const previewRef = useRef(null);
  
  // Handle export format change
  const handleFormatChange = (e) => {
    setExportFormat(e.target.value);
  };
  
  // Handle export quality change
  const handleQualityChange = (e) => {
    setExportQuality(parseFloat(e.target.value));
  };
  
  // Handle export name change
  const handleNameChange = (e) => {
    setExportName(e.target.value);
  };
  
  // Handle export scale change
  const handleScaleChange = (e) => {
    setExportScale(parseFloat(e.target.value));
  };
  
  // Export the image
  const handleExport = useCallback(async () => {
    if (!previewRef.current) return;
    
    setLoading(true);
    
    try {
      let blob;
      
      const options = {
        quality: exportQuality,
        backgroundColor: null,
        pixelRatio: exportScale
      };
      
      if (exportFormat === 'png') {
        blob = await htmlToImage.toBlob(previewRef.current, options);
      } else if (exportFormat === 'jpeg') {
        // JPEG doesn't support transparency, add a white background
        blob = await htmlToImage.toJpeg(previewRef.current, {
          ...options,
          backgroundColor: '#ffffff'
        });
      } else if (exportFormat === 'svg') {
        const dataUrl = await htmlToImage.toSvg(previewRef.current, options);
        const svgBlob = new Blob([dataUrl], { type: 'image/svg+xml' });
        blob = svgBlob;
      }
      
      saveAs(blob, `${exportName}.${exportFormat}`);
    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Failed to export image. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [exportFormat, exportQuality, exportName, exportScale]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Export Preview</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded hover:bg-gray-200"
            >
              &times;
            </button>
          </div>
        </div>
        
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preview */}
          <div>
            <h3 className="text-lg font-medium mb-2">Preview</h3>
            <div 
              ref={previewRef}
              className="image-container border rounded overflow-hidden"
              style={{ maxWidth: '100%', maxHeight: '500px' }}
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
                selectedElementId={null}
                onSelectElement={() => {}}
                onUpdateElement={() => {}}
                onDeleteElement={() => {}}
                editable={false}
              />
              
              {fgImageUrl && (
                <img
                  src={fgImageUrl}
                  alt="Foreground"
                  className={`foreground-image ${blendMode !== 'normal' ? `blend-${blendMode}` : ''}`}
                />
              )}
            </div>
          </div>
          
          {/* Export Options */}
          <div>
            <h3 className="text-lg font-medium mb-2">Export Options</h3>
            
            <div className="space-y-4">
              {/* Export Format */}
              <div>
                <label htmlFor="exportFormat" className="block text-sm font-medium mb-1">
                  Format
                </label>
                <select
                  id="exportFormat"
                  value={exportFormat}
                  onChange={handleFormatChange}
                  className="w-full border rounded p-2"
                >
                  <option value="png">PNG (with transparency)</option>
                  <option value="jpeg">JPEG (no transparency)</option>
                  <option value="svg">SVG (vector format)</option>
                </select>
              </div>
              
              {/* Export Quality */}
              <div>
                <label htmlFor="exportQuality" className="block text-sm font-medium mb-1">
                  Quality: {Math.round(exportQuality * 100)}%
                </label>
                <input
                  id="exportQuality"
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={exportQuality}
                  onChange={handleQualityChange}
                  className="w-full"
                />
              </div>
              
              {/* Export Scale */}
              <div>
                <label htmlFor="exportScale" className="block text-sm font-medium mb-1">
                  Scale: {exportScale}x
                </label>
                <input
                  id="exportScale"
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.5"
                  value={exportScale}
                  onChange={handleScaleChange}
                  className="w-full"
                />
              </div>
              
              {/* Export Name */}
              <div>
                <label htmlFor="exportName" className="block text-sm font-medium mb-1">
                  File Name
                </label>
                <input
                  id="exportName"
                  type="text"
                  value={exportName}
                  onChange={handleNameChange}
                  className="w-full border rounded p-2"
                />
              </div>
              
              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={loading}
                className={`w-full py-2 px-4 rounded text-white ${loading ? 'bg-gray-400' : 'bg-secondary hover:bg-green-600'} transition`}
              >
                {loading ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPreview;
