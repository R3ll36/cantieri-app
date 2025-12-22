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
    // Nota: 'geocode' include sia indirizzi che località, 'establishment' cerca luoghi/attività
    autocompleteService.current.getPlacePredictions(
      {
        input: value,
        componentRestrictions: { country: 'it' },
        types: ['geocode'] // Rimuovo 'address' e 'establishment' - 'geocode' copre tutto
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
        </div>

        {/* Lista suggerimenti */}
        {predictions.length > 0 && (
          <div className="absolute w-full mt-2 bg-white rounded-xl shadow-2xl border-2 border-blue-200 max-h-96 overflow-y-auto backdrop-blur-sm">
            {predictions.map((prediction) => (
              <button
                key={prediction.place_id}
                onClick={() => handleSelectPlace(prediction.place_id, prediction.description)}
                className="w-full px-5 py-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 border-b border-gray-100 last:border-b-0 transition-all duration-200 first:rounded-t-xl last:rounded-b-xl active:scale-[0.98]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-base">📍</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold text-base truncate">
                      {prediction.structured_formatting.main_text}
                    </p>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {prediction.structured_formatting.secondary_text}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-blue-400 text-xl self-center">→</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
