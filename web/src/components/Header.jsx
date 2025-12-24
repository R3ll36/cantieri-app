import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Header({ user, onLogout, view, setView }) {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className="hidden sm:flex items-center gap-8">
          {/* Menu links testuali */}
          <a
            onClick={() => setView("map")}
            style={{
              color: view === "map" ? colors.primary : colors.textPrimary,
              fontWeight: view === "map" ? "600" : "500",
              fontSize: "1rem",
              cursor: "pointer",
              textDecoration: "none",
              transition: "color 0.2s",
              borderBottom: view === "map" ? `2px solid ${colors.primary}` : "2px solid transparent",
              paddingBottom: "0.25rem",
            }}
            onMouseEnter={(e) => {
              if (view !== "map") e.target.style.color = colors.primary;
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
              fontWeight: view === "list" ? "600" : "500",
              fontSize: "1rem",
              cursor: "pointer",
              textDecoration: "none",
              transition: "color 0.2s",
              borderBottom: view === "list" ? `2px solid ${colors.primary}` : "2px solid transparent",
              paddingBottom: "0.25rem",
            }}
            onMouseEnter={(e) => {
              if (view !== "list") e.target.style.color = colors.primary;
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
                fontWeight: view === "add" ? "600" : "500",
                fontSize: "1rem",
                cursor: "pointer",
                textDecoration: "none",
                transition: "color 0.2s",
                borderBottom: view === "add" ? `2px solid ${colors.primary}` : "2px solid transparent",
                paddingBottom: "0.25rem",
              }}
              onMouseEnter={(e) => {
                if (view !== "add") e.target.style.color = colors.primary;
              }}
              onMouseLeave={(e) => {
                if (view !== "add") e.target.style.color = colors.textPrimary;
              }}
            >
              Nuovo
            </a>
          )}

          <a
            onClick={() => setView("notes")}
            style={{
              color: view === "notes" ? colors.primary : colors.textPrimary,
              fontWeight: view === "notes" ? "600" : "500",
              fontSize: "1rem",
              cursor: "pointer",
              textDecoration: "none",
              transition: "color 0.2s",
              borderBottom: view === "notes" ? `2px solid ${colors.primary}` : "2px solid transparent",
              paddingBottom: "0.25rem",
            }}
            onMouseEnter={(e) => {
              if (view !== "notes") e.target.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              if (view !== "notes") e.target.style.color = colors.textPrimary;
            }}
          >
            Note
          </a>

          {/* Right section with icons */}
          <div className="flex items-center gap-4 ml-4 pl-4" style={{ borderLeft: `1px solid ${colors.border}` }}>
            {/* Settings icon */}
            <button
              onClick={() => setView("settings")}
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
                color: view === "settings" ? colors.primary : colors.textSecondary,
                fontSize: "1.25rem",
                lineHeight: 1,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = colors.primary;
              }}
              onMouseLeave={(e) => {
                if (view !== "settings") e.target.style.color = colors.textSecondary;
              }}
              title="Impostazioni"
            >
              ⚙️
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
                color: colors.textSecondary,
                fontSize: "1.25rem",
                lineHeight: 1,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.target.style.color = colors.textSecondary;
              }}
              title={isDarkMode ? "Modalità chiara" : "Modalità scura"}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>

            {/* User info + Logout */}
            <span style={{ fontSize: "0.875rem", color: colors.textSecondary }}>
              {user?.isGuest ? "Ospite" : user.email}
            </span>
            <button
              onClick={onLogout}
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
                color: colors.textSecondary,
                fontSize: "1.25rem",
                lineHeight: 1,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = colors.danger;
              }}
              onMouseLeave={(e) => {
                e.target.style.color = colors.textSecondary;
              }}
              title="Esci"
            >
              🚪
            </button>
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
