import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from './config';

/**
 * Login con email e password
 */
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Errore login:', error);
    let errorMessage = 'Errore durante il login';

    // Messaggi errore user-friendly
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Email non valida';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Utente disabilitato';
        break;
      case 'auth/user-not-found':
        errorMessage = 'Utente non trovato';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Password errata';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Credenziali non valide';
        break;
      default:
        errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};

/**
 * Registrazione nuovo utente
 */
export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Errore registrazione:', error);
    let errorMessage = 'Errore durante la registrazione';

    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Email già registrata';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email non valida';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password troppo debole (minimo 6 caratteri)';
        break;
      default:
        errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};

/**
 * Logout
 */
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Errore logout:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Reset password
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Errore reset password:', error);
    let errorMessage = 'Errore durante il reset password';

    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Email non valida';
        break;
      case 'auth/user-not-found':
        errorMessage = 'Utente non trovato';
        break;
      default:
        errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};

/**
 * Login con Google
 */
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account', // Forza selezione account ogni volta
    });

    const result = await signInWithPopup(auth, provider);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Errore login Google:', error);
    let errorMessage = 'Errore durante il login con Google';

    switch (error.code) {
      case 'auth/popup-closed-by-user':
        errorMessage = 'Login annullato';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'Popup bloccato dal browser. Abilita i popup per questo sito.';
        break;
      case 'auth/cancelled-popup-request':
        errorMessage = 'Login annullato';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'Esiste già un account con questa email ma con metodo di login diverso';
        break;
      default:
        errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};

/**
 * Ascolta cambiamenti stato autenticazione
 * @param {Function} callback - Funzione chiamata quando stato cambia
 * @returns {Function} Funzione per disiscriversi
 */
export const subscribeToAuthState = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
