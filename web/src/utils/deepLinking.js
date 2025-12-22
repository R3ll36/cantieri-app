/**
 * Deep Linking Utility per Google Maps
 * Permette di aprire link Google Maps ricevuti da WhatsApp direttamente nell'app PWA
 */

/**
 * Estrae coordinate e informazioni da un link Google Maps
 * Supporta formati:
 * - https://maps.google.com/?q=lat,lng
 * - https://www.google.com/maps/@lat,lng,zoom
 * - https://goo.gl/maps/xxxxx
 * - https://maps.app.goo.gl/xxxxx
 */
export function parseGoogleMapsLink(url) {
  try {
    const urlObj = new URL(url);

    // Formato: ?q=lat,lng o ?q=indirizzo
    if (urlObj.searchParams.has('q')) {
      const q = urlObj.searchParams.get('q');
      const coords = q.split(',');
      if (coords.length === 2) {
        return {
          lat: parseFloat(coords[0]),
          lng: parseFloat(coords[1]),
          address: q
        };
      }
      return { address: q };
    }

    // Formato: /@lat,lng,zoom
    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2])
      };
    }

    // Formato: /place/nome/@lat,lng
    const placeMatch = url.match(/\/place\/([^/]+)\/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (placeMatch) {
      return {
        lat: parseFloat(placeMatch[2]),
        lng: parseFloat(placeMatch[3]),
        address: decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
      };
    }

    return null;
  } catch (error) {
    console.error('Errore parsing Google Maps link:', error);
    return null;
  }
}

/**
 * Gestisce URL ricevuti dall'esterno (WhatsApp, email, ecc.)
 */
export function handleIncomingURL(url, callback) {
  if (!url) return false;

  // Verifica se è un link Google Maps
  if (url.includes('google.com/maps') || url.includes('maps.google') || url.includes('goo.gl/maps')) {
    const location = parseGoogleMapsLink(url);
    if (location && callback) {
      callback(location);
      return true;
    }
  }

  return false;
}

/**
 * Inizializza il listener per deep links
 */
export function initDeepLinking(onLocationReceived) {
  // Controlla URL iniziale (quando app viene aperta da link)
  const urlParams = new URLSearchParams(window.location.search);
  const mapUrl = urlParams.get('map') || urlParams.get('url');

  if (mapUrl) {
    handleIncomingURL(mapUrl, onLocationReceived);
  }

  // Listener per Web Share Target API (se configurato nel manifest)
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SHARE_TARGET') {
        const { url } = event.data;
        handleIncomingURL(url, onLocationReceived);
      }
    });
  }
}
