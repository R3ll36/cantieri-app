export default function Header({ user, onLogout, view, setView }) {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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

        {/* Navigation */}
        <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
}
