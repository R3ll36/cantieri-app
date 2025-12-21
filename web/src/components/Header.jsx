import { useState } from 'react';

export default function Header({ user, onLogout, view, setView }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleViewChange = (newView) => {
    setView(newView);
    setIsMenuOpen(false); // Chiudi menu dopo la selezione su mobile
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo e hamburger per mobile */}
        <div className="flex items-center gap-3">
          {/* Hamburger button - visibile solo su mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-200 focus:outline-none"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl" style={{ fontFamily: 'Arial Black, sans-serif' }}>GB</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">General Beton</h1>
              <p className="text-xs text-gray-500">Gestione Cantieri</p>
            </div>
          </div>
        </div>

        {/* Navigation desktop - visibile solo su schermi medi e grandi */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              view === 'list'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Lista
          </button>

          <button
            onClick={() => setView('map')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              view === 'map'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mappa
          </button>

          {!user?.isGuest && (
            <button
              onClick={() => setView('add')}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
            >
              Nuovo
            </button>
          )}

          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-300">
            <span className="text-sm text-gray-600">
              {user?.isGuest ? 'Ospite' : user.email}
            </span>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition"
            >
              Esci
            </button>
          </div>
        </div>

        {/* Menu mobile - visibile solo quando isMenuOpen è true */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 md:hidden">
            <div className="flex flex-col p-4 space-y-3 border-t border-gray-200">
              <button
                onClick={() => handleViewChange('list')}
                className={`px-4 py-3 rounded-lg font-semibold text-left transition ${
                  view === 'list'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Lista
              </button>

              <button
                onClick={() => handleViewChange('map')}
                className={`px-4 py-3 rounded-lg font-semibold text-left transition ${
                  view === 'map'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Mappa
              </button>

              {!user?.isGuest && (
                <button
                  onClick={() => handleViewChange('add')}
                  className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition text-left"
                >
                  Nuovo Cantiere
                </button>
              )}

              <div className="pt-3 border-t border-gray-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">
                    {user?.isGuest ? 'Ospite' : user.email}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition"
                >
                  Esci
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
