import { useState, useEffect } from "react";

const HowItWorks = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "🗺️",
      title: "Mappa Interattiva",
      description: "Visualizza tutti i cantieri su una mappa intuitiva con marker colorati in base alla difficoltà",
      color: "#3B82F6",
      gradient: "from-blue-500 to-blue-600",
      details: [
        "Click destro per aggiungere nuovi cantieri",
        "Marker colorati: Verde (facile), Giallo (medio), Rosso (difficile)",
        "Ricerca indirizzo con Google Maps",
        "Navigazione diretta con un click"
      ]
    },
    {
      icon: "📋",
      title: "Gestione Completa",
      description: "Gestisci tutti i dettagli dei cantieri: materiali, difficoltà, note e molto altro",
      color: "#10B981",
      gradient: "from-green-500 to-green-600",
      details: [
        "Informazioni dettagliate per ogni cantiere",
        "Carica foto e documenti",
        "Link Google Maps integrato",
        "Note collaborative per autisti"
      ]
    },
    {
      icon: "👥",
      title: "Collaborazione Team",
      description: "Gli autisti possono aggiungere note in tempo reale e condividere informazioni",
      color: "#F59E0B",
      gradient: "from-amber-500 to-amber-600",
      details: [
        "Note condivise in tempo reale",
        "Aggiornamenti istantanei con Firestore",
        "Accesso guest per autisti",
        "Storico modifiche trasparente"
      ]
    },
    {
      icon: "📱",
      title: "PWA Mobile-Ready",
      description: "Installabile su iOS e Android come una vera app, funziona anche offline",
      color: "#8B5CF6",
      gradient: "from-purple-500 to-purple-600",
      details: [
        "Installabile come app nativa",
        "Funziona offline con Service Worker",
        "Notifiche push (prossimamente)",
        "Performance ottimizzate"
      ]
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Accedi all'App",
      description: "Login con email/password o Google OAuth. Gli autisti possono usare l'accesso guest.",
      icon: "🔐"
    },
    {
      number: "02",
      title: "Visualizza la Mappa",
      description: "Tutti i cantieri sono visualizzati sulla mappa con marker colorati in base alla difficoltà.",
      icon: "🗺️"
    },
    {
      number: "03",
      title: "Aggiungi Cantieri",
      description: "Click destro sulla mappa per aggiungere un nuovo cantiere con tutti i dettagli necessari.",
      icon: "➕"
    },
    {
      number: "04",
      title: "Naviga e Collabora",
      description: "Click sui marker per vedere dettagli, navigare con Google Maps e aggiungere note.",
      icon: "🚀"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 overflow-y-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in">
              Come Funziona
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              General Beton Cantieri è l'app completa per gestire i tuoi cantieri su mappa,
              con navigazione GPS integrata e collaborazione in tempo reale.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full border border-white/20">
                <span className="text-lg font-semibold">🗺️ Mappa Interattiva</span>
              </div>
              <div className="bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full border border-white/20">
                <span className="text-lg font-semibold">📱 PWA Mobile</span>
              </div>
              <div className="bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full border border-white/20">
                <span className="text-lg font-semibold">⚡ Real-time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Funzionalità Principali
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tutto ciò di cui hai bisogno per gestire i tuoi cantieri in modo professionale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer ${
                activeSection === index ? 'ring-4 ring-offset-4' : ''
              }`}
              style={{
                ringColor: activeSection === index ? feature.color : 'transparent',
                transform: activeSection === index ? 'scale(1.02)' : 'scale(1)'
              }}
              onClick={() => setActiveSection(index)}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

              <div className="relative p-8">
                <div className="flex items-start gap-6">
                  <div
                    className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                    style={{ backgroundColor: feature.color }}
                  >
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-lg flex-shrink-0">✓</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Active indicator */}
              {activeSection === index && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 animate-progress"
                  style={{ backgroundColor: feature.color }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* How it works steps */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Come Iniziare
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              4 semplici passi per iniziare a gestire i tuoi cantieri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`
                }}
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 h-full border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <div className="text-5xl font-bold text-blue-300 mb-4 opacity-50">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-blue-100 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-400/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tecnologie Moderne
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Costruita con le migliori tecnologie web
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "React 19", icon: "⚛️", color: "#61DAFB" },
            { name: "Firebase", icon: "🔥", color: "#FFCA28" },
            { name: "Leaflet Maps", icon: "🗺️", color: "#199900" },
            { name: "Vite", icon: "⚡", color: "#646CFF" },
            { name: "PWA", icon: "📱", color: "#5A0FC8" },
            { name: "Google Maps", icon: "🌍", color: "#4285F4" },
            { name: "Firestore", icon: "💾", color: "#039BE5" },
            { name: "Service Worker", icon: "⚙️", color: "#FF6F00" }
          ].map((tech, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
            >
              <div className="text-5xl mb-3">{tech.icon}</div>
              <div className="font-semibold text-gray-900">{tech.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto per Iniziare?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Inizia subito a gestire i tuoi cantieri in modo professionale con General Beton Cantieri
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              🚀 Inizia Ora
            </button>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
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

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-fade-in {
          animation: fadeInUp 1s ease-out;
        }

        .animate-progress {
          animation: progress 5s linear;
        }

        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        /* Smooth scroll */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #3B82F6;
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #2563EB;
        }
      `}</style>
    </div>
  );
};

export default HowItWorks;
