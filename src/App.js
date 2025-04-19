import React from 'react';
import Editor from './components/Editor';

/**
 * Main App component that serves as the entry point for the application
 */
function App() {
  return (
    <div className="App bg-background min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4">
          <h1 className="text-2xl font-bold text-text">Text Behind Image Editor</h1>
          <p className="text-gray-600">Create images with text seamlessly placed behind foreground objects</p>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        <Editor />
      </main>
      
      <footer className="bg-white mt-10 py-6 shadow-inner">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>Text Behind Image Editor &copy; {new Date().getFullYear()}</p>
          <p className="text-sm mt-2">
            Create stunning visuals with text behind objects by uploading your background and foreground images.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
