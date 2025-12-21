import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Header({ user, onLogout, view, setView }) {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header style={{ backgroundColor: colors.navbarBg, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setView('map')}
        >
          <img
            src="/betoniera.png?v=3"
            alt="General Beton"
            className="navbar-logo"
          />
        </div>

        {/* Hamburger button - ONLY mobile (< 640px) */}
        <button
          className="sm:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            color: colors.textPrimary,
            padding: '0.5rem'
          }}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Desktop Navigation - hidden on mobile */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => setView('list')}
            style={{
              backgroundColor: view === 'list' ? colors.buttonActiveBg : colors.buttonInactiveBg,
              color: view === 'list' ? colors.buttonActiveText : colors.buttonInactiveText,
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              transition: 'all 0.2s',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              if (view !== 'list') e.target.style.backgroundColor = colors.buttonHover;
            }}
            onMouseLeave={(e) => {
              if (view !== 'list') e.target.style.backgroundColor = colors.buttonInactiveBg;
            }}
          >
            Lista
          </button>

          <button
            onClick={() => setView('map')}
            style={{
              backgroundColor: view === 'map' ? colors.buttonActiveBg : colors.buttonInactiveBg,
              color: view === 'map' ? colors.buttonActiveText : colors.buttonInactiveText,
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              transition: 'all 0.2s',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              if (view !== 'map') e.target.style.backgroundColor = colors.buttonHover;
            }}
            onMouseLeave={(e) => {
              if (view !== 'map') e.target.style.backgroundColor = colors.buttonInactiveBg;
            }}
          >
            Mappa
          </button>

          {!user?.isGuest && (
            <button
              onClick={() => setView('add')}
              style={{
                backgroundColor: colors.success,
                color: colors.textWhite,
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.successHover;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = colors.success;
              }}
            >
              Nuovo
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            style={{
              backgroundColor: colors.buttonInactiveBg,
              color: colors.buttonInactiveText,
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              transition: 'all 0.2s',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '38px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.buttonHover;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.buttonInactiveBg;
            }}
            title={isDarkMode ? 'Modalità chiara' : 'Modalità scura'}
          >
            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>
              {isDarkMode ? '☀️' : '🌙'}
            </span>
          </button>

          <div className="flex items-center gap-2 ml-4 pl-4" style={{ borderLeft: `1px solid ${colors.border}` }}>
            <span style={{ fontSize: '0.875rem', color: colors.textSecondary }}>
              {user?.isGuest ? 'Ospite' : user.email}
            </span>
            <button
              onClick={onLogout}
              style={{
                backgroundColor: colors.danger,
                color: colors.textWhite,
                padding: '0.375rem 0.75rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.dangerHover;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = colors.danger;
              }}
            >
              Esci
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - ONLY visible when open and on mobile (< 640px) */}
      {isMobileMenuOpen && (
        <div
          className="sm:hidden mobile-menu-enter"
          style={{
            backgroundColor: colors.surface,
            borderTop: `1px solid ${colors.border}`,
            padding: '1rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => {
                setView('list');
                setIsMobileMenuOpen(false);
              }}
              style={{
                backgroundColor: view === 'list' ? colors.buttonActiveBg : colors.buttonInactiveBg,
                color: view === 'list' ? colors.buttonActiveText : colors.buttonInactiveText,
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              📋 Lista
            </button>

            <button
              onClick={() => {
                setView('map');
                setIsMobileMenuOpen(false);
              }}
              style={{
                backgroundColor: view === 'map' ? colors.buttonActiveBg : colors.buttonInactiveBg,
                color: view === 'map' ? colors.buttonActiveText : colors.buttonInactiveText,
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              🗺️ Mappa
            </button>

            {!user?.isGuest && (
              <button
                onClick={() => {
                  setView('add');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  backgroundColor: colors.success,
                  color: colors.textWhite,
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
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
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {isDarkMode ? '☀️ Modalità chiara' : '🌙 Modalità scura'}
            </button>

            <div style={{
              borderTop: `1px solid ${colors.border}`,
              paddingTop: '0.75rem',
              marginTop: '0.5rem'
            }}>
              <p style={{ fontSize: '0.875rem', color: colors.textSecondary, marginBottom: '0.75rem' }}>
                {user?.isGuest ? 'Ospite' : user.email}
              </p>
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  backgroundColor: colors.danger,
                  color: colors.textWhite,
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%'
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
