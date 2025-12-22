import { useState, useEffect, useRef } from 'react';

/**
 * Barra di ricerca con Google Places Autocomplete per la mappa
 */
export default function MapSearchBar({ onLocationSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteService = useRef(null);
  const geocoder = useRef(null);

  // Inizializza Google Places Autocomplete
  useEffect(() => {
    if (window.google && window.google.maps) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      geocoder.current = new window.google.maps.Geocoder();
    }
  }, []);

  // Cerca indirizzi mentre l'utente digita
  const handleSearch = (value) => {
    setSearchQuery(value);

    if (!value || value.length < 3) {
      setPredictions([]);
      return;
    }

    if (!autocompleteService.current) {
      console.error('Google Places Autocomplete non disponibile');
      return;
    }

    setIsLoading(true);

    // Cerca in Italia preferibilmente
    autocompleteService.current.getPlacePredictions(
      {
        input: value,
        componentRestrictions: { country: 'it' },
        types: ['address', 'establishment', 'geocode']
      },
      (results, status) => {
        setIsLoading(false);

        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPredictions(results || []);
        } else {
          setPredictions([]);
        }
      }
    );
  };

  // Seleziona un indirizzo dalla lista
  const handleSelectPlace = (placeId, description) => {
    if (!geocoder.current) return;

    setIsLoading(true);
    setSearchQuery(description);
    setPredictions([]);

    // Ottieni coordinate dall'indirizzo
    geocoder.current.geocode({ placeId }, (results, status) => {
      setIsLoading(false);

      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const formattedAddress = results[0].formatted_address;

        onLocationSelect({
          lat: location.lat(),
          lng: location.lng(),
          address: formattedAddress
        });

        // Pulisci dopo selezione
        setTimeout(() => {
          setSearchQuery('');
          setPredictions([]);
        }, 300);
      } else {
        alert('Impossibile trovare le coordinate per questo indirizzo');
      }
    });
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-md px-4">
      <div className="relative">
        {/* Input di ricerca */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="🔍 Cerca indirizzo..."
            className="w-full px-4 py-3 pr-10 bg-white rounded-lg shadow-lg border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 font-medium"
            style={{ fontSize: '15px' }}
          />

          {/* Spinner di caricamento */}
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}

          {/* Pulsante cancella */}
          {searchQuery && !isLoading && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPredictions([]);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold"
              style={{ fontSize: '18px' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Lista suggerimenti */}
        {predictions.length > 0 && (
          <div className="absolute w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-y-auto">
            {predictions.map((prediction) => (
              <button
                key={prediction.place_id}
                onClick={() => handleSelectPlace(prediction.place_id, prediction.description)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 text-lg mt-0.5">📍</span>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium text-sm">
                      {prediction.structured_formatting.main_text}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {prediction.structured_formatting.secondary_text}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
