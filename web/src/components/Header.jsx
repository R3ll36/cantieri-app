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
    <header className="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-[1001]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo General Beton */}
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-md px-3 py-1.5 shadow-md" style={{ height: '42px' }}>
              {/* Logo General Beton - forma originale curva */}
              <svg viewBox="0 0 340 80" style={{ height: '100%', width: 'auto' }}>
                {/* Forma curva rossa superiore e inferiore */}
                <path d="M 20,40 Q 0,20 20,10 L 320,10 Q 340,20 340,40 Q 340,60 320,70 L 20,70 Q 0,60 20,40 Z" fill="#C41E3A" />
                {/* Ellisse bianca centrale */}
                <ellipse cx="170" cy="40" rx="150" ry="28" fill="white" />
                {/* Testo "general beton" */}
                <text x="170" y="50" fontFamily="Arial Black, sans-serif" fontSize="22" fontWeight="900" fill="#000" textAnchor="middle">
                  general beton
                </text>
              </svg>
            </div>
          </div>

          {/* Desktop and Tablet Navigation (hidden on mobile < 768px) */}
          <nav className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg transition font-semibold ${
                view === 'list'
                  ? 'bg-white text-blue-600'
                  : 'hover:bg-blue-700'
              }`}
            >
              📋 Lista
            </button>
            <button
              onClick={() => setView('map')}
              className={`px-4 py-2 rounded-lg transition font-semibold ${
                view === 'map'
                  ? 'bg-white text-blue-600'
                  : 'hover:bg-blue-700'
              }`}
            >
              🗺️ Mappa
            </button>
            {!user?.isGuest && (
              <button
                onClick={() => setView('add')}
                className={`px-4 py-2 rounded-lg transition font-semibold ${
                  view === 'add'
                    ? 'bg-white text-blue-600'
                    : 'hover:bg-blue-700'
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

          {/* Mobile Hamburger Button (only mobile < 768px) */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 bg-white hover:bg-gray-100 rounded-lg transition shadow-md"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              // X icon (nero)
              <svg className="w-6 h-6" fill="none" stroke="#000" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon (3 linee nere)
              <svg className="w-6 h-6" fill="none" stroke="#000" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown (only < 768px) */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-white/20 mt-2 pt-4 animate-slide-down">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleNavigation('list')}
                className={`px-4 py-3 rounded-lg transition font-semibold text-left ${
                  view === 'list'
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                📋 Lista Cantieri
              </button>
              <button
                onClick={() => handleNavigation('map')}
                className={`px-4 py-3 rounded-lg transition font-semibold text-left ${
                  view === 'map'
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                🗺️ Mappa
              </button>
              {!user?.isGuest && (
                <button
                  onClick={() => handleNavigation('add')}
                  className={`px-4 py-3 rounded-lg transition font-semibold text-left ${
                    view === 'add'
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-600 hover:bg-blue-700'
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
