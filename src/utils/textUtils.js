/**
 * Utility functions for text handling in the text-behind-image editor
 */

/**
 * Generates a unique ID for text elements
 * @returns {string} Unique ID
 */
export const generateUniqueId = () => {
  return `text-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Creates a new text element with default properties
 * @param {Object} options - Options for the new text element
 * @returns {Object} New text element object
 */
export const createNewTextElement = (options = {}) => {
  const defaultPosition = { x: 100, y: 100 };
  const defaultSize = { width: 200, height: 50 };
  
  return {
    id: generateUniqueId(),
    text: options.text || 'Your text here',
    position: options.position || defaultPosition,
    size: options.size || defaultSize,
    fontSize: options.fontSize || 24,
    fontFamily: options.fontFamily || 'Arial',
    color: options.color || '#000000',
    fontWeight: options.fontWeight || 'normal',
    fontStyle: options.fontStyle || 'normal',
    textDecoration: options.textDecoration || 'none',
    textAlign: options.textAlign || 'center',
    opacity: options.opacity || 1,
    rotation: options.rotation || 0,
    zIndex: options.zIndex || 1,
  };
};

/**
 * Converts text element properties to CSS style object
 * @param {Object} textElement - The text element
 * @returns {Object} CSS style object
 */
export const textElementToStyle = (textElement) => {
  return {
    fontSize: `${textElement.fontSize}px`,
    fontFamily: textElement.fontFamily,
    color: textElement.color,
    fontWeight: textElement.fontWeight,
    fontStyle: textElement.fontStyle,
    textDecoration: textElement.textDecoration,
    textAlign: textElement.textAlign,
    opacity: textElement.opacity,
    transform: `rotate(${textElement.rotation}deg)`,
    zIndex: textElement.zIndex,
    width: `${textElement.size.width}px`,
    height: `${textElement.size.height}px`,
  };
};

/**
 * Debounce function to limit how often a function can execute
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if point is inside text element boundaries
 * @param {Object} point - {x, y} coordinates
 * @param {Object} element - Text element with position and size
 * @returns {boolean} True if point is inside element
 */
export const isPointInElement = (point, element) => {
  return (
    point.x >= element.position.x &&
    point.x <= element.position.x + element.size.width &&
    point.y >= element.position.y &&
    point.y <= element.position.y + element.size.height
  );
};
