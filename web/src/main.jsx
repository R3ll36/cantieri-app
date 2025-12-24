import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'

// Carica Google Maps API dinamicamente con API key da env
const loadGoogleMapsAPI = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('⚠️ VITE_GOOGLE_MAPS_API_KEY non trovata nel file .env');
    return;
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=it&region=IT&loading=async`;
  script.async = true;
  script.defer = true;
  script.onload = () => console.log('✅ Google Maps API caricata');
  script.onerror = () => console.error('❌ Errore caricamento Google Maps API');
  document.head.appendChild(script);
};

loadGoogleMapsAPI();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
