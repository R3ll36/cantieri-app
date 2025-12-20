import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

// Collezione cantieri
const cantieriCollection = collection(db, 'cantieri');
const noteAutistiCollection = collection(db, 'note_autisti');

/**
 * CANTIERI - CRUD Operations
 */

// Crea nuovo cantiere
export const createCantiere = async (cantiereData) => {
  try {
    const docRef = await addDoc(cantieriCollection, {
      ...cantiereData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Errore creazione cantiere:', error);
    return { success: false, error: error.message };
  }
};

// Leggi tutti i cantieri
export const getCantieri = async () => {
  try {
    const querySnapshot = await getDocs(cantieriCollection);
    const cantieri = [];
    querySnapshot.forEach((doc) => {
      cantieri.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: cantieri };
  } catch (error) {
    console.error('Errore lettura cantieri:', error);
    return { success: false, error: error.message };
  }
};

// Leggi cantiere singolo
export const getCantiere = async (id) => {
  try {
    const docRef = doc(db, 'cantieri', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Cantiere non trovato' };
    }
  } catch (error) {
    console.error('Errore lettura cantiere:', error);
    return { success: false, error: error.message };
  }
};

// Aggiorna cantiere
export const updateCantiere = async (id, updates) => {
  try {
    const docRef = doc(db, 'cantieri', id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Errore aggiornamento cantiere:', error);
    return { success: false, error: error.message };
  }
};

// Elimina cantiere
export const deleteCantiere = async (id) => {
  try {
    const docRef = doc(db, 'cantieri', id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Errore eliminazione cantiere:', error);
    return { success: false, error: error.message };
  }
};

// Ascolta cantieri in real-time
export const subscribeToСantieri = (callback, filters = {}) => {
  let q = query(cantieriCollection);

  // Applica filtri se presenti
  if (filters.stato) {
    q = query(q, where('stato', '==', filters.stato));
  }
  if (filters.tipologia) {
    q = query(q, where('tipologia', '==', filters.tipologia));
  }

  // Ordina per data creazione (più recenti prima)
  q = query(q, orderBy('created_at', 'desc'));

  // Listener real-time
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const cantieri = [];
      snapshot.forEach((doc) => {
        cantieri.push({ id: doc.id, ...doc.data() });
      });
      callback({ success: true, data: cantieri });
    },
    (error) => {
      console.error('Errore real-time cantieri:', error);
      callback({ success: false, error: error.message });
    }
  );

  return unsubscribe; // Ritorna funzione per disiscriversi
};

/**
 * NOTE AUTISTI - CRUD Operations
 */

// Crea nuova nota autista
export const createNotaAutista = async (notaData) => {
  try {
    const docRef = await addDoc(noteAutistiCollection, {
      ...notaData,
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Errore creazione nota:', error);
    return { success: false, error: error.message };
  }
};

// Leggi note per un cantiere specifico
export const getNoteAutisti = async (cantiereId) => {
  try {
    const q = query(
      noteAutistiCollection,
      where('cantiere_id', '==', cantiereId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const note = [];
    querySnapshot.forEach((doc) => {
      note.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: note };
  } catch (error) {
    console.error('Errore lettura note:', error);
    return { success: false, error: error.message };
  }
};

// Ascolta note autisti in real-time per un cantiere
export const subscribeToNoteAutisti = (cantiereId, callback) => {
  const q = query(
    noteAutistiCollection,
    where('cantiere_id', '==', cantiereId),
    orderBy('timestamp', 'desc')
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const note = [];
      snapshot.forEach((doc) => {
        note.push({ id: doc.id, ...doc.data() });
      });
      callback({ success: true, data: note });
    },
    (error) => {
      console.error('Errore real-time note:', error);
      callback({ success: false, error: error.message });
    }
  );

  return unsubscribe;
};

// Elimina nota autista
export const deleteNotaAutista = async (id) => {
  try {
    const docRef = doc(db, 'note_autisti', id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Errore eliminazione nota:', error);
    return { success: false, error: error.message };
  }
};
