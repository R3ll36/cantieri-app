import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

/**
 * Upload foto/video su Firebase Storage
 * @param {File} file - File da caricare
 * @param {string} cantiereId - ID del cantiere
 * @param {string} folder - 'originali' o 'note-autisti'
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadMedia = async (file, cantiereId, folder = 'originali') => {
  try {
    // Genera nome file unico con timestamp
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `cantieri-foto/${cantiereId}/${folder}/${fileName}`;

    // Crea riferimento Storage
    const storageRef = ref(storage, filePath);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);

    // Ottieni URL pubblico
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('Errore upload media:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload multipli (array di file)
 * @param {File[]} files - Array di file
 * @param {string} cantiereId - ID del cantiere
 * @param {string} folder - 'originali' o 'note-autisti'
 * @returns {Promise<{success: boolean, urls?: string[], error?: string}>}
 */
export const uploadMultipleMedia = async (files, cantiereId, folder = 'originali') => {
  try {
    const uploadPromises = files.map((file) => uploadMedia(file, cantiereId, folder));
    const results = await Promise.all(uploadPromises);

    // Verifica se tutti gli upload sono riusciti
    const allSuccess = results.every((result) => result.success);

    if (allSuccess) {
      const urls = results.map((result) => result.url);
      return { success: true, urls };
    } else {
      const errors = results.filter((r) => !r.success).map((r) => r.error);
      return { success: false, error: errors.join(', ') };
    }
  } catch (error) {
    console.error('Errore upload multiplo:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Elimina media da Storage
 * @param {string} url - URL completo del file da eliminare
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteMedia = async (url) => {
  try {
    // Estrai path da URL
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
    return { success: true };
  } catch (error) {
    console.error('Errore eliminazione media:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Valida file (dimensione max, tipo)
 * @param {File} file - File da validare
 * @param {number} maxSizeMB - Dimensione massima in MB (default 5MB)
 * @returns {{valid: boolean, error?: string}}
 */
export const validateMediaFile = (file, maxSizeMB = 5) => {
  // Verifica dimensione (converti MB a bytes)
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File troppo grande. Massimo ${maxSizeMB}MB, il tuo file è ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)}MB`,
    };
  }

  // Verifica tipo file
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo file non valido. Usa JPG, PNG, WEBP per immagini o MP4 per video',
    };
  }

  return { valid: true };
};
