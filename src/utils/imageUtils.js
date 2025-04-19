/**
 * Utility functions for image handling in the text-behind-image editor
 */

/**
 * Creates an object URL from a file
 * @param {File} file - The file to create a URL for
 * @returns {string} Object URL
 */
export const createObjectURL = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Revokes an object URL to prevent memory leaks
 * @param {string} url - Object URL to revoke
 */
export const revokeObjectURL = (url) => {
  URL.revokeObjectURL(url);
};

/**
 * Creates an image element from a source URL
 * @param {string} src - The image source URL
 * @returns {Promise<HTMLImageElement>} - A promise that resolves to the loaded image
 */
export const createImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};

/**
 * Extracts image dimensions from a file
 * @param {File} file - The image file
 * @returns {Promise<{width: number, height: number}>} - Image dimensions
 */
export const getImageDimensions = async (file) => {
  const url = createObjectURL(file);
  try {
    const img = await createImage(url);
    return {
      width: img.width,
      height: img.height,
    };
  } finally {
    revokeObjectURL(url);
  }
};

/**
 * Validates if a file is an image based on its MIME type
 * @param {File} file - The file to validate
 * @returns {boolean} - True if the file is an image
 */
export const isImageFile = (file) => {
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return file && acceptedTypes.includes(file.type);
};

/**
 * Combines background image with text and foreground image
 * @param {HTMLElement} element - The element containing the combined image
 * @returns {Promise<Blob>} - Promise resolving to the generated image as a Blob
 */
export const captureCompositeImage = async (element, htmlToImage) => {
  if (!htmlToImage) {
    throw new Error('htmlToImage library is required');
  }
  
  return await htmlToImage.toBlob(element, {
    quality: 0.95,
    backgroundColor: null,
  });
};
