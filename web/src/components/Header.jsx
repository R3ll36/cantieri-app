import { useState } from 'react';

/**
 * Header semplice come all'inizio del progetto
 */
export default function Header({ user, onLogout, view, setView }) {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo - cliccabile per tornare alla lista */}
        <div
          className="cursor-pointer"
          onClick={() => setView('list')}
        >
          <img
            src="/logo-general-beton.svg"
            alt="General Beton"
            style={{ height: '50px', width: 'auto' }}
          />
        </div>

        {/* Desktop Navigation - sempre visibile */}
        <div className="flex items-center gap-4">
          {/* Bottoni navigazione */}
          <div className="flex gap-2">
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
          </div>

          {/* User info e logout */}
          <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
}
