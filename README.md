# Text Behind Image Editor

A React application that allows users to place editable text behind foreground objects in images, creating a seamless text-behind-object effect. This project was inspired by [RexanWONG/text-behind-image](https://github.com/RexanWONG/text-behind-image).

## Features

- **Upload separate background and foreground images**: Create layered compositions with your own images
- **Interactive text editing**: Add, edit, style, and position text elements
- **Drag-and-drop functionality**: Move and resize text elements intuitively with your mouse
- **Rich text formatting options**: Change font family, size, color, alignment, opacity, and more
- **Blend mode control**: Adjust how the foreground image blends with the text and background
- **Export as image**: Save your composition as a PNG image file

## Getting Started

### Prerequisites

- Node.js 14.0.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/curiousguyinhis30s/text-behind-image-editor.git
   cd text-behind-image-editor
   ```

2. Install dependencies:
   ```bash
   npm install
   # or with yarn
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or with yarn
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## How to Use

1. **Upload Images**: 
   - First, upload a background image (any JPG, PNG, etc.)
   - Then, upload a foreground image (preferably a PNG with transparent background)

2. **Add Text**:
   - Click the "Add Text" button in the toolbar
   - Double-click on the text to edit its content
   - Use the toolbar to format the text (font, size, color, etc.)

3. **Position Text**:
   - Drag text elements to position them behind the foreground image
   - Resize text elements by dragging the corners
   - Adjust opacity, rotation, and layer order as needed

4. **Blend Mode**:
   - Experiment with different blend modes to optimize the text-behind-image effect
   - Available blend modes: Multiply, Screen, Overlay, Normal

5. **Export**:
   - When satisfied with your composition, click the "Export Image" button
   - The resulting PNG will combine all layers into a single image

## Technologies Used

- React.js - Frontend framework
- react-rnd - Resizable and draggable components
- react-dropzone - File upload functionality
- html-to-image - Image export functionality
- file-saver - Download functionality
- TailwindCSS - Styling

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [RexanWONG/text-behind-image](https://github.com/RexanWONG/text-behind-image)
- Built with React and modern web technologies
