import { useState } from 'react';
import { generateGoogleMapsLink, openGoogleMapsDirections } from '../utils/mapsLinkParser';
import { useTheme } from '../hooks/useTheme';

/**
 * Lista cantieri con filtri e ricerca
 * @param {Object} props
 * @param {Array} props.cantieri - Lista cantieri
 * @param {Function} props.onCantiereClick - Callback click su cantiere
 * @param {Function} props.onEdit - Callback modifica cantiere
 * @param {Function} props.onDelete - Callback elimina cantiere
 */
export default function CantieriList({ cantieri = [], onCantiereClick, onEdit, onDelete }) {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStato, setFilterStato] = useState('all');
  const [filterTipologia, setFilterTipologia] = useState('all');
  const [sortBy, setSortBy] = useState('created_at'); // created_at, nome, difficolta

  // Filtra cantieri
  const filteredCantieri = cantieri.filter((cantiere) => {
    // Ricerca per nome/indirizzo
    const matchesSearch =
      cantiere.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cantiere.indirizzo?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro stato
    const matchesStato = filterStato === 'all' || cantiere.stato === filterStato;

    // Filtro tipologia
    const matchesTipologia = filterTipologia === 'all' || cantiere.tipologia === filterTipologia;

    return matchesSearch && matchesStato && matchesTipologia;
  });

  // Ordina cantieri
  const sortedCantieri = [...filteredCantieri].sort((a, b) => {
    if (sortBy === 'nome') {
      return a.nome.localeCompare(b.nome);
    } else if (sortBy === 'difficolta') {
      const order = { Facile: 1, Medio: 2, Difficile: 3 };
      return order[b.difficolta] - order[a.difficolta]; // Difficile prima
    } else {
      // created_at - più recenti prima
      return (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0);
    }
  });

  // Copia link Google Maps
  const handleCopyLink = (cantiere) => {
    const link = cantiere.maps_link || generateGoogleMapsLink(cantiere.coordinate.lat, cantiere.coordinate.lng);
    navigator.clipboard.writeText(link);
    alert('✅ Link copiato negli appunti!');
  };

  // Apri navigazione Google Maps
  const handleNavigate = (cantiere) => {
    openGoogleMapsDirections(cantiere.coordinate.lat, cantiere.coordinate.lng);
  };

  return (
    <div className="max-w-7xl mx-auto" style={{
      backgroundColor: colors.surface,
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgb(0 0 0/0.1)',
      padding: '1.5rem',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: colors.textPrimary
      }}>
        Lista Cantieri
      </h2>

      {/* Barra ricerca e filtri */}
      <div className="space-y-3 mb-4">
        {/* Ricerca */}
        <input
          type="text"
          placeholder="🔍 Cerca per nome o indirizzo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            border: `1px solid ${colors.border}`,
            borderRadius: '0.5rem',
            backgroundColor: colors.surface,
            color: colors.textPrimary
          }}
        />

        {/* Filtri */}
        <div className="grid grid-cols-3 gap-3">
          <select
            value={filterStato}
            onChange={(e) => setFilterStato(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: `1px solid ${colors.border}`,
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              backgroundColor: colors.surface,
              color: colors.textPrimary
            }}
          >
            <option value="all">Tutti gli stati</option>
            <option value="Attivo">Attivo</option>
            <option value="Completato">Completato</option>
            <option value="Sospeso">Sospeso</option>
          </select>

          <select
            value={filterTipologia}
            onChange={(e) => setFilterTipologia(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: `1px solid ${colors.border}`,
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              backgroundColor: colors.surface,
              color: colors.textPrimary
            }}
          >
            <option value="all">Tutte le tipologie</option>
            <option value="Residenziale">Residenziale</option>
            <option value="Industriale">Industriale</option>
            <option value="Stradale">Stradale</option>
            <option value="Altro">Altro</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: `1px solid ${colors.border}`,
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              backgroundColor: colors.surface,
              color: colors.textPrimary
            }}
          >
            <option value="created_at">Più recenti</option>
            <option value="nome">Nome A-Z</option>
            <option value="difficolta">Accesso camion</option>
          </select>
        </div>
      </div>

      {/* Contatore risultati */}
      <p style={{
        fontSize: '0.875rem',
        color: colors.textSecondary,
        marginBottom: '0.75rem'
      }}>
        {sortedCantieri.length} cantieri trovati
        {sortedCantieri.length !== cantieri.length && ` (su ${cantieri.length} totali)`}
      </p>

      {/* Lista cantieri */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {sortedCantieri.length === 0 ? (
          <div className="text-center py-12" style={{ color: colors.textMuted }}>
            <p className="text-lg">Nessun cantiere trovato</p>
            <p className="text-sm">Modifica i filtri o aggiungi un nuovo cantiere</p>
          </div>
        ) : (
          sortedCantieri.map((cantiere, index) => (
            <div
              key={cantiere.id}
              className="cantiere-card stagger-item cursor-pointer"
              onClick={() => onCantiereClick && onCantiereClick(cantiere)}
              style={{
                border: `1px solid ${colors.border}`,
                borderRadius: '0.5rem',
                padding: '1rem',
                backgroundColor: colors.surface,
                animationDelay: `${index * 0.05}s`
              }}
            >
              {/* Header card */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 style={{
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    color: colors.textPrimary
                  }}>
                    {cantiere.nome}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: colors.textSecondary
                  }}>
                    {cantiere.indirizzo}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-col gap-1 ml-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                      cantiere.difficolta === 'Difficile'
                        ? 'bg-red-100 text-red-800'
                        : cantiere.difficolta === 'Medio'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {cantiere.difficolta}
                  </span>

                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                      cantiere.stato === 'Attivo'
                        ? 'bg-blue-100 text-blue-800'
                        : cantiere.stato === 'Completato'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {cantiere.stato}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-3">
                <div>
                  <span style={{ color: colors.textSecondary }}>Tipologia:</span>{' '}
                  <span className="font-medium" style={{ color: colors.textPrimary }}>
                    {cantiere.tipologia}
                  </span>
                </div>
                {cantiere.cliente && (
                  <div>
                    <span style={{ color: colors.textSecondary }}>Cliente:</span>{' '}
                    <span className="font-medium" style={{ color: colors.textPrimary }}>
                      {cantiere.cliente}
                    </span>
                  </div>
                )}
                {cantiere.orari && (
                  <div>
                    <span style={{ color: colors.textSecondary }}>Orari:</span>{' '}
                    <span className="font-medium" style={{ color: colors.textPrimary }}>
                      {cantiere.orari}
                    </span>
                  </div>
                )}
                {cantiere.coordinatore_nome && (
                  <div>
                    <span style={{ color: colors.textSecondary }}>Coordinatore:</span>{' '}
                    <span className="font-medium" style={{ color: colors.textPrimary }}>
                      {cantiere.coordinatore_nome}
                    </span>
                  </div>
                )}
              </div>

              {/* Note operative (se presenti) */}
              {cantiere.note_operative && (
                <div className="mb-3 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                  <p className="text-xs font-semibold text-yellow-800 mb-1">📝 Note:</p>
                  <p className="text-xs text-yellow-900">{cantiere.note_operative}</p>
                </div>
              )}

              {/* Bottoni azioni */}
              <div className="flex gap-2 pt-3" style={{ borderTop: `1px solid ${colors.border}` }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate(cantiere);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    backgroundColor: colors.success,
                    color: colors.textWhite,
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    borderRadius: '0.25rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = colors.successHover}
                  onMouseLeave={(e) => e.target.style.backgroundColor = colors.success}
                >
                  🧭 Naviga
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyLink(cantiere);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    backgroundColor: colors.info,
                    color: colors.textWhite,
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    borderRadius: '0.25rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  📋 Copia
                </button>

                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(cantiere);
                    }}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: colors.buttonInactiveBg,
                      color: colors.buttonInactiveText,
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      borderRadius: '0.25rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = colors.buttonHover}
                    onMouseLeave={(e) => e.target.style.backgroundColor = colors.buttonInactiveBg}
                  >
                    ✏️
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Eliminare cantiere "${cantiere.nome}"?`)) {
                        onDelete(cantiere.id);
                      }
                    }}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: colors.danger,
                      color: colors.textWhite,
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      borderRadius: '0.25rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = colors.dangerHover}
                    onMouseLeave={(e) => e.target.style.backgroundColor = colors.danger}
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
