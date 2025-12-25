import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { lightColors, darkColors } from '../config/theme';

/**
 * Pagina Settings - Personalizza colori e font del sito
 */
export default function Settings() {
  const { colors, isDarkMode, applyCustomColors, customLightColors, customDarkColors } = useTheme();

  // Selettore modalità da modificare (light o dark)
  const [editingMode, setEditingMode] = useState(isDarkMode ? 'dark' : 'light');

  // Stato per preview colori (non ancora salvati)
  const [previewLightColors, setPreviewLightColors] = useState(() => {
    return customLightColors || lightColors;
  });

  const [previewDarkColors, setPreviewDarkColors] = useState(() => {
    return customDarkColors || darkColors;
  });

  // Colori preview per modalità corrente in editing
  const previewColors = editingMode === 'light' ? previewLightColors : previewDarkColors;
  const setPreviewColors = (newColors) => {
    if (editingMode === 'light') {
      setPreviewLightColors(newColors);
    } else {
      setPreviewDarkColors(newColors);
    }
  };

  const [activeTab, setActiveTab] = useState('colors'); // 'colors' | 'fonts'
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Stato per font personalizzati
  const [customFonts, setCustomFonts] = useState(() => {
    const saved = localStorage.getItem('customFonts');
    return saved ? JSON.parse(saved) : { primary: null, heading: null };
  });
  const [fontChanges, setFontChanges] = useState(false);

  // Gestione upload font
  const handleFontUpload = (fontType, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Verifica tipo file
    const validExtensions = ['.ttf', '.woff', '.woff2', '.otf'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      alert('❌ Formato non supportato. Usa .ttf, .woff, .woff2 o .otf');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Font = e.target.result;
      const fontName = file.name.replace(/\.[^/.]+$/, ''); // Nome senza estensione

      setCustomFonts(prev => ({
        ...prev,
        [fontType]: {
          name: fontName,
          data: base64Font,
          extension: fileExtension
        }
      }));
      setFontChanges(true);
    };
    reader.readAsDataURL(file);
  };

  // Salva font personalizzati
  const saveFonts = () => {
    localStorage.setItem('customFonts', JSON.stringify(customFonts));

    // Applica font al documento
    applyFontsToDocument();

    setFontChanges(false);
    alert('✅ Font salvati con successo!');
  };

  // Applica font al documento usando @font-face
  const applyFontsToDocument = () => {
    let styleElement = document.getElementById('custom-fonts-style');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'custom-fonts-style';
      document.head.appendChild(styleElement);
    }

    let css = '';

    if (customFonts.primary?.data) {
      css += `
        @font-face {
          font-family: 'CustomPrimary';
          src: url('${customFonts.primary.data}') format('${getFontFormat(customFonts.primary.extension)}');
        }
        body, button, input, select, textarea {
          font-family: 'CustomPrimary', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
      `;
    }

    if (customFonts.heading?.data) {
      css += `
        @font-face {
          font-family: 'CustomHeading';
          src: url('${customFonts.heading.data}') format('${getFontFormat(customFonts.heading.extension)}');
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: 'CustomHeading', 'Arial Black', sans-serif !important;
        }
      `;
    }

    styleElement.textContent = css;
  };

  // Determina formato font per @font-face
  const getFontFormat = (extension) => {
    switch (extension) {
      case '.woff': return 'woff';
      case '.woff2': return 'woff2';
      case '.ttf': return 'truetype';
      case '.otf': return 'opentype';
      default: return 'truetype';
    }
  };

  // Reset font
  const resetFonts = () => {
    setCustomFonts({ primary: null, heading: null });
    setFontChanges(true);

    // Rimuovi stile personalizzato
    const styleElement = document.getElementById('custom-fonts-style');
    if (styleElement) {
      styleElement.remove();
    }
  };

  // Applica font salvati al caricamento
  useEffect(() => {
    if (customFonts.primary?.data || customFonts.heading?.data) {
      applyFontsToDocument();
    }
  }, []);

  // Modifica colore (solo preview, non salva)
  const handleColorChange = (colorKey, value) => {
    const newColors = { ...previewColors, [colorKey]: value };
    setPreviewColors(newColors);
    setHasUnsavedChanges(true);
  };

  // Salva colori personalizzati
  const saveColors = () => {
    applyCustomColors(previewColors, editingMode);
    setHasUnsavedChanges(false);
    alert(`✅ Colori salvati per modalità ${editingMode === 'light' ? 'chiara' : 'scura'}!`);
  };

  // Reset ai colori default
  const resetColors = () => {
    const defaultColors = editingMode === 'light' ? lightColors : darkColors;
    setPreviewColors(defaultColors);
    setHasUnsavedChanges(true);
  };

  // Annulla modifiche
  const cancelChanges = () => {
    const savedColors = editingMode === 'light' ? (customLightColors || lightColors) : (customDarkColors || darkColors);
    setPreviewColors(savedColors);
    setHasUnsavedChanges(false);
  };

  // Esporta configurazione
  const exportConfig = () => {
    const config = {
      colors: previewColors,
      theme: isDarkMode ? 'dark' : 'light',
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `general-beton-theme-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Importa configurazione
  const importConfig = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result);
        if (config.colors) {
          setPreviewColors(config.colors);
          setHasUnsavedChanges(true);
          alert('✅ Configurazione importata! Clicca "Salva" per applicarla.');
        }
      } catch (error) {
        alert('❌ Errore nell\'importazione del file');
      }
    };
    reader.readAsText(file);
  };

  const ColorPicker = ({ label, colorKey, description }) => (
    <div style={{
      padding: '1rem',
      backgroundColor: colors.background,
      borderRadius: '0.5rem',
      border: `1px solid ${colors.border}`
    }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.textPrimary }}>
            {label}
          </label>
          {description && (
            <p style={{ fontSize: '0.75rem', color: colors.textSecondary, marginTop: '0.25rem' }}>
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={previewColors[colorKey] || '#000000'}
            onChange={(e) => handleColorChange(colorKey, e.target.value)}
            style={{
              width: '60px',
              height: '40px',
              border: `2px solid ${colors.border}`,
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          />
          <input
            type="text"
            value={previewColors[colorKey] || '#000000'}
            onChange={(e) => handleColorChange(colorKey, e.target.value)}
            style={{
              width: '100px',
              padding: '0.5rem',
              border: `1px solid ${colors.border}`,
              borderRadius: '0.375rem',
              backgroundColor: colors.surface,
              color: colors.textPrimary,
              fontSize: '0.875rem',
              fontFamily: 'monospace'
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: '0.75rem',
        boxShadow: '0 10px 15px -3px rgb(0 0 0/0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: `1px solid ${colors.border}`
        }}>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: '0.5rem'
          }}>
            ⚙️ Impostazioni
          </h2>
          <p style={{ color: colors.textSecondary }}>
            Personalizza colori e aspetto del sito General Beton
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          padding: '1rem 1.5rem',
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.background
        }}>
          <button
            onClick={() => setActiveTab('colors')}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'colors' ? colors.primary : 'transparent',
              color: activeTab === 'colors' ? colors.textWhite : colors.textSecondary,
              transition: 'all 0.2s'
            }}
          >
            🎨 Colori
          </button>
          <button
            onClick={() => setActiveTab('fonts')}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'fonts' ? colors.primary : 'transparent',
              color: activeTab === 'fonts' ? colors.textWhite : colors.textSecondary,
              transition: 'all 0.2s'
            }}
          >
            🔤 Font
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {activeTab === 'colors' && (
            <div className="space-y-6">
              {/* Selettore Modalità Light/Dark */}
              <div style={{
                padding: '1rem',
                backgroundColor: colors.background,
                borderRadius: '0.5rem',
                border: `2px solid ${colors.border}`
              }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.textPrimary, marginBottom: '0.75rem' }}>
                  Modifica colori per:
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingMode('light');
                      setHasUnsavedChanges(false);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: editingMode === 'light' ? colors.primary : colors.buttonInactiveBg,
                      color: editingMode === 'light' ? colors.textWhite : colors.buttonInactiveText,
                      fontWeight: '600',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    ☀️ Modalità Chiara
                  </button>
                  <button
                    onClick={() => {
                      setEditingMode('dark');
                      setHasUnsavedChanges(false);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: editingMode === 'dark' ? colors.primary : colors.buttonInactiveBg,
                      color: editingMode === 'dark' ? colors.textWhite : colors.buttonInactiveText,
                      fontWeight: '600',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    🌙 Modalità Scura
                  </button>
                </div>
              </div>

              {/* Avviso modifiche non salvate */}
              {hasUnsavedChanges && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#FEF3C7',
                  border: '2px solid #F59E0B',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{ fontWeight: '600', color: '#92400E', marginBottom: '0.25rem' }}>
                      ⚠️ Modifiche non salvate
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#78350F' }}>
                      Clicca "Salva" per applicare le modifiche al sito
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={cancelChanges}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: colors.buttonInactiveBg,
                        color: colors.buttonInactiveText,
                        fontWeight: '600',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Annulla
                    </button>
                    <button
                      onClick={saveColors}
                      style={{
                        padding: '0.5rem 1.5rem',
                        backgroundColor: colors.success,
                        color: colors.textWhite,
                        fontWeight: '600',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      ✅ Salva
                    </button>
                  </div>
                </div>
              )}

              {/* Azioni rapide */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={resetColors}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: colors.buttonInactiveBg,
                    color: colors.buttonInactiveText,
                    fontWeight: '600',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  🔄 Reset Default
                </button>
                <button
                  onClick={exportConfig}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: colors.info,
                    color: colors.textWhite,
                    fontWeight: '600',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  📥 Esporta Config
                </button>
                <label style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: colors.success,
                  color: colors.textWhite,
                  fontWeight: '600',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'inline-block'
                }}>
                  📤 Importa Config
                  <input type="file" accept=".json" onChange={importConfig} style={{ display: 'none' }} />
                </label>
              </div>

              {/* Sezione Colori Principali */}
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: colors.textPrimary,
                  marginBottom: '1rem'
                }}>
                  Colori Principali
                </h3>
                <div className="space-y-3">
                  <ColorPicker
                    label="Colore Primario"
                    colorKey="primary"
                    description="Rosso principale (pulsanti attivi, accenti)"
                  />
                  <ColorPicker
                    label="Colore Primario Hover"
                    colorKey="primaryHover"
                    description="Rosso scuro al passaggio del mouse"
                  />
                  <ColorPicker
                    label="Colore Secondario"
                    colorKey="secondary"
                    description="Verde (pulsanti successo, azioni positive)"
                  />
                  <ColorPicker
                    label="Colore Sfondo"
                    colorKey="background"
                    description="Colore di sfondo principale"
                  />
                  <ColorPicker
                    label="Colore Superficie"
                    colorKey="surface"
                    description="Colore card, navbar, elementi in superficie"
                  />
                </div>
              </div>

              {/* Sezione Navbar */}
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: colors.textPrimary,
                  marginBottom: '1rem'
                }}>
                  Navbar
                </h3>
                <div className="space-y-3">
                  <ColorPicker
                    label="Sfondo Navbar"
                    colorKey="navbarBg"
                    description="Colore di sfondo della barra di navigazione"
                  />
                  <ColorPicker
                    label="Pulsante Attivo - Sfondo"
                    colorKey="buttonActiveBg"
                    description="Sfondo pulsante navbar quando attivo"
                  />
                  <ColorPicker
                    label="Pulsante Attivo - Testo"
                    colorKey="buttonActiveText"
                    description="Colore testo pulsante navbar quando attivo"
                  />
                  <ColorPicker
                    label="Pulsante Inattivo - Sfondo"
                    colorKey="buttonInactiveBg"
                    description="Sfondo pulsante navbar quando non attivo"
                  />
                  <ColorPicker
                    label="Pulsante Inattivo - Testo"
                    colorKey="buttonInactiveText"
                    description="Colore testo pulsante navbar quando non attivo"
                  />
                </div>
              </div>

              {/* Sezione Testi */}
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: colors.textPrimary,
                  marginBottom: '1rem'
                }}>
                  Testi
                </h3>
                <div className="space-y-3">
                  <ColorPicker
                    label="Testo Primario"
                    colorKey="textPrimary"
                    description="Colore principale del testo"
                  />
                  <ColorPicker
                    label="Testo Secondario"
                    colorKey="textSecondary"
                    description="Colore testo secondario (descrizioni, label)"
                  />
                  <ColorPicker
                    label="Bordi"
                    colorKey="border"
                    description="Colore dei bordi e divisori"
                  />
                </div>
              </div>

              {/* Sezione Azioni */}
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: colors.textPrimary,
                  marginBottom: '1rem'
                }}>
                  Colori Azioni
                </h3>
                <div className="space-y-3">
                  <ColorPicker
                    label="Successo"
                    colorKey="success"
                    description="Pulsanti di conferma e azioni positive"
                  />
                  <ColorPicker
                    label="Pericolo"
                    colorKey="danger"
                    description="Pulsanti di eliminazione e azioni critiche"
                  />
                  <ColorPicker
                    label="Info"
                    colorKey="info"
                    description="Pulsanti informativi e link"
                  />
                  <ColorPicker
                    label="Warning"
                    colorKey="warning"
                    description="Avvisi e notifiche di attenzione"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fonts' && (
            <div className="space-y-6">
              {/* Avviso modifiche non salvate */}
              {fontChanges && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#FEF3C7',
                  border: '2px solid #F59E0B',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{ fontWeight: '600', color: '#92400E', marginBottom: '0.25rem' }}>
                      ⚠️ Modifiche font non salvate
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#78350F' }}>
                      Clicca "Salva Font" per applicare i cambiamenti
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={resetFonts}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: colors.buttonInactiveBg,
                        color: colors.buttonInactiveText,
                        fontWeight: '600',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Reset
                    </button>
                    <button
                      onClick={saveFonts}
                      style={{
                        padding: '0.5rem 1.5rem',
                        backgroundColor: colors.success,
                        color: colors.textWhite,
                        fontWeight: '600',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      ✅ Salva Font
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Font Principale */}
              <div style={{
                padding: '1.5rem',
                backgroundColor: colors.surface,
                borderRadius: '0.75rem',
                border: `1px solid ${colors.border}`
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: colors.textPrimary,
                  marginBottom: '1rem'
                }}>
                  Font Principale (Testo)
                </h3>
                <div className="space-y-3">
                  <label style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: colors.info,
                    color: colors.textWhite,
                    fontWeight: '600',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}>
                    📁 Carica Font Principale
                    <input
                      type="file"
                      accept=".ttf,.woff,.woff2,.otf"
                      onChange={(e) => handleFontUpload('primary', e)}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {customFonts.primary && (
                    <div style={{
                      padding: '1rem',
                      backgroundColor: colors.background,
                      borderRadius: '0.5rem',
                      border: `1px solid ${colors.success}`
                    }}>
                      <p style={{ fontSize: '0.875rem', color: colors.textSecondary, marginBottom: '0.5rem' }}>
                        Font caricato: <strong style={{ color: colors.textPrimary }}>{customFonts.primary.name}</strong>
                      </p>
                      <p style={{
                        fontSize: '1.125rem',
                        color: colors.textPrimary,
                        fontFamily: customFonts.primary.data ? 'CustomPrimary' : 'inherit'
                      }}>
                        The quick brown fox jumps over the lazy dog
                      </p>
                    </div>
                  )}
                  {!customFonts.primary && (
                    <div style={{
                      padding: '1rem',
                      backgroundColor: colors.background,
                      borderRadius: '0.5rem',
                      border: `1px solid ${colors.border}`
                    }}>
                      <p style={{ fontSize: '0.875rem', color: colors.textSecondary, marginBottom: '0.5rem' }}>
                        Font Default
                      </p>
                      <p style={{
                        fontSize: '1.125rem',
                        color: colors.textPrimary,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                      }}>
                        The quick brown fox jumps over the lazy dog
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Font Titoli */}
              <div style={{
                padding: '1.5rem',
                backgroundColor: colors.surface,
                borderRadius: '0.75rem',
                border: `1px solid ${colors.border}`
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: colors.textPrimary,
                  marginBottom: '1rem'
                }}>
                  Font Titoli
                </h3>
                <div className="space-y-3">
                  <label style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: colors.info,
                    color: colors.textWhite,
                    fontWeight: '600',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}>
                    📁 Carica Font Titoli
                    <input
                      type="file"
                      accept=".ttf,.woff,.woff2,.otf"
                      onChange={(e) => handleFontUpload('heading', e)}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {customFonts.heading && (
                    <div style={{
                      padding: '1rem',
                      backgroundColor: colors.background,
                      borderRadius: '0.5rem',
                      border: `1px solid ${colors.success}`
                    }}>
                      <p style={{ fontSize: '0.875rem', color: colors.textSecondary, marginBottom: '0.5rem' }}>
                        Font caricato: <strong style={{ color: colors.textPrimary }}>{customFonts.heading.name}</strong>
                      </p>
                      <p style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: colors.textPrimary,
                        fontFamily: customFonts.heading.data ? 'CustomHeading' : 'inherit'
                      }}>
                        General Beton
                      </p>
                    </div>
                  )}
                  {!customFonts.heading && (
                    <div style={{
                      padding: '1rem',
                      backgroundColor: colors.background,
                      borderRadius: '0.5rem',
                      border: `1px solid ${colors.border}`
                    }}>
                      <p style={{ fontSize: '0.875rem', color: colors.textSecondary, marginBottom: '0.5rem' }}>
                        Font Default
                      </p>
                      <p style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: colors.textPrimary,
                        fontFamily: '"Arial Black", sans-serif'
                      }}>
                        General Beton
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Info formati supportati */}
              <div style={{
                padding: '1rem',
                backgroundColor: colors.background,
                borderRadius: '0.5rem',
                border: `1px solid ${colors.border}`
              }}>
                <p style={{ fontSize: '0.875rem', color: colors.textSecondary }}>
                  <strong style={{ color: colors.textPrimary }}>Formati supportati:</strong> .ttf, .woff, .woff2, .otf
                </p>
                <p style={{ fontSize: '0.75rem', color: colors.textSecondary, marginTop: '0.5rem' }}>
                  I font vengono salvati localmente nel browser e applicati a tutto il sito.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
