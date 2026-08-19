import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppAdmin from './AppAdmin.jsx'; // Make sure this matches your filename

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppAdmin />
  </StrictMode>
);