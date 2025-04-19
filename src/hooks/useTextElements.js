import { useState, useCallback } from 'react';
import { createNewTextElement } from '../utils/textUtils';

/**
 * Custom hook for managing text elements in the editor
 * Provides state and operations for adding, updating, selecting, and deleting text elements
 */
const useTextElements = () => {
  // State for text elements and selection
  const [textElements, setTextElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);

  // Get the currently selected text element
  const selectedElement = textElements.find(el => el.id === selectedElementId);

  // Add a new text element with default properties
  const addTextElement = useCallback((options = {}) => {
    const newElement = createNewTextElement(options);
    setTextElements(prev => [...prev, newElement]);
    setSelectedElementId(newElement.id);
    return newElement;
  }, []);

  // Update an existing text element
  const updateTextElement = useCallback(updatedElement => {
    setTextElements(prev => 
      prev.map(el => (el.id === updatedElement.id ? updatedElement : el))
    );
  }, []);

  // Delete a text element by ID
  const deleteTextElement = useCallback(id => {
    setTextElements(prev => prev.filter(el => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  // Clear all text elements
  const clearTextElements = useCallback(() => {
    setTextElements([]);
    setSelectedElementId(null);
  }, []);

  // Select a text element by ID
  const selectTextElement = useCallback(id => {
    setSelectedElementId(id);
  }, []);

  // Deselect the currently selected text element
  const deselectTextElement = useCallback(() => {
    setSelectedElementId(null);
  }, []);

  return {
    textElements,
    selectedElementId,
    selectedElement,
    addTextElement,
    updateTextElement,
    deleteTextElement,
    clearTextElements,
    selectTextElement,
    deselectTextElement
  };
};

export default useTextElements;
