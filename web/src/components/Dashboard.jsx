import { useTheme } from '../context/ThemeContext';

/**
 * Dashboard con statistiche cantieri
 */
export default function Dashboard({ cantieri }) {
  const { colors } = useTheme();

  // Calcola statistiche
  const stats = {
    totali: cantieri.length,
    attivi: cantieri.filter(c => c.stato === 'Attivo').length,
    completati: cantieri.filter(c => c.stato === 'Completato').length,
    sospesi: cantieri.filter(c => c.stato === 'Sospeso').length,
    difficili: cantieri.filter(c => c.difficolta === 'Difficile').length,
    medi: cantieri.filter(c => c.difficolta === 'Medio').length,
    facili: cantieri.filter(c => c.difficolta === 'Facile').length,
  };

  // Cantieri per tipologia
  const tipologie = cantieri.reduce((acc, c) => {
    acc[c.tipologia] = (acc[c.tipologia] || 0) + 1;
    return acc;
  }, {});

  // Ultimi cantieri aggiunti
  const ultimiCantieri = [...cantieri]
    .sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0))
    .slice(0, 5);

  const StatCard = ({ title, value, icon, colorClass, bgClass }) => (
    <div style={{
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: '0.75rem',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div className="flex items-center justify-between">
        <div>
          <p style={{ fontSize: '0.875rem', color: colors.textSecondary, marginBottom: '0.5rem' }}>
            {title}
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.textPrimary }}>
            {value}
          </p>
        </div>
        <div className={`${bgClass} ${colorClass} w-16 h-16 rounded-full flex items-center justify-center text-3xl`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: colors.textPrimary, marginBottom: '0.5rem' }}>
          Dashboard Cantieri
        </h2>
        <p style={{ color: colors.textSecondary }}>
          Panoramica generale dei cantieri General Beton
        </p>
      </div>

      {/* Statistiche principali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Totale Cantieri"
          value={stats.totali}
          icon="🏗️"
          colorClass="text-blue-600"
          bgClass="bg-blue-100"
        />
        <StatCard
          title="Cantieri Attivi"
          value={stats.attivi}
          icon="✅"
          colorClass="text-green-600"
          bgClass="bg-green-100"
        />
        <StatCard
          title="Completati"
          value={stats.completati}
          icon="🎉"
          colorClass="text-purple-600"
          bgClass="bg-purple-100"
        />
        <StatCard
          title="Sospesi"
          value={stats.sospesi}
          icon="⏸️"
          colorClass="text-orange-600"
          bgClass="bg-orange-100"
        />
      </div>

      {/* Grid 2 colonne */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficoltà */}
        <div style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '0.75rem',
          padding: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.textPrimary, marginBottom: '1rem' }}>
            📊 Per Accesso camion
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span style={{ fontSize: '0.875rem', color: colors.textSecondary }}>Difficile</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.textPrimary }}>
                  {stats.difficili} ({stats.totali > 0 ? Math.round((stats.difficili / stats.totali) * 100) : 0}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: colors.border, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${stats.totali > 0 ? (stats.difficili / stats.totali) * 100 : 0}%`,
                  height: '100%',
                  backgroundColor: '#EF4444',
                  borderRadius: '4px'
                }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span style={{ fontSize: '0.875rem', color: colors.textSecondary }}>Medio</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.textPrimary }}>
                  {stats.medi} ({stats.totali > 0 ? Math.round((stats.medi / stats.totali) * 100) : 0}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: colors.border, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${stats.totali > 0 ? (stats.medi / stats.totali) * 100 : 0}%`,
                  height: '100%',
                  backgroundColor: '#F59E0B',
                  borderRadius: '4px'
                }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span style={{ fontSize: '0.875rem', color: colors.textSecondary }}>Facile</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.textPrimary }}>
                  {stats.facili} ({stats.totali > 0 ? Math.round((stats.facili / stats.totali) * 100) : 0}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: colors.border, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${stats.totali > 0 ? (stats.facili / stats.totali) * 100 : 0}%`,
                  height: '100%',
                  backgroundColor: '#10B981',
                  borderRadius: '4px'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tipologie */}
        <div style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '0.75rem',
          padding: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.textPrimary, marginBottom: '1rem' }}>
            🏭 Per Tipologia
          </h3>
          <div className="space-y-2">
            {Object.entries(tipologie).map(([tipo, count]) => (
              <div key={tipo} className="flex justify-between items-center" style={{
                padding: '0.75rem',
                backgroundColor: colors.background,
                borderRadius: '0.5rem'
              }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.textPrimary }}>
                  {tipo}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: colors.textWhite,
                  backgroundColor: colors.primary,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px'
                }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ultimi cantieri */}
      <div style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '0.75rem',
        padding: '1.5rem'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.textPrimary, marginBottom: '1rem' }}>
          🕒 Ultimi Cantieri Aggiunti
        </h3>
        <div className="space-y-2">
          {ultimiCantieri.map((cantiere) => (
            <div key={cantiere.id} className="flex items-center justify-between" style={{
              padding: '0.75rem',
              backgroundColor: colors.background,
              borderRadius: '0.5rem',
              border: `1px solid ${colors.border}`
            }}>
              <div className="flex-1">
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.textPrimary }}>
                  {cantiere.nome}
                </p>
                <p style={{ fontSize: '0.75rem', color: colors.textSecondary }}>
                  {cantiere.indirizzo}
                </p>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  cantiere.difficolta === 'Difficile' ? 'bg-red-100 text-red-800' :
                  cantiere.difficolta === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {cantiere.difficolta}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  cantiere.stato === 'Attivo' ? 'bg-blue-100 text-blue-800' :
                  cantiere.stato === 'Completato' ? 'bg-gray-100 text-gray-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {cantiere.stato}
                </span>
              </div>
            </div>
          ))}
          {ultimiCantieri.length === 0 && (
            <p style={{ textAlign: 'center', color: colors.textMuted, padding: '2rem' }}>
              Nessun cantiere disponibile
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
