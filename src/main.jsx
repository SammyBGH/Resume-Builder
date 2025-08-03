import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// ✅ Disable right-click
document.addEventListener('contextmenu', (e) => e.preventDefault());

// ✅ Disable print screen shortcut (not foolproof)
document.addEventListener('keydown', (e) => {
  if (e.key === 'PrintScreen') {
    navigator.clipboard.writeText('');
    alert('📸 Screenshots are not allowed on this site.');
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
