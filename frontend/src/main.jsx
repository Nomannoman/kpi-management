import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// Import Bootstrap CSS (Required for styling)
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Bootstrap JS Bundle (Required for dropdowns, modals, collapses)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
