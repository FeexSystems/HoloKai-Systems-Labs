import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.jsx';
import '@/index.css';

// Unified entry point ensuring single-root mounting & global style initialization
const rootElement = document.getElementById('root');

if (rootElement) {
  // Guard against duplicate root creation during re-evaluations
  if (!rootElement._reactRootContainer) {
    const root = ReactDOM.createRoot(rootElement);
    rootElement._reactRootContainer = root;
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
} else {
  console.error('[HoloKai] Failed to find root element with id "root"');
}
