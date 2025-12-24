import { useState, useEffect } from "react";

const HowItWorks = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
              transform: `translateY(${scrollY * 0.5}px)`
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
            General Beton Cantieri
          </h1>
          <p className="text-2xl md:text-3xl mb-8 text-blue-100 font-light">
            Gestisci i tuoi cantieri con semplicità
          </p>
          <p className="text-lg md:text-xl mb-12 text-blue-200 max-w-3xl mx-auto leading-relaxed">
            La soluzione completa per la gestione dei cantieri su mappa.
            Traccia posizioni, condividi note, naviga con GPS integrato.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/30">
              <span className="font-semibold">🗺️ Mappa Interattiva</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/30">
              <span className="font-semibold">📱 PWA Mobile</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/30">
              <span className="font-semibold">⚡ Real-time</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/30">
              <span className="font-semibold">🔒 Sicuro</span>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="animate-bounce">
            <svg className="w-8 h-8 mx-auto text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Tutto ciò che ti serve
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Una piattaforma completa per gestire i cantieri in modo professionale
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
                style={{
                  animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Semplice da usare
            </h2>
            <p className="text-xl text-gray-600">
              Inizia in pochi minuti
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "1", icon: "🔐", title: "Accedi", desc: "Login con email o Google" },
              { num: "2", icon: "🗺️", title: "Esplora", desc: "Visualizza cantieri su mappa" },
              { num: "3", icon: "➕", title: "Aggiungi", desc: "Click destro per nuovi cantieri" },
              { num: "4", icon: "🚀", title: "Naviga", desc: "GPS integrato per raggiungere cantieri" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg transform hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tecnologie all'avanguardia
            </h2>
            <p className="text-xl text-gray-600">
              Costruito con le migliori tecnologie web moderne
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "React 19", icon: "⚛️" },
              { name: "Firebase", icon: "🔥" },
              { name: "Leaflet Maps", icon: "🗺️" },
              { name: "Google Maps", icon: "🌍" },
              { name: "PWA", icon: "📱" },
              { name: "Vite", icon: "⚡" },
              { name: "Firestore", icon: "💾" },
              { name: "Service Worker", icon: "⚙️" }
            ].map((tech, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-5xl mb-3">{tech.icon}</div>
                <div className="font-semibold text-gray-900">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Pronto per iniziare?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            Inizia subito a gestire i tuoi cantieri in modo professionale.
            Nessuna carta di credito richiesta.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
          >
            Inizia Ora →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} General Beton Cantieri. Tutti i diritti riservati.
        </p>
      </footer>

      <style>{`
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

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 12px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 6px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
};

export default HowItWorks;
