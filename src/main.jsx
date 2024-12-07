import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import InstallButtonPanel from './components/installAppPanel';

import App from './App.jsx'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registrado:', registration);
    })
    .catch((error) => {
      console.error('Error al registrar el Service Worker:', error);
    });
} 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <InstallButtonPanel/>
  </StrictMode>
)
