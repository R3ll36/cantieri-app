import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

/**
 * Componente per gestire click su mappa (incluso right-click)
 */
function MapClickHandler({ onMapClick, onRightClick }) {
  const map = useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
    contextmenu(e) {
      // Right-click sulla mappa
      if (onRightClick) {
        e.originalEvent.preventDefault(); // Previene menu contestuale browser
        onRightClick(e.latlng);
      }
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

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        {/* Tile Layer - OpenStreetMap (strade ben visibili) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Handler per click/right-click su mappa */}
        {onMapClick && <MapClickHandler onRightClick={handleRightClick} />}

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
                    <span className="font-semibold">Accesso camion:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        cantiere.difficolta === 'Difficile'
                          ? 'bg-red-100 text-red-800'
                          : cantiere.difficolta === 'Medio'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {cantiere.difficolta}
                    </span>
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

                  {cantiere.created_by && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Pubblicato da:</span>
                      <span className="text-gray-700">{cantiere.created_by}</span>
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
      </MapContainer>

      {/* Legenda */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <h4 className="font-semibold text-sm mb-2">Legenda</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Facile</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Difficile</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>Completato</span>
          </div>
        </div>
      </div>

      {/* Istruzioni mappa (responsive: desktop vs mobile) */}
      {onMapClick && !tempMarker && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-[1000] animate-pulse">
          {/* Desktop: Click destro */}
          <p className="hidden sm:block text-sm font-semibold">🖱️ Click destro sulla mappa per aggiungere un cantiere</p>
          {/* Mobile: Tap prolungato */}
          <p className="sm:hidden text-sm font-semibold">👆 Tap prolungato sulla mappa per aggiungere un cantiere</p>
        </div>
      )}
    </div>
  );
}
