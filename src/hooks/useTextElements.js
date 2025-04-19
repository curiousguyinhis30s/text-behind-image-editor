import { useState, useCallback } from 'react';
import useHistoryState from './useHistoryState';
import { createNewTextElement, cloneTextElement } from '../utils/textUtils';

/**
 * Custom hook for managing text elements in the editor
 * Provides state and operations for adding, updating, selecting, and deleting text elements
 * with undo/redo functionality
 */
const useTextElements = () => {
  // State for selection
  const [selectedElementId, setSelectedElementId] = useState(null);
  
  // Use history state for text elements to enable undo/redo
  const {
    state: textElements,
    setState: setTextElements,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistoryState([]);

  // Get the currently selected text element
  const selectedElement = textElements.find(el => el.id === selectedElementId);

  // Add a new text element with default properties
  const addTextElement = useCallback((options = {}) => {
    const newElement = createNewTextElement(options);
    setTextElements(prev => [...prev, newElement]);
    setSelectedElementId(newElement.id);
    return newElement;
  }, [setTextElements]);

  // Update an existing text element
  const updateTextElement = useCallback(updatedElement => {
    setTextElements(prev => 
      prev.map(el => (el.id === updatedElement.id ? updatedElement : el))
    );
  }, [setTextElements]);

  // Delete a text element by ID
  const deleteTextElement = useCallback(id => {
    setTextElements(prev => prev.filter(el => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId, setTextElements]);

  // Clear all text elements
  const clearTextElements = useCallback(() => {
    setTextElements([]);
    setSelectedElementId(null);
  }, [setTextElements]);

  // Select a text element by ID
  const selectTextElement = useCallback(id => {
    setSelectedElementId(id);
  }, []);

  // Deselect the currently selected text element
  const deselectTextElement = useCallback(() => {
    setSelectedElementId(null);
  }, []);
  
  // Clone a text element
  const cloneTextElement = useCallback((id) => {
    const elementToClone = textElements.find(el => el.id === id);
    if (elementToClone) {
      const clonedElement = {
        ...elementToClone,
        id: `text-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        position: {
          x: elementToClone.position.x + 20,
          y: elementToClone.position.y + 20
        }
      };
      
      setTextElements(prev => [...prev, clonedElement]);
      setSelectedElementId(clonedElement.id);
      return clonedElement;
    }
    return null;
  }, [textElements, setTextElements]);

  // Handle keyboard shortcuts
  const handleKeyboardShortcut = useCallback((e) => {
    // Undo: Ctrl/Cmd + Z
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
    }
    // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
    else if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || 
             ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
      e.preventDefault();
      redo();
    }
    // Delete: Delete/Backspace when element is selected
    else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId && !e.target.isContentEditable) {
      e.preventDefault();
      deleteTextElement(selectedElementId);
    }
    // Duplicate: Ctrl/Cmd + D
    else if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedElementId) {
      e.preventDefault();
      cloneTextElement(selectedElementId);
    }
  }, [undo, redo, selectedElementId, deleteTextElement, cloneTextElement]);

  return {
    textElements,
    selectedElementId,
    selectedElement,
    addTextElement,
    updateTextElement,
    deleteTextElement,
    clearTextElements,
    selectTextElement,
    deselectTextElement,
    cloneTextElement,
    handleKeyboardShortcut,
    undo,
    redo,
    canUndo,
    canRedo
  };
};

export default useTextElements;
