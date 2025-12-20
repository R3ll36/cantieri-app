import { useState } from 'react';

/**
 * Header con menu hamburger per mobile
 */
export default function Header({ user, onLogout, view, setView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (newView) => {
    setView(newView);
    setMobileMenuOpen(false); // Chiudi menu dopo navigazione
  };

  return (
    <header className="bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg sticky top-0 z-[1001]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Titolo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🚛</span>
            </div>
            <div>
              <h1 className="text-xl font-bold hidden sm:block">Cantieri App</h1>
              <h1 className="text-lg font-bold sm:hidden">Cantieri</h1>
              <p className="text-xs opacity-90 hidden sm:block">Gestione Cantieri</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg transition font-semibold ${
                view === 'list'
                  ? 'bg-white text-primary-600'
                  : 'hover:bg-primary-600'
              }`}
            >
              📋 Lista
            </button>
            <button
              onClick={() => setView('map')}
              className={`px-4 py-2 rounded-lg transition font-semibold ${
                view === 'map'
                  ? 'bg-white text-primary-600'
                  : 'hover:bg-primary-600'
              }`}
            >
              🗺️ Mappa
            </button>
            {!user?.isGuest && (
              <button
                onClick={() => setView('add')}
                className={`px-4 py-2 rounded-lg transition font-semibold ${
                  view === 'add'
                    ? 'bg-white text-primary-600'
                    : 'hover:bg-primary-600'
                }`}
              >
                ➕ Aggiungi
              </button>
            )}

            {/* User Info e Logout */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/30">
              <span className="text-sm opacity-90">
                {user?.displayName || user?.email || 'Ospite'}
              </span>
              {!user?.isGuest && (
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-semibold transition"
                >
                  Logout
                </button>
              )}
            </div>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 hover:bg-primary-600 rounded-lg transition"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              // X icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon (3 lines)
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-white/20 mt-2 pt-4 animate-slide-down">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleNavigation('list')}
                className={`px-4 py-3 rounded-lg transition font-semibold text-left ${
                  view === 'list'
                    ? 'bg-white text-primary-600'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                📋 Lista Cantieri
              </button>
              <button
                onClick={() => handleNavigation('map')}
                className={`px-4 py-3 rounded-lg transition font-semibold text-left ${
                  view === 'map'
                    ? 'bg-white text-primary-600'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                🗺️ Mappa
              </button>
              {!user?.isGuest && (
                <button
                  onClick={() => handleNavigation('add')}
                  className={`px-4 py-3 rounded-lg transition font-semibold text-left ${
                    view === 'add'
                      ? 'bg-white text-primary-600'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  ➕ Aggiungi Cantiere
                </button>
              )}

              {/* User Info */}
              <div className="px-4 py-2 mt-2 border-t border-white/20">
                <p className="text-sm opacity-90 mb-2">
                  👤 {user?.displayName || user?.email || 'Ospite'}
                </p>
                {!user?.isGuest && (
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-semibold transition"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
