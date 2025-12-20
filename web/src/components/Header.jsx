import { useState } from 'react';

/**
 * Header con logo e navigazione desktop/mobile
 */
export default function Header({ user, onLogout, view, setView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (newView) => {
    setView(newView);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-[1001]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo General Beton - cliccabile per homepage */}
          <div
            className="cursor-pointer animate-fade-in-scale"
            onClick={() => setView('list')}
            title="Torna alla homepage"
          >
            <img
              src="/logo-general-beton.svg"
              alt="General Beton"
              className="transition hover:scale-105"
              style={{ height: '50px', width: 'auto', maxWidth: '250px' }}
            />
          </div>

          {/* Desktop Navigation - SEMPRE visibile su schermi >= 1024px */}
          <div className="hidden lg:flex items-center gap-4">
            <nav className="flex gap-2">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  view === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📋 Lista
              </button>

              <button
                onClick={() => setView('map')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  view === 'map'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🗺️ Mappa
              </button>

              {!user?.isGuest && (
                <button
                  onClick={() => {
                    setView('add');
                  }}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
                >
                  ➕ Nuovo
                </button>
              )}
            </nav>

            {/* User info e logout */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-300">
              <span className="text-sm text-gray-600">
                {user?.displayName || user?.email || 'Ospite'}
              </span>
              {!user?.isGuest && (
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition"
                >
                  Esci
                </button>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Button - SOLO < 1024px */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg transition hover:bg-gray-100"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              // X icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon (3 linee)
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown - SOLO < 1024px */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 border-t border-gray-200 mt-4 pt-4 animate-slide-down">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleNavigation('list')}
                className={`px-4 py-3 rounded-lg transition font-semibold text-left ${
                  view === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📋 Lista Cantieri
              </button>

              <button
                onClick={() => handleNavigation('map')}
                className={`px-4 py-3 rounded-lg transition font-semibold text-left ${
                  view === 'map'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🗺️ Mappa
              </button>

              {!user?.isGuest && (
                <button
                  onClick={() => handleNavigation('add')}
                  className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition text-left"
                >
                  ➕ Aggiungi Cantiere
                </button>
              )}

              {/* User Info mobile */}
              <div className="px-4 py-3 mt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  👤 {user?.displayName || user?.email || 'Ospite'}
                </p>
                {!user?.isGuest && (
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition"
                  >
                    Esci
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
