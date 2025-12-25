import { useTheme } from "../context/ThemeContext";

const HowItWorks = () => {
  const { colors } = useTheme();

  const features = [
    {
      icon: "🗺️",
      title: "Mappa Interattiva",
      description: "Visualizza tutti i cantieri su una mappa interattiva con marker colorati per difficoltà",
      items: [
        "Marker colorati per livello difficoltà",
        "Ricerca indirizzo Google Maps integrata",
        "Click destro per aggiungere cantieri",
        "Navigazione GPS diretta"
      ]
    },
    {
      icon: "📱",
      title: "Mobile First",
      description: "PWA installabile su iOS e Android, funziona anche offline",
      items: [
        "Installabile come app nativa",
        "Funzionamento offline",
        "Sincronizzazione automatica",
        "Performance ottimizzate"
      ]
    },
    {
      icon: "👥",
      title: "Collaborazione Real-Time",
      description: "Team sempre sincronizzato con aggiornamenti istantanei",
      items: [
        "Note condivise in tempo reale",
        "Accesso guest per autisti",
        "Aggiornamenti istantanei Firestore",
        "Gestione permessi sicura"
      ]
    },
    {
      icon: "📋",
      title: "Gestione Completa",
      description: "Tutti i dettagli del cantiere in un unico posto",
      items: [
        "Informazioni dettagliate cantiere",
        "Upload foto e documenti",
        "Link Google Maps automatici",
        "Storico modifiche completo"
      ]
    }
  ];

  const steps = [
    { num: "1", icon: "🔐", title: "Accedi", desc: "Login con email o Google" },
    { num: "2", icon: "🗺️", title: "Esplora", desc: "Visualizza cantieri su mappa" },
    { num: "3", icon: "➕", title: "Aggiungi", desc: "Click destro per nuovi cantieri" },
    { num: "4", icon: "🚀", title: "Naviga", desc: "GPS integrato per raggiungere cantieri" }
  ];

  const techStack = [
    { name: "React 19", icon: "⚛️" },
    { name: "Firebase", icon: "🔥" },
    { name: "Leaflet Maps", icon: "🗺️" },
    { name: "Google Maps", icon: "🌍" },
    { name: "PWA", icon: "📱" },
    { name: "Vite", icon: "⚡" },
    { name: "Firestore", icon: "💾" },
    { name: "Service Worker", icon: "⚙️" }
  ];

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      overflow: 'auto',
      backgroundColor: colors.background,
      WebkitOverflowScrolling: 'touch'
    }}>
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            animation: 'fadeInUp 1s ease-out'
          }}>
            Alpacem Cantieri
          </h1>
          <p style={{
            fontSize: 'clamp(1.25rem, 3vw, 2rem)',
            marginBottom: '2rem',
            fontWeight: '300'
          }}>
            Gestisci i tuoi cantieri con semplicità
          </p>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem',
            lineHeight: 1.6,
            opacity: 0.95
          }}>
            La soluzione completa per la gestione dei cantieri su mappa.
            Traccia posizioni, condividi note, naviga con GPS integrato.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '4rem'
          }}>
            {['🗺️ Mappa Interattiva', '📱 PWA Mobile', '⚡ Real-time', '🔒 Sicuro'].map((badge, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                {badge}
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div style={{
            animation: 'bounce 2s infinite',
            marginTop: '2rem'
          }}>
            <svg style={{ width: '32px', height: '32px', margin: '0 auto', opacity: 0.7 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Wave separator */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          lineHeight: 0
        }}>
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill={colors.background} />
          </svg>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{
        padding: '6rem 2rem',
        backgroundColor: colors.background
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 'bold',
              color: colors.textPrimary,
              marginBottom: '1rem'
            }}>
              Tutto ciò che ti serve
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: colors.textSecondary,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Una piattaforma completa per gestire i cantieri in modo professionale
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                backgroundColor: colors.surface,
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                border: `1px solid ${colors.border}`,
                animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{
                  fontSize: '3.5rem',
                  marginBottom: '1.5rem',
                  transition: 'transform 0.3s'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: colors.textPrimary,
                  marginBottom: '1rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: colors.textSecondary,
                  marginBottom: '1.5rem',
                  lineHeight: 1.6
                }}>
                  {feature.description}
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {feature.items.map((item, idx) => (
                    <li key={idx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      marginBottom: '0.75rem'
                    }}>
                      <svg style={{ width: '24px', height: '24px', flexShrink: 0, marginTop: '2px', color: colors.primary }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span style={{ color: colors.textPrimary }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{
        padding: '6rem 2rem',
        background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.background} 100%)`
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 'bold',
              color: colors.textPrimary,
              marginBottom: '1rem'
            }}>
              Semplice da usare
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: colors.textSecondary
            }}>
              Inizia in pochi minuti
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem'
          }}>
            {steps.map((step, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  position: 'relative',
                  marginBottom: '1.5rem',
                  display: 'inline-block'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
                    transition: 'transform 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    {step.icon}
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '32px',
                    height: '32px',
                    background: colors.primary,
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                  }}>
                    {step.num}
                  </div>
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: colors.textPrimary,
                  marginBottom: '0.5rem'
                }}>
                  {step.title}
                </h3>
                <p style={{ color: colors.textSecondary }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{
        padding: '6rem 2rem',
        backgroundColor: colors.background
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 'bold',
              color: colors.textPrimary,
              marginBottom: '1rem'
            }}>
              Tecnologie all'avanguardia
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: colors.textSecondary
            }}>
              Costruito con le migliori tecnologie web moderne
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1.5rem'
          }}>
            {techStack.map((tech, index) => (
              <div key={index} style={{
                backgroundColor: colors.surface,
                borderRadius: '0.75rem',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                border: `1px solid ${colors.border}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{tech.icon}</div>
                <div style={{ fontWeight: '600', color: colors.textPrimary }}>{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '5rem 2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: '1.5rem'
          }}>
            Pronto per iniziare?
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            marginBottom: '2.5rem',
            opacity: 0.95,
            lineHeight: 1.6
          }}>
            Inizia subito a gestire i tuoi cantieri in modo professionale.
            Nessuna carta di credito richiesta.
          </p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{
            backgroundColor: 'white',
            color: '#667eea',
            padding: '1rem 2.5rem',
            borderRadius: '0.75rem',
            fontWeight: 'bold',
            fontSize: '1.125rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
          }}>
            Inizia Ora →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '3rem 2rem',
        backgroundColor: '#1a202c',
        color: '#a0aec0',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
          © {new Date().getFullYear()} Alpacem Cantieri. Tutti i diritti riservati.
        </p>
        <p style={{ fontSize: '0.75rem', color: '#718096' }}>
          Gestione cantieri professionale su mappa
        </p>
      </footer>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default HowItWorks;
