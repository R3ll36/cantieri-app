import { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Header({ user, onLogout, view, setView }) {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <header
      style={{
        backgroundColor: colors.navbarBg,
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setView("map")}
        >
          <img src="/general.png" alt="Alpacem Cantieri" className="navbar-logo" />
        </div>

        {/* Hamburger button - ONLY mobile (< 640px) */}
        <button
          className="sm:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "2.5rem",
            color: colors.textPrimary,
            padding: "0.5rem",
            lineHeight: 1,
          }}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>

        {/* Desktop Navigation - hidden on mobile */}
        <div className="hidden sm:flex items-center gap-6">
          {/* Menu links testuali */}
          <a
            onClick={() => setView("map")}
            style={{
              color: view === "map" ? colors.primary : colors.textPrimary,
              fontWeight: "500",
              fontSize: "1rem",
              cursor: "pointer",
              textDecoration: "none",
              transition: "color 0.2s",
              borderBottom: view === "map" ? `2px solid ${colors.primary}` : "none",
              paddingBottom: "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              if (view !== "map") e.target.style.color = colors.textPrimary;
            }}
          >
            Mappa
          </a>

          <a
            onClick={() => setView("list")}
            style={{
              color: view === "list" ? colors.primary : colors.textPrimary,
              fontWeight: "500",
              fontSize: "1rem",
              cursor: "pointer",
              textDecoration: "none",
              transition: "color 0.2s",
              borderBottom: view === "list" ? `2px solid ${colors.primary}` : "none",
              paddingBottom: "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              if (view !== "list") e.target.style.color = colors.textPrimary;
            }}
          >
            Elenco
          </a>

          {!user?.isGuest && (
            <a
              onClick={() => setView("add")}
              style={{
                color: view === "add" ? colors.primary : colors.textPrimary,
                fontWeight: "500",
                fontSize: "1rem",
                cursor: "pointer",
                textDecoration: "none",
                transition: "color 0.2s",
                borderBottom: view === "add" ? `2px solid ${colors.primary}` : "none",
                paddingBottom: "0.5rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = colors.primary;
              }}
              onMouseLeave={(e) => {
                if (view !== "add") e.target.style.color = colors.textPrimary;
              }}
            >
              Nuovo
            </a>
          )}

          <a
            onClick={() => setView("howItWorks")}
            style={{
              color: view === "howItWorks" ? colors.primary : colors.textPrimary,
              fontWeight: "500",
              fontSize: "1rem",
              cursor: "pointer",
              textDecoration: "none",
              transition: "color 0.2s",
              borderBottom: view === "howItWorks" ? `2px solid ${colors.primary}` : "none",
              paddingBottom: "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              if (view !== "howItWorks") e.target.style.color = colors.textPrimary;
            }}
          >
            Aiuto
          </a>

          {/* Right section with icons */}
          <div ref={userMenuRef} className="flex items-center gap-4 ml-4 pl-4" style={{ borderLeft: `1px solid ${colors.border}`, position: 'relative' }}>
            {/* User icon with dropdown */}
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
                color: colors.textSecondary,
                fontSize: "1.5rem",
                lineHeight: 1,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.target.style.color = colors.textSecondary;
              }}
              title={user?.isGuest ? "Ospite" : user.email}
            >
              👤
            </button>

            {/* User dropdown menu */}
            {isUserMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  minWidth: '200px',
                  zIndex: 1000,
                }}
              >
                {/* User email */}
                <div style={{
                  padding: '0.75rem 1rem',
                  borderBottom: `1px solid ${colors.border}`,
                  fontSize: '0.875rem',
                  color: colors.textSecondary,
                }}>
                  {user?.isGuest ? "Ospite" : user.email}
                </div>

                {/* Dark Mode Toggle */}
                <button
                  onClick={() => {
                    toggleDarkMode();
                    setIsUserMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: colors.textPrimary,
                    fontSize: '0.875rem',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.buttonHover;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  {isDarkMode ? "☀️ Modalità chiara" : "🌙 Modalità scura"}
                </button>

                {/* Settings */}
                <button
                  onClick={() => {
                    setView("settings");
                    setIsUserMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: colors.textPrimary,
                    fontSize: '0.875rem',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.buttonHover;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  ⚙️ Impostazioni
                </button>

                {/* Logout */}
                <button
                  onClick={() => {
                    onLogout();
                    setIsUserMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderTop: `1px solid ${colors.border}`,
                    cursor: 'pointer',
                    color: colors.danger,
                    fontSize: '0.875rem',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.buttonHover;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  🚪 Esci
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      {isMobileMenuOpen && (
        <div
          className="sm:hidden mobile-menu-enter"
          style={{
            position: "fixed",
            top: "72px",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.surface,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
              maxWidth: "300px",
              alignItems: "center"
            }}
          >
            <button
              onClick={() => {
                setView("list");
                setIsMobileMenuOpen(false);
              }}
              style={{
                backgroundColor:
                  view === "list"
                    ? colors.buttonActiveBg
                    : colors.buttonInactiveBg,
                color:
                  view === "list"
                    ? colors.buttonActiveText
                    : colors.buttonInactiveText,
                padding: "1rem 2rem",
                borderRadius: "0.75rem",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
                fontSize: "1.1rem",
                width: "auto",
                minWidth: "200px",
              }}
            >
              📋 Lista
            </button>

            <button
              onClick={() => {
                setView("map");
                setIsMobileMenuOpen(false);
              }}
              style={{
                backgroundColor:
                  view === "map"
                    ? colors.buttonActiveBg
                    : colors.buttonInactiveBg,
                color:
                  view === "map"
                    ? colors.buttonActiveText
                    : colors.buttonInactiveText,
                padding: "1rem 2rem",
                borderRadius: "0.75rem",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
                fontSize: "1.1rem",
                width: "auto",
                minWidth: "200px",
              }}
            >
              🗺️ Mappa
            </button>

            <button
              onClick={() => {
                setView("howItWorks");
                setIsMobileMenuOpen(false);
              }}
              style={{
                backgroundColor:
                  view === "howItWorks"
                    ? colors.buttonActiveBg
                    : colors.buttonInactiveBg,
                color:
                  view === "howItWorks"
                    ? colors.buttonActiveText
                    : colors.buttonInactiveText,
                padding: "1rem 2rem",
                borderRadius: "0.75rem",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
                fontSize: "1.1rem",
                width: "auto",
                minWidth: "200px",
              }}
            >
              ℹ️ Come Funziona
            </button>

            {!user?.isGuest && (
              <button
                onClick={() => {
                  setView("add");
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  backgroundColor: colors.success,
                  color: colors.textWhite,
                  padding: "1rem 2rem",
                  borderRadius: "0.75rem",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "center",
                  fontSize: "1.1rem",
                  width: "auto",
                  minWidth: "200px",
                }}
              >
                ➕ Nuovo Cantiere
              </button>
            )}

            <button
              onClick={() => {
                toggleDarkMode();
                setIsMobileMenuOpen(false);
              }}
              style={{
                backgroundColor: colors.buttonInactiveBg,
                color: colors.buttonInactiveText,
                padding: "1rem 2rem",
                borderRadius: "0.75rem",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
                fontSize: "1.1rem",
                width: "auto",
                minWidth: "200px",
              }}
            >
              {isDarkMode ? "☀️ Modalità chiara" : "🌙 Modalità scura"}
            </button>

            <div
              style={{
                borderTop: `1px solid ${colors.border}`,
                paddingTop: "1.5rem",
                marginTop: "1rem",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.95rem",
                  color: colors.textSecondary,
                  textAlign: "center",
                }}
              >
                {user?.isGuest ? "Ospite" : user.email}
              </p>
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  backgroundColor: colors.danger,
                  color: colors.textWhite,
                  padding: "1rem 2rem",
                  borderRadius: "0.75rem",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                  width: "auto",
                  minWidth: "200px",
                  fontSize: "1.1rem",
                  textAlign: "center",
                }}
              >
                Esci
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
