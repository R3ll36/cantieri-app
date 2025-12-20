/**
 * Utility per parsing link Google Maps e Apple Maps
 * Supporta formati:
 * - https://maps.google.com/?q=46.022747,13.125890
 * - https://maps.app.goo.gl/Nz3qn49qHQ6ds31J8
 * - https://maps.apple.com/?ll=46.022747,13.125890
 * - https://maps.apple.com/?address=Via%20Roma%20123
 */

/**
 * Estrae coordinate da link Google/Apple Maps
 * @param {string} url - Link Maps da parsare
 * @returns {Promise<{success: boolean, lat?: number, lng?: number, error?: string}>}
 */
export const parseMapLink = async (url) => {
  if (!url || typeof url !== 'string') {
    return { success: false, error: 'URL non valido' };
  }

  try {
    // 1. Google Maps formato standard: ?q=LAT,LNG
    const googleQMatch = url.match(/[?&]q=([-\d.]+),([-\d.]+)/);
    if (googleQMatch) {
      return {
        success: true,
        lat: parseFloat(googleQMatch[1]),
        lng: parseFloat(googleQMatch[2]),
      };
    }

    // 2. Apple Maps formato: ?ll=LAT,LNG
    const appleLLMatch = url.match(/[?&]ll=([-\d.]+),([-\d.]+)/);
    if (appleLLMatch) {
      return {
        success: true,
        lat: parseFloat(appleLLMatch[1]),
        lng: parseFloat(appleLLMatch[2]),
      };
    }

    // 3. Google Maps @ formato: @LAT,LNG
    const googleAtMatch = url.match(/@([-\d.]+),([-\d.]+)/);
    if (googleAtMatch) {
      return {
        success: true,
        lat: parseFloat(googleAtMatch[1]),
        lng: parseFloat(googleAtMatch[2]),
      };
    }

    // 4. Google Maps short link (goo.gl) - richiede fetch per espandere
    if (url.includes('maps.app.goo.gl') || url.includes('goo.gl')) {
      return await expandShortLink(url);
    }

    // 5. Apple Maps con indirizzo - richiede geocoding
    if (url.includes('maps.apple.com') && url.includes('address=')) {
      const addressMatch = url.match(/address=([^&]+)/);
      if (addressMatch) {
        const address = decodeURIComponent(addressMatch[1]);
        return await geocodeAddress(address);
      }
    }

    // Nessun formato riconosciuto
    return {
      success: false,
      error: 'Formato link non riconosciuto. Usa link da Google Maps o Apple Maps con coordinate.',
    };
  } catch (error) {
    console.error('Errore parsing link:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Espande short link Google Maps (goo.gl) seguendo redirect
 * @param {string} shortUrl - Short URL da espandere
 * @returns {Promise<{success: boolean, lat?: number, lng?: number, error?: string}>}
 */
const expandShortLink = async (shortUrl) => {
  try {
    // Fetch con mode 'cors' per seguire redirect
    const response = await fetch(shortUrl, {
      method: 'HEAD',
      redirect: 'follow',
    });

    // URL finale dopo redirect
    const finalUrl = response.url;

    // Prova a estrarre coordinate dall'URL espanso
    return await parseMapLink(finalUrl);
  } catch (error) {
    console.error('Errore espansione short link:', error);
    return {
      success: false,
      error: 'Impossibile espandere short link. Usa link completo con coordinate.',
    };
  }
};

/**
 * Geocoding: converte indirizzo in coordinate usando API Nominatim (OpenStreetMap - GRATUITA)
 * @param {string} address - Indirizzo da geocodificare
 * @returns {Promise<{success: boolean, lat?: number, lng?: number, error?: string}>}
 */
const geocodeAddress = async (address) => {
  try {
    // Usa Nominatim API (OpenStreetMap) - GRATUITA
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'CantieriApp/1.0', // Richiesto da Nominatim
        },
      }
    );

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        success: true,
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    } else {
      return {
        success: false,
        error: 'Indirizzo non trovato. Prova con coordinate esatte.',
      };
    }
  } catch (error) {
    console.error('Errore geocoding:', error);
    return { success: false, error: 'Errore conversione indirizzo in coordinate' };
  }
};

/**
 * Reverse geocoding: converte coordinate in indirizzo
 * @param {number} lat - Latitudine
 * @param {number} lng - Longitudine
 * @returns {Promise<{success: boolean, address?: string, error?: string}>}
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: {
          'User-Agent': 'CantieriApp/1.0',
        },
      }
    );

    const data = await response.json();

    if (data && data.display_name) {
      return {
        success: true,
        address: data.display_name,
      };
    } else {
      return {
        success: false,
        error: 'Indirizzo non trovato per queste coordinate',
      };
    }
  } catch (error) {
    console.error('Errore reverse geocoding:', error);
    return { success: false, error: 'Errore conversione coordinate in indirizzo' };
  }
};

/**
 * Genera link Google Maps da coordinate in modalità DIREZIONI
 * Apre direttamente il navigatore con percorso dalla posizione attuale
 * @param {number} lat - Latitudine destinazione
 * @param {number} lng - Longitudine destinazione
 * @returns {string} Link Google Maps in modalità direzioni
 */
export const generateGoogleMapsLink = (lat, lng) => {
  // Formato per aprire direttamente in modalità direzioni:
  // - saddr=Current+Location (partenza dalla posizione attuale)
  // - daddr=LAT,LNG (destinazione)
  // - directionsmode=driving (modalità auto)
  return `https://maps.google.com/maps?saddr=Current+Location&daddr=${lat},${lng}&directionsmode=driving`;
};

/**
 * Apre Google Maps in modalità direzioni (nuova tab)
 * @param {number} lat - Latitudine destinazione
 * @param {number} lng - Longitudine destinazione
 */
export const openGoogleMapsDirections = (lat, lng) => {
  const link = generateGoogleMapsLink(lat, lng);
  window.open(link, '_blank');
};

/**
 * Valida coordinate
 * @param {number} lat - Latitudine
 * @param {number} lng - Longitudine
 * @returns {{valid: boolean, error?: string}}
 */
export const validateCoordinates = (lat, lng) => {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return { valid: false, error: 'Coordinate non numeriche' };
  }

  if (lat < -90 || lat > 90) {
    return { valid: false, error: 'Latitudine deve essere tra -90 e 90' };
  }

  if (lng < -180 || lng > 180) {
    return { valid: false, error: 'Longitudine deve essere tra -180 e 180' };
  }

  return { valid: true };
};
