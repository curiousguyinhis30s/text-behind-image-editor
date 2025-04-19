# Text Behind Image Editor - Project Summary

This document provides a comprehensive overview of the Text Behind Image Editor project structure, features, and implementation details.

## Project Overview

The Text Behind Image Editor is a React application that allows users to place text elements behind foreground objects in images, creating a seamless text-behind-object effect. The application was inspired by [RexanWONG/text-behind-image](https://github.com/RexanWONG/text-behind-image).

![Text Behind Image Demo](https://raw.githubusercontent.com/curiousguyinhis30s/text-behind-image-editor/main/public/demo.png)

## Core Features

1. **Separate Background and Foreground Images**:
   - Upload a background image (any format)
   - Upload a foreground image (preferably with transparent background)
   - Different blend modes for optimal results

2. **Interactive Text Editing**:
   - Add multiple text elements
   - Edit text content via double-click
   - Drag and position text elements freely
   - Resize text elements by dragging handles

3. **Rich Text Formatting**:
   - Font family, size, color, and style options
   - Text alignment and rotation controls
   - Advanced formatting (letter spacing, line height, text shadow)
   - Z-index control for layering multiple text elements

4. **History Management**:
   - Undo/redo functionality
   - Keyboard shortcuts for efficient editing

5. **Export Options**:
   - Quick export to PNG
   - Advanced export with format, quality, and scale controls
   - Preview before final export

## Project Structure

The project follows a modular structure with clear separation of concerns:

### Components

1. **Editor.jsx**: Main container component that orchestrates the application
2. **TextLayer.jsx**: Manages the collection of text elements
3. **TextElement.jsx**: Individual editable text element
4. **Toolbar.jsx**: Controls for basic text formatting
5. **TextFormatPanel.jsx**: Advanced text formatting options
6. **ImageUploader.jsx**: Handles image upload via drag-and-drop
7. **ExportPreview.jsx**: Modal for export configuration and preview

### Custom Hooks

1. **useTextElements.js**: Manages text elements state and operations
2. **useImageHandler.js**: Handles image loading and processing
3. **useHistoryState.js**: Provides undo/redo functionality

### Utilities

1. **imageUtils.js**: Helper functions for image processing
2. **textUtils.js**: Helper functions for text operations

## Technical Implementation

### Text Positioning

Text elements are implemented using the `react-rnd` library, which provides draggable and resizable components. Each text element is positioned absolutely within the editor container, allowing for precise placement behind the foreground image.

### Image Layering

The application uses CSS positioning and z-index to create the layering effect:
1. Background image (bottom layer)
2. Text elements (middle layer)
3. Foreground image (top layer with transparency)

### Text Editing

Text editing is implemented using contentEditable divs wrapped in resizable containers. This allows for in-place editing while maintaining the ability to drag and resize.

### Export Process

The export functionality uses the `html-to-image` library to capture the combined layers as a single image:
1. The entire editor container is captured, including all layers
2. The captured image is converted to a blob
3. The `file-saver` library is used to download the image

### Blend Modes

Different CSS blend modes are applied to the foreground image to achieve various effects:
- Multiply: Darkens the image, good for dark text
- Screen: Lightens the image, good for light text
- Overlay: Increases contrast, good for mixed content
- Normal: No blending effect

## User Workflow

1. **Setup**:
   - Upload background image
   - Upload foreground image with transparency

2. **Add and Position Text**:
   - Add text elements using the "Add Text" button
   - Drag text elements to position them behind foreground objects
   - Double-click to edit text content

3. **Style Text**:
   - Use the toolbar for basic formatting
   - Access advanced options via the format panel
   - Adjust blend mode for optimal visibility

4. **Export**:
   - Use "Quick Export" for a simple PNG
   - Use "Advanced Export" for more control over the output

## Keyboard Shortcuts

The application supports various keyboard shortcuts for efficient editing:
- **Ctrl+Z**: Undo
- **Ctrl+Y** or **Ctrl+Shift+Z**: Redo
- **Delete** or **Backspace**: Delete selected element
- **Ctrl+D**: Duplicate selected element
- **Escape**: Deselect element
- **Ctrl+S**: Quick export

## Future Enhancements

Potential areas for future development:
1. Add support for multiple foreground images
2. Implement group selection and manipulation of text elements
3. Add text effects (gradient, stroke, etc.)
4. Support for curved text paths
5. Add image adjustment controls (brightness, contrast, etc.)
6. Implement project saving and loading
7. Add collaboration features

## Dependencies

- React and React DOM
- react-rnd for draggable and resizable elements
- react-dropzone for file uploads
- html-to-image for export functionality
- file-saver for downloading generated images
- TailwindCSS for styling

## Conclusion

The Text Behind Image Editor provides a powerful yet user-friendly interface for creating images with text behind foreground objects. Its modular architecture ensures maintainability and extensibility, while the rich feature set enables creative possibilities for users.
