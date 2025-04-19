import React from 'react';
import TextElement from './TextElement';

/**
 * TextLayer manages a collection of text elements that appear
 * behind the foreground image, providing selection and editing capabilities.
 */
const TextLayer = ({
  textElements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  editable = true
}) => {
  // Handle text element selection
  const handleSelectElement = (id) => {
    if (editable) {
      onSelectElement(id);
    }
  };

  // Handle text element changes
  const handleUpdateElement = (updatedElement) => {
    onUpdateElement(updatedElement);
  };

  // Handle text element deletion
  const handleDeleteElement = (id) => {
    onDeleteElement(id);
  };

  // Sort text elements by z-index to ensure proper layering
  const sortedElements = [...textElements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="text-layer">
      {sortedElements.map((element) => (
        <TextElement
          key={element.id}
          element={element}
          isSelected={element.id === selectedElementId}
          onSelect={handleSelectElement}
          onChange={handleUpdateElement}
          onDelete={handleDeleteElement}
          editable={editable}
        />
      ))}
    </div>
  );
};

export default TextLayer;
