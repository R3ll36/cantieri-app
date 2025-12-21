import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './config';

const SETTINGS_DOC_ID = 'app-global-settings';

/**
 * Recupera le impostazioni globali da Firestore
 */
export async function getGlobalSettings() {
  try {
    const settingsRef = doc(db, 'settings', SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists()) {
      return {
        success: true,
        data: settingsSnap.data()
      };
    } else {
      // Se non esistono impostazioni, ritorna null
      return {
        success: true,
        data: null
      };
    }
  } catch (error) {
    console.error('Errore nel recupero impostazioni globali:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Salva le impostazioni globali su Firestore
 */
export async function saveGlobalSettings(settings) {
  try {
    const settingsRef = doc(db, 'settings', SETTINGS_DOC_ID);

    await setDoc(settingsRef, {
      ...settings,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return {
      success: true
    };
  } catch (error) {
    console.error('Errore nel salvataggio impostazioni globali:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Ascolta i cambiamenti delle impostazioni globali in real-time
 */
export function subscribeToGlobalSettings(callback) {
  const settingsRef = doc(db, 'settings', SETTINGS_DOC_ID);

  const unsubscribe = onSnapshot(settingsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback({
          success: true,
          data: snapshot.data()
        });
      } else {
        callback({
          success: true,
          data: null
        });
      }
    },
    (error) => {
      console.error('Errore nel subscription impostazioni:', error);
      callback({
        success: false,
        error: error.message
      });
    }
  );

  return unsubscribe;
}
