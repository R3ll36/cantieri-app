import { useTheme } from '../hooks/useTheme';

export default function IOSInstallPrompt({ onClose }) {
  const { colors } = useTheme();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: colors.surface,
          borderRadius: '1.5rem',
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          animation: 'slideInUp 0.4s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '0.5rem',
            animation: 'bounce 1s ease-in-out infinite'
          }}>
            📱
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: '0.5rem'
          }}>
            Installa General Beton
          </h2>
          <p style={{
            fontSize: '0.9rem',
            color: colors.textSecondary
          }}>
            Segui questi semplici passaggi
          </p>
        </div>

        {/* Steps */}
        <div style={{ marginBottom: '1.5rem' }}>
          {/* Step 1 */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: colors.background,
            borderRadius: '1rem',
            border: `2px solid ${colors.primary}`
          }}>
            <div style={{
              backgroundColor: colors.primary,
              color: colors.textWhite,
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              1
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontWeight: 'bold',
                color: colors.textPrimary,
                marginBottom: '0.5rem'
              }}>
                Tocca il pulsante Condividi
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                backgroundColor: '#007AFF',
                borderRadius: '0.5rem',
                justifyContent: 'center'
              }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ flexShrink: 0 }}
                >
                  <path
                    d="M12 4L12 16M12 4L8 8M12 4L16 8"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 16L4 18C4 19.1046 4.89543 20 6 20L18 20C19.1046 20 20 19.1046 20 18V16"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span style={{ color: 'white', fontWeight: '600' }}>
                  Condividi
                </span>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: colors.textSecondary,
                marginTop: '0.5rem'
              }}>
                (in basso al centro o in alto a destra)
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: colors.background,
            borderRadius: '1rem'
          }}>
            <div style={{
              backgroundColor: colors.primary,
              color: colors.textWhite,
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              2
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontWeight: 'bold',
                color: colors.textPrimary,
                marginBottom: '0.5rem'
              }}>
                Scorri e trova "Aggiungi a Home"
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                backgroundColor: colors.surface,
                borderRadius: '0.5rem',
                border: `1px solid ${colors.border}`
              }}>
                <span style={{ fontSize: '1.5rem' }}>➕</span>
                <span style={{ color: colors.textPrimary, fontWeight: '600' }}>
                  Aggiungi a Home
                </span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: colors.background,
            borderRadius: '1rem'
          }}>
            <div style={{
              backgroundColor: colors.primary,
              color: colors.textWhite,
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              3
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontWeight: 'bold',
                color: colors.textPrimary,
                marginBottom: '0.5rem'
              }}>
                Conferma con "Aggiungi"
              </p>
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#007AFF',
                borderRadius: '0.5rem',
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                Aggiungi
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: colors.textSecondary,
                marginTop: '0.5rem'
              }}>
                L'app apparirà nella schermata Home!
              </p>
            </div>
          </div>
        </div>

        {/* Success message */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#dcfce7',
          border: '2px solid #16a34a',
          borderRadius: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <p style={{
            fontSize: '0.9rem',
            color: '#166534',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            ✅ Dopo l'installazione potrai aprire l'app come qualsiasi altra app del telefono!
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: colors.primary,
            color: colors.textWhite,
            border: 'none',
            borderRadius: '0.75rem',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Ho capito!
        </button>
      </div>
    </div>
  );
}
