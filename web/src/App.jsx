import { useState, useEffect } from 'react';
import { subscribeToAuthState, loginWithEmail, loginWithGoogle, logout } from './firebase/auth';
import { subscribeToСantieri, createCantiere, updateCantiere, deleteCantiere } from './firebase/firestore';
import MapView from './components/MapView';
import CantieriList from './components/CantieriList';
import CantiereForm from './components/CantiereForm';
import NoteAutisti from './components/NoteAutisti';
import Header from './components/Header';
import Settings from './components/Settings';
import IOSInstallPrompt from './components/IOSInstallPrompt';
import { useTheme } from './context/ThemeContext';

function App() {
  const { colors } = useTheme();

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  // Stato autenticazione
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Stato cantieri
  const [cantieri, setCantieri] = useState([]);
  const [isLoadingCantieri, setIsLoadingCantieri] = useState(true);

  // UI State
  const [view, setView] = useState(() => {
    // Check hash URL for settings route
    const hash = window.location.hash.replace('#', '');
    return hash === 'settings' ? 'settings' : 'map';
  });
  const [selectedCantiere, setSelectedCantiere] = useState(null);
  const [clickedCoordinates, setClickedCoordinates] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Listen to hash changes for settings route
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'settings') {
        setView('settings');
      } else if (hash === '') {
        setView('map');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // PWA Install Prompt Handler
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Previeni il mini-infobar default del browser
      e.preventDefault();
      // Salva l'evento per usarlo dopo
      setDeferredPrompt(e);
      // Mostra il banner custom solo se non è già installata
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      if (!isStandalone) {
        // Aspetta 2 secondi prima di mostrare il banner
        setTimeout(() => setShowInstallBanner(true), 2000);
      }
    };

    // Controlla se già installata
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const wasDismissed = localStorage.getItem('pwa-banner-dismissed');
    const dismissedTime = wasDismissed ? parseInt(wasDismissed) : 0;
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const isDismissedRecently = Date.now() - dismissedTime < sevenDays;

    // Se non è installata, non è stata dismissata di recente, e siamo su mobile, mostra il banner
    if (!isStandalone && !isDismissedRecently) {
      // Mostra banner dopo 3 secondi per dare tempo al beforeinstallprompt
      setTimeout(() => {
        // Se siamo su iOS Safari (non supporta beforeinstallprompt)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isIOS || (isMobile && !deferredPrompt)) {
          // Mostra banner anche senza deferredPrompt (per iOS e mobile senza supporto)
          setShowInstallBanner(true);
        }
      }, 3000);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Ascolta stato autenticazione
  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Ascolta cantieri real-time
  useEffect(() => {
    const unsubscribe = subscribeToСantieri((result) => {
      if (result.success) {
        setCantieri(result.data);
      }
      setIsLoadingCantieri(false);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginWithEmail(email, password);
    if (!result.success) {
      alert(`Errore login: ${result.error}`);
    }
  };

  // Google login handler
  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (!result.success) {
      alert(`Errore login Google: ${result.error}`);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await logout();
  };

  // Crea cantiere
  const handleCreateCantiere = async (cantiereData) => {
    setIsSubmitting(true);
    const result = await createCantiere({
      ...cantiereData,
      created_by: user?.uid || 'anonymous',
    });

    setIsSubmitting(false);

    if (result.success) {
      alert('✅ Cantiere creato con successo!');
      setView('list');
      setClickedCoordinates(null);
    } else {
      alert(`Errore: ${result.error}`);
    }
  };

  // Modifica cantiere
  const handleUpdateCantiere = async (cantiereData) => {
    setIsSubmitting(true);
    const result = await updateCantiere(selectedCantiere.id, cantiereData);
    setIsSubmitting(false);

    if (result.success) {
      alert('✅ Cantiere aggiornato!');
      setView('list');
      setSelectedCantiere(null);
    } else {
      alert(`Errore: ${result.error}`);
    }
  };

  // Elimina cantiere
  const handleDeleteCantiere = async (id) => {
    const result = await deleteCantiere(id);
    if (result.success) {
      alert('✅ Cantiere eliminato');
    } else {
      alert(`Errore: ${result.error}`);
    }
  };

  // Click su mappa per aggiungere cantiere
  const handleMapClick = (latlng) => {
    if (!user) {
      alert('Devi essere autenticato per aggiungere cantieri');
      return;
    }
    setClickedCoordinates({ lat: latlng.lat, lng: latlng.lng });
    setView('add');
  };

  // Click su cantiere da lista o mappa
  const handleCantiereClick = (cantiere) => {
    setSelectedCantiere(cantiere);
    setView('detail');
  };

  // Install PWA
  const handleInstallPWA = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isIOS) {
      // Su iOS, mostra tutorial visivo interattivo
      setShowIOSPrompt(true);
      setShowInstallBanner(false);
      return;
    }

    if (!deferredPrompt) {
      // Android/Mobile senza supporto prompt - mostra istruzioni
      alert(
        '📱 Per installare l\'app:\n\n' +
        'Apri il menu del browser (⋮) e seleziona "Aggiungi a schermata Home" o "Installa app"'
      );
      setShowInstallBanner(false);
      return;
    }

    // Android con supporto nativo - PROMPT AUTOMATICO
    try {
      deferredPrompt.prompt();

      // Aspetta la risposta dell'utente
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA installation outcome: ${outcome}`);

      if (outcome === 'accepted') {
        console.log('✅ PWA installata con successo!');
      }

      // Resetta il prompt
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    } catch (error) {
      console.error('Errore durante installazione PWA:', error);
      setShowInstallBanner(false);
    }
  };

  // Dismiss PWA banner
  const handleDismissBanner = () => {
    setShowInstallBanner(false);
    // Salva in localStorage per non mostrarlo di nuovo per 7 giorni
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
  };

  // Loading
  if (isAuthLoading || isLoadingCantieri) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: colors.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            animation: 'spin 1s linear infinite',
            borderRadius: '50%',
            height: '64px',
            width: '64px',
            borderBottom: `2px solid ${colors.primary}`,
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: colors.textSecondary }}>Caricamento...</p>
        </div>
      </div>
    );
  }

  // Login screen (se non autenticato)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            {/* Logo General Beton */}
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-black text-3xl" style={{ fontFamily: 'Arial Black, sans-serif' }}>GB</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">General Beton</h1>
            <p className="text-gray-600">Gestione Cantieri Calcestruzzo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="tua@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition"
            >
              Accedi
            </button>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Oppure</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="mt-4 w-full px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition border border-gray-300 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Accedi con Google
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              👁️ <strong>Modalità Visualizzazione:</strong> Puoi vedere i cantieri anche senza login
            </p>
            <button
              onClick={() => setUser({ displayName: 'Ospite', isGuest: true })}
              className="mt-3 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
            >
              Continua come Ospite
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main app UI
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header con menu mobile responsive */}
      <Header user={user} onLogout={handleLogout} view={view} setView={setView} />

      {/* iOS Install Prompt - Tutorial visivo */}
      {showIOSPrompt && (
        <IOSInstallPrompt onClose={() => setShowIOSPrompt(false)} />
      )}

      {/* PWA Install Banner - mostra su mobile e desktop */}
      {showInstallBanner && (
        <div
          style={{
            position: 'fixed',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            width: 'calc(100% - 2rem)',
            maxWidth: '500px',
            backgroundColor: colors.surface,
            borderRadius: '1rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            padding: '1rem',
            border: `2px solid ${colors.primary}`,
            animation: 'slideInUp 0.4s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: colors.primary,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontSize: '1.5rem' }}>📱</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontWeight: 'bold',
                color: colors.textPrimary,
                marginBottom: '0.25rem',
                fontSize: '0.95rem'
              }}>
                Installa General Beton
              </p>
              <p style={{
                fontSize: '0.8rem',
                color: colors.textSecondary,
                lineHeight: '1.3'
              }}>
                Aggiungi l'app alla schermata home per accesso rapido
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '1rem'
          }}>
            <button
              onClick={handleInstallPWA}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: colors.primary,
                color: colors.textWhite,
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Installa
            </button>
            <button
              onClick={handleDismissBanner}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: colors.buttonInactiveBg,
                color: colors.textSecondary,
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main style={{ flex: 1 }} className="container mx-auto px-4 py-6">
        {/* Vista Settings */}
        {view === 'settings' && (
          <div className="view-transition">
            <Settings />
          </div>
        )}

        {/* Vista Lista */}
        {view === 'list' && (
          <div className="view-transition">
            <CantieriList
              cantieri={cantieri}
              onCantiereClick={handleCantiereClick}
              onEdit={!user.isGuest ? (cantiere) => {
                setSelectedCantiere(cantiere);
                setView('edit');
              } : undefined}
              onDelete={!user.isGuest ? handleDeleteCantiere : undefined}
            />
          </div>
        )}

        {/* Vista Mappa */}
        {view === 'map' && (
          <div className="h-[calc(100vh-180px)] view-transition">
            <MapView
              cantieri={cantieri}
              onCantiereClick={handleCantiereClick}
              onMapClick={!user.isGuest ? handleMapClick : undefined}
            />
          </div>
        )}

        {/* Form Aggiungi Cantiere */}
        {view === 'add' && !user.isGuest && (
          <div className="view-transition">
            <CantiereForm
            initialCoordinates={clickedCoordinates}
            onSubmit={handleCreateCantiere}
            onCancel={() => {
              setView('list');
              setClickedCoordinates(null);
            }}
            isLoading={isSubmitting}
          />
          </div>
        )}

        {/* Form Modifica Cantiere */}
        {view === 'edit' && selectedCantiere && !user.isGuest && (
          <div className="view-transition">
            <CantiereForm
              initialData={selectedCantiere}
              onSubmit={handleUpdateCantiere}
              onCancel={() => {
                setView('list');
                setSelectedCantiere(null);
              }}
              isLoading={isSubmitting}
            />
          </div>
        )}

        {/* Dettaglio Cantiere */}
        {view === 'detail' && selectedCantiere && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 view-transition">
            {/* Colonna sinistra: Dettagli cantiere */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedCantiere.nome}</h2>
                  <p className="text-gray-600">{selectedCantiere.indirizzo}</p>
                </div>
                <button
                  onClick={() => setView('list')}
                  className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
                >
                  ✕ Chiudi
                </button>
              </div>

              {/* Info cantiere */}
              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Tipologia:</span>
                    <p className="font-medium">{selectedCantiere.tipologia}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Difficoltà:</span>
                    <p className="font-medium">{selectedCantiere.difficolta}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Stato:</span>
                    <p className="font-medium">{selectedCantiere.stato}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Orari:</span>
                    <p className="font-medium">{selectedCantiere.orari || 'N/D'}</p>
                  </div>
                  {selectedCantiere.cliente && (
                    <div>
                      <span className="text-gray-500">Cliente:</span>
                      <p className="font-medium">{selectedCantiere.cliente}</p>
                    </div>
                  )}
                  {selectedCantiere.coordinatore_nome && (
                    <div>
                      <span className="text-gray-500">Coordinatore:</span>
                      <p className="font-medium">
                        {selectedCantiere.coordinatore_nome}
                        {selectedCantiere.coordinatore_telefono && (
                          <a
                            href={`tel:${selectedCantiere.coordinatore_telefono}`}
                            className="block text-blue-500 hover:underline"
                          >
                            {selectedCantiere.coordinatore_telefono}
                          </a>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {selectedCantiere.note_operative && (
                  <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                    <p className="text-xs font-semibold text-yellow-800 mb-1">📝 Note operative:</p>
                    <p className="text-sm text-yellow-900">{selectedCantiere.note_operative}</p>
                  </div>
                )}
              </div>

              {/* Foto cantiere */}
              {selectedCantiere.foto_urls && selectedCantiere.foto_urls.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Foto Cantiere</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedCantiere.foto_urls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={url}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg hover:opacity-90 transition"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Link Google Maps */}
              {selectedCantiere.maps_link && (
                <a
                  href={selectedCantiere.maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white text-center font-semibold rounded-lg transition"
                >
                  🗺️ Apri in Google Maps
                </a>
              )}
            </div>

            {/* Colonna destra: Note autisti */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <NoteAutisti cantiereId={selectedCantiere.id} currentUser={user} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: colors.surface,
        borderTop: `1px solid ${colors.border}`,
        padding: '1rem 0'
      }}>
        <div className="container mx-auto px-4 text-center" style={{
          fontSize: '0.875rem',
          color: colors.textSecondary
        }}>
          <p>General Beton v1.0 • Gestione Cantieri</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
