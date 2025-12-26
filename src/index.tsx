import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Imports your global styles
import App from './App'; // Imports your main App component

// This finds the 'root' div in your public/index.html file
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// This tells React to render your entire application inside that div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
