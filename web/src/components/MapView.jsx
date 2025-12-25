import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapSearchBar from './MapSearchBar';

// Componente helper per ottenere riferimento alla mappa
function MapRefSetter({ mapRef }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
}

// Fix per icone Leaflet che non si vedono di default in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Icone colorate per accesso camion
const createColoredIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const icons = {
  Facile: createColoredIcon('green'),
  Medio: createColoredIcon('yellow'),
  Difficile: createColoredIcon('red'),
  Completato: createColoredIcon('grey'),
};

// Icona per posizione utente (blu con pulsante)
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background: #3B82F6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
      position: relative;
    ">
      <div style="
        width: 100%;
        height: 100%;
        background: #3B82F6;
        border-radius: 50%;
        animation: pulse 2s infinite;
      "></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

/**
 * Componente per gestire click su mappa (incluso right-click)
 */
function MapClickHandler({ onMapClick, onRightClick, onAnyClick }) {
  const map = useMapEvents({
    click(e) {
      // Notifica click generico (per chiudere ricerca)
      if (onAnyClick) {
        onAnyClick();
      }
      // Gestisci click normale
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
    contextmenu(e) {
      // Notifica click generico (per chiudere ricerca)
      if (onAnyClick) {
        onAnyClick();
      }
      // Right-click sulla mappa
      if (onRightClick) {
        // Previeni menu contestuale del browser in tutti i modi possibili
        if (e.originalEvent) {
          e.originalEvent.preventDefault();
          e.originalEvent.stopPropagation();
        }
        e.preventDefault?.();
        onRightClick(e.latlng);
      }
      return false;
    },
  });
  return null;
}

/**
 * Componente Mappa Leaflet
 * @param {Object} props
 * @param {Array} props.cantieri - Lista cantieri da mostrare
 * @param {Function} props.onCantiereClick - Callback click su marker
 * @param {Function} props.onMapClick - Callback click su mappa (per aggiungere cantiere)
 * @param {Object} props.center - Centro iniziale mappa {lat, lng}
 * @param {number} props.zoom - Zoom iniziale
 */
export default function MapView({
  cantieri = [],
  onCantiereClick,
  onMapClick,
  center = { lat: 46.0569, lng: 13.2348 }, // Udine, Italia
  zoom = 10,
}) {
  const [selectedCantiere, setSelectedCantiere] = useState(null);
  const [tempMarker, setTempMarker] = useState(null); // Marker temporaneo per nuovo cantiere
  const [mapClickTrigger, setMapClickTrigger] = useState(0); // Trigger per chiudere ricerca
  const [userLocation, setUserLocation] = useState(null); // Posizione utente
  const [isLocating, setIsLocating] = useState(false); // Loading geolocation
  const mapRef = useRef(null);

  // Determina icona in base ad accesso camion e stato
  const getIcon = (cantiere) => {
    if (cantiere.stato === 'Completato') {
      return icons.Completato;
    }
    return icons[cantiere.difficolta] || icons.Facile;
  };

  const handleMarkerClick = (cantiere) => {
    setSelectedCantiere(cantiere);
    if (onCantiereClick) {
      onCantiereClick(cantiere);
    }
  };

  // Gestisce qualsiasi click sulla mappa (chiude ricerca)
  const handleAnyMapClick = () => {
    setMapClickTrigger(prev => prev + 1); // Chiudi risultati ricerca
  };

  // Gestisce right-click sulla mappa
  const handleRightClick = (latlng) => {
    setTempMarker(latlng); // Mostra marker temporaneo
  };

  // Conferma aggiunta cantiere
  const handleConfirmAddCantiere = () => {
    if (tempMarker && onMapClick) {
      onMapClick(tempMarker);
      setTempMarker(null); // Rimuovi marker temporaneo
    }
  };

  // Annulla aggiunta cantiere
  const handleCancelAddCantiere = () => {
    setTempMarker(null);
  };

  // Gestisce selezione da barra di ricerca
  const handleSearchLocationSelect = (location) => {
    if (mapRef.current) {
      // Centra la mappa sulla posizione selezionata
      mapRef.current.setView([location.lat, location.lng], 16);

      // Aggiungi marker temporaneo
      setTempMarker({
        lat: location.lat,
        lng: location.lng,
        address: location.address
      });
    }
  };

  // Ottieni posizione utente e centra mappa
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('La geolocalizzazione non è supportata dal tuo browser');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };

        setUserLocation(location);
        setIsLocating(false);

        // Centra la mappa sulla posizione utente
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);
        }
      },
      (error) => {
        setIsLocating(false);
        let message = 'Impossibile ottenere la posizione';

        switch(error.code) {
          case error.PERMISSION_DENIED:
            message = 'Hai negato il permesso per la geolocalizzazione';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Posizione non disponibile';
            break;
          case error.TIMEOUT:
            message = 'Timeout richiesta geolocalizzazione';
            break;
        }

        alert(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  };

  // Ottieni posizione utente all'avvio e centra la mappa
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };
        setUserLocation(location);

        // Centra la mappa sulla posizione utente al primo caricamento
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 13);
        }
      },
      (error) => {
        console.log('Posizione utente non disponibile, uso posizione default');
      },
      {
        enableHighAccuracy: false, // Usa bassa accuratezza per velocità
        timeout: 5000,
        maximumAge: 300000 // Accetta posizioni vecchie fino a 5 minuti
      }
    );
  }, []); // Solo all'avvio

  // Traccia posizione utente in tempo reale
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error('Errore tracking posizione:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Previeni menu contestuale del browser sulla mappa (Windows Chrome fix)
  useEffect(() => {
    const mapContainer = document.querySelector('.leaflet-container');
    if (mapContainer && onMapClick) {
      const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      mapContainer.addEventListener('contextmenu', handleContextMenu);
      return () => {
        mapContainer.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, [onMapClick]);

  return (
    <div className="w-full h-full relative">
      {/* Barra di ricerca */}
      <MapSearchBar onLocationSelect={handleSearchLocationSelect} onMapClick={mapClickTrigger} />

      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        {/* Setter per riferimento mappa */}
        <MapRefSetter mapRef={mapRef} />

        {/* Tile Layer - Stile Apple Maps (Mapbox Streets con colori naturali) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          subdomains="abc"
          maxZoom={20}
        />

        {/* Handler per click/right-click su mappa */}
        <MapClickHandler onRightClick={onMapClick ? handleRightClick : undefined} onAnyClick={handleAnyMapClick} />

        {/* Marker cantieri */}
        {cantieri.map((cantiere) => (
          <Marker
            key={cantiere.id}
            position={[cantiere.coordinate.lat, cantiere.coordinate.lng]}
            icon={getIcon(cantiere)}
            eventHandlers={{
              click: () => handleMarkerClick(cantiere),
              mouseover: (e) => {
                e.target.openPopup();
              },
              mouseout: (e) => {
                e.target.closePopup();
              },
            }}
          >
            {/* Tooltip sempre visibile con nome cantiere */}
            <Tooltip permanent direction="top" offset={[0, -40]} className="cantiere-tooltip">
              <span style={{ fontSize: '11px', fontWeight: '600' }}>{cantiere.nome}</span>
            </Tooltip>

            {/* Popup con dettagli completi (hover desktop / tap mobile) */}
            <Popup>
              <div className="p-2 min-w-[200px] max-w-[300px]">
                <h3 className="font-bold text-lg mb-1">{cantiere.nome}</h3>
                <p className="text-sm text-gray-600 mb-2">{cantiere.indirizzo}</p>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Tipologia:</span>
                    <span>{cantiere.tipologia}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Stato:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        cantiere.stato === 'Attivo'
                          ? 'bg-blue-100 text-blue-800'
                          : cantiere.stato === 'Completato'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {cantiere.stato}
                    </span>
                  </div>

                  {/* Metri Cubi da Fare Oggi - solo se > 0 */}
                  {cantiere.metri_cubi_oggi > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">🎯 Metri Cubi da Fare Oggi:</span>
                      <span className="text-blue-600 font-bold">{parseFloat(cantiere.metri_cubi_oggi).toFixed(1)} m³</span>
                    </div>
                  )}

                  {cantiere.orari && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Orari:</span>
                      <span>{cantiere.orari}</span>
                    </div>
                  )}

                  {cantiere.coordinatore_nome && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Coordinatore:</span>
                      <span>{cantiere.coordinatore_nome}</span>
                    </div>
                  )}

                  {cantiere.coordinatore_telefono && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Telefono:</span>
                      <a
                        href={`tel:${cantiere.coordinatore_telefono}`}
                        className="text-blue-600 hover:underline font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {cantiere.coordinatore_telefono}
                      </a>
                    </div>
                  )}
                </div>

                {cantiere.note_operative && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-xs font-semibold text-yellow-800 mb-1">Note operative:</p>
                    <p className="text-xs text-yellow-900">{cantiere.note_operative}</p>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Marker temporaneo per nuovo cantiere */}
        {tempMarker && (
          <Marker
            position={[tempMarker.lat, tempMarker.lng]}
            icon={createColoredIcon('blue')}
          >
            <Popup>
              <div className="p-3 min-w-[250px]">
                <h3 className="font-bold text-lg mb-2 text-blue-600">📍 Nuovo Cantiere</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Coordinate: {tempMarker.lat.toFixed(6)}, {tempMarker.lng.toFixed(6)}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmAddCantiere}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 px-3 rounded transition"
                  >
                    ✓ Aggiungi
                  </button>
                  <button
                    onClick={handleCancelAddCantiere}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-3 rounded transition"
                  >
                    ✕ Annulla
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marker posizione utente */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="p-2 text-center">
                <p className="font-semibold text-blue-600">📍 La tua posizione</p>
                <p className="text-xs text-gray-600 mt-1">
                  {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Bottone Locate Me */}
      <button
        onClick={handleLocateMe}
        disabled={isLocating}
        className="absolute top-20 right-4 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full shadow-lg z-[999] transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-200"
        title="Trova la mia posizione"
      >
        {isLocating ? (
          <svg className="w-6 h-6 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Istruzioni mappa (responsive: desktop vs mobile) - Angolo in basso a destra */}
      {onMapClick && !tempMarker && (
        <div className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-[999] animate-pulse">
          {/* Desktop: Click destro (>= 768px) */}
          <p className="hidden md:block text-sm font-semibold">🖱️ Click destro sulla mappa per aggiungere un cantiere</p>
          {/* Mobile: Tap prolungato (< 768px) */}
          <p className="md:hidden text-sm font-semibold">👆 Tap prolungato sulla mappa per aggiungere un cantiere</p>
        </div>
      )}
    </div>
  );
}
