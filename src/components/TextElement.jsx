import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { textElementToStyle } from '../utils/textUtils';

/**
 * TextElement component provides a draggable, resizable text element
 * that can be edited, styled, and positioned over an image.
 */
const TextElement = ({
  element,
  isSelected,
  onSelect,
  onChange,
  onDelete,
  editable = true
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef(null);
  const style = textElementToStyle(element);

  // Set focus on text element when editing starts
  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
    }
  }, [isEditing]);

  // Handle text editing
  const handleTextChange = (e) => {
    onChange({
      ...element,
      text: e.target.innerText
    });
  };

  // Start editing mode on double click
  const handleDoubleClick = (e) => {
    if (!editable) return;
    
    e.stopPropagation();
    setIsEditing(true);
  };

  // Exit editing mode when focus is lost
  const handleBlur = () => {
    setIsEditing(false);
  };

  // Select this text element on click
  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  // Suppress Enter key to prevent new lines
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      textRef.current.blur();
    } else if (e.key === 'Delete' && e.ctrlKey) {
      e.preventDefault();
      onDelete(element.id);
    }
  };

  return (
    <Rnd
      size={{ width: element.size.width, height: element.size.height }}
      position={{ x: element.position.x, y: element.position.y }}
      onDragStop={(e, d) => {
        onChange({
          ...element,
          position: { x: d.x, y: d.y }
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onChange({
          ...element,
          position,
          size: {
            width: ref.offsetWidth,
            height: ref.offsetHeight
          }
        });
      }}
      className={`text-element ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      bounds="parent"
      enableResizing={editable}
      disableDragging={!editable}
    >
      <div
        ref={textRef}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        onInput={handleTextChange}
        onKeyDown={handleKeyDown}
        className="editable-text"
        style={{
          ...style,
          cursor: isEditing ? 'text' : 'move',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: style.textAlign === 'center' ? 'center' : 
                         style.textAlign === 'right' ? 'flex-end' : 'flex-start',
          pointerEvents: editable ? 'auto' : 'none',
          userSelect: isEditing ? 'text' : 'none',
          overflow: 'hidden'
        }}
      >
        {element.text}
      </div>
    </Rnd>
  );
};

export default TextElement;
