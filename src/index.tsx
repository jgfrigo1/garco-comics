import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // <-- This IMPORTS from App.tsx

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// This RENDERS the imported App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
