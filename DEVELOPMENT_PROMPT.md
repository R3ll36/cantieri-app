# Alpacem Cantieri App - Prompt di Sviluppo Dettagliato

## Contesto Generale
Questa è un'applicazione PWA (Progressive Web App) per la gestione di cantieri edili, costruita con React 19, Vite, Firebase (Firestore, Auth, Storage), Leaflet Maps e Google Maps API.

## Stack Tecnologico
- **Frontend**: React 19, Vite
- **Maps**: Leaflet.js + React Leaflet, Google Maps Places API
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Styling**: CSS vanilla con utility classes Tailwind-like custom
- **PWA**: Service Worker, Web App Manifest
- **Deploy**: Potenzialmente su Firebase Hosting

## Struttura del Progetto

```
cantieri-app/
├── web/
│   ├── public/
│   │   ├── sw.js                    # Service Worker per PWA
│   │   ├── manifest.json            # Web App Manifest
│   │   ├── general.png              # Logo aziendale
│   │   └── icons/                   # Icone PWA
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.jsx              # Componente root con routing views
│   │   │   ├── Header.jsx           # Navbar con menu mobile full-screen
│   │   │   ├── MapView.jsx          # Mappa Leaflet con geolocalizzazione
│   │   │   ├── MapSearchBar.jsx     # Barra ricerca Google Places
│   │   │   ├── CantieriList.jsx     # Lista cantieri
│   │   │   ├── CantiereForm.jsx     # Form aggiungi/modifica cantiere
│   │   │   ├── CantiereDetail.jsx   # Dettagli cantiere
│   │   │   ├── NoteAutisti.jsx      # Note collaborative autisti
│   │   │   ├── HowItWorks.jsx       # Landing page professionale
│   │   │   ├── Settings.jsx         # Pagina impostazioni
│   │   │   └── IOSInstallPrompt.jsx # Prompt installazione iOS
│   │   ├── firebase/
│   │   │   ├── config.js            # Configurazione Firebase
│   │   │   ├── auth.js              # Autenticazione
│   │   │   ├── firestore.js         # Database operations
│   │   │   └── storage.js           # File upload
│   │   ├── context/
│   │   │   └── ThemeContext.jsx     # Dark mode context
│   │   ├── utils/
│   │   │   └── deepLinking.js       # Deep linking per settings
│   │   ├── index.css                # Stili globali + animations
│   │   └── main.jsx                 # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
```

## Funzionalità Chiave

### 1. Autenticazione
- Login email/password
- Login Google OAuth
- Accesso Guest per autisti (sola lettura + note)
- Gestito da Firebase Auth

### 2. Mappa Interattiva (MapView.jsx)
- **Tile Layer**: colori vividi tipo Apple Maps
- **Marker colorati per difficoltà**:
  - Verde: Facile
  - Giallo: Medio
  - Rosso: Difficile
  - Grigio: Completato
- **Click destro** sulla mappa per aggiungere nuovo cantiere
- **Google Places Autocomplete** per ricerca indirizzi
- **Geolocalizzazione utente**:
  - Bottone "Locate Me" in alto a destra
  - Marker blu animato con pulse
  - Tracking posizione real-time con watchPosition
  - Centra mappa su posizione utente
  - GRATIS (usa Geolocation API del browser)
- **Tooltip permanente** su ogni marker con nome cantiere
- **Popup** con dettagli completi al click/hover
- **Link Google Maps** per navigazione diretta
- **Ricerca indirizzi** che chiude risultati con ESC o click mappa

### 3. Gestione Cantieri
**Campi cantiere**:
- Nome, Indirizzo, Coordinate (lat/lng)
- Tipologia (Strada, Ponte, Edificio, etc.)
- Stato (Attivo, In Pausa, Completato)
- Difficoltà (Facile, Medio, Difficile)
- Metri Cubi da Fare Oggi
- Orari, Link Google Maps
- Coordinatore (nome, telefono)
- Materiali necessari
- Note
- Foto (upload Firebase Storage)
- Data creazione/ultima modifica

**Operazioni**:
- Aggiungi (click destro mappa o bottone "Nuovo")
- Visualizza (click marker o lista)
- Modifica (solo utenti autenticati)
- Elimina (solo utenti autenticati)
- Real-time sync con Firestore

### 4. Note Autisti
- Sezione dedicata per note collaborative
- Real-time updates
- Visualizzabili anche da utenti Guest
- Aggiungibili da tutti (autenticati e guest)
- Timestamp automatico

### 5. Landing Page "Come Funziona"
- Design moderno e professionale
- Hero section con gradient animato
- Wave SVG separator
- 4 feature cards (Mappa, Mobile, Collaborazione, Gestione)
- Sezione "Come Iniziare" con 4 step numerati
- Tech stack showcase
- CTA finale
- Footer
- Parallax effect su background
- Animazioni smooth (slideInUp, fade-in)
- Completamente responsive

### 6. PWA Features
- **Service Worker** (sw.js) con caching strategico
- **Manifest.json** per installazione
- **Funziona offline** (basic caching)
- **Installabile** su iOS e Android
- **Prompt installazione** iOS dedicato
- **Icone** per tutte le dimensioni

### 7. UI/UX
- **Menu Mobile**: Full-screen overlay centrato con pulsanti normali
- **Dark Mode**: Toggle in header
- **Responsive**: Mobile-first design
- **Animazioni**: Fade-in, slide-in, pulse, bounce
- **Loading states**: Spinner, skeleton screens
- **Error handling**: Alert user-friendly

## Errori Comuni da Evitare

### 🚨 CRITICI

1. **NON cambiare mai il tile layer senza testare**
   - Problema: Alcuni provider richiedono API key (Jawg, Mapbox)
   - Soluzione: Usare OSM HOT che è gratuito e senza auth
   - URL corretto: `https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png`

2. **NON usare `height: 100%` sul container della mappa**
   - Problema: Leaflet non calcola correttamente l'altezza
   - Soluzione: Usare `position: absolute` con `top/left/right/bottom: 0`
   ```jsx
   <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
     <MapView />
   </div>
   ```

3. **NON dimenticare `&loading=async` nello script Google Maps**
   - Problema: Console warning e performance degradata
   - Soluzione: Aggiungere parametro all'URL script in index.html
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=...&libraries=places&language=it&region=IT&loading=async"></script>
   ```

4. **NON mescolare padding con position absolute**
   - Problema: Layout rotto, mappa non full-screen
   - Soluzione: Separare viste con/senza padding
   ```jsx
   {view === 'map' && (
     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
       <MapView />
     </div>
   )}
   {view !== 'map' && (
     <div className="container mx-auto px-4 py-6">
       {/* altre viste */}
     </div>
   )}
   ```

5. **NON rimuovere funzionalità esistenti senza chiedere**
   - Problema: L'utente potrebbe non aver capito dove si trova la feature
   - Soluzione: Verificare sempre prima di rimuovere (es. bottone "Nuovo")

### ⚠️ IMPORTANTI

6. **Gestione click mappa**
   - Desktop: Right-click (contextmenu event)
   - Mobile: Long press (contextmenu event)
   - SEMPRE prevenire menu contestuale del browser
   ```jsx
   useEffect(() => {
     const mapContainer = document.querySelector('.leaflet-container');
     const handleContextMenu = (e) => {
       e.preventDefault();
       e.stopPropagation();
       return false;
     };
     mapContainer.addEventListener('contextmenu', handleContextMenu);
     return () => mapContainer.removeEventListener('contextmenu', handleContextMenu);
   }, []);
   ```

7. **Chiusura risultati ricerca**
   - Deve chiudere con ESC key
   - Deve chiudere con click su mappa
   - NON servono bottoni X se si chiude automaticamente
   ```jsx
   // MapSearchBar.jsx
   useEffect(() => {
     const handleEscape = (e) => {
       if (e.key === 'Escape') {
         setPredictions([]);
         setSearchQuery('');
       }
     };
     document.addEventListener('keydown', handleEscape);
     return () => document.removeEventListener('keydown', handleEscape);
   }, []);
   ```

8. **Service Worker versioning**
   - Incrementare versione ad ogni modifica importante
   - Cache bust per forzare update
   ```js
   const CACHE_VERSION = 'v2.1.0';
   ```

9. **Geolocalizzazione**
   - Sempre gestire errori (permesso negato, timeout, unavailable)
   - Usare `enableHighAccuracy: true` per precisione
   - Cleanup watchPosition in useEffect return
   ```jsx
   useEffect(() => {
     const watchId = navigator.geolocation.watchPosition(
       (position) => { /* ... */ },
       (error) => { /* gestisci errore */ },
       { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
     );
     return () => navigator.geolocation.clearWatch(watchId);
   }, []);
   ```

10. **Menu mobile full-screen**
    - Position fixed (non absolute)
    - Top = altezza header (72px)
    - Z-index alto (9999)
    - Centrato con flexbox
    - Pulsanti con larghezza auto + minWidth
    ```jsx
    <div style={{
      position: 'fixed',
      top: '72px',
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <button style={{ width: 'auto', minWidth: '200px' }}>...</button>
    </div>
    ```

## Best Practices

### Performance
- Lazy loading per componenti pesanti
- Memoization con useMemo/useCallback dove appropriato
- Evitare re-render inutili
- Service Worker per caching assets statici

### Sicurezza
- Firebase Security Rules per proteggere Firestore
- Validazione lato client E server
- Sanitizzazione input utente
- HTTPS only in produzione

### Codice
- Componenti funzionali con hooks
- PropTypes o TypeScript per type checking
- Nomi variabili descrittivi in italiano (cantiere, indirizzo, etc.)
- Commenti in italiano dove necessario
- Gestione errori con try/catch e user feedback

### Git
- Commit messages descrittivi con emoji
- Branch per feature nuove
- Pull request per review
- Tag per releases

## Configurazione Firebase

```js
// firebase/config.js
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};
```

**Variabili ambiente** (.env):
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_GOOGLE_MAPS_API_KEY=...
```

## Comandi Utili

```bash
# Sviluppo
npm run dev

# Build produzione
npm run build

# Preview build
npm run preview

# Lint
npm run lint

# Deploy Firebase
firebase deploy
```

## Testing Checklist

Prima di ogni release, testare:

- [ ] Login email/password
- [ ] Login Google OAuth
- [ ] Accesso Guest
- [ ] Visualizzazione mappa con tutti i cantieri
- [ ] Click destro per aggiungere cantiere (desktop)
- [ ] Long press per aggiungere cantiere (mobile)
- [ ] Ricerca indirizzo Google Places
- [ ] Chiusura ricerca con ESC
- [ ] Chiusura ricerca con click mappa
- [ ] Geolocalizzazione utente (bottone locate me)
- [ ] Tracking posizione real-time
- [ ] Aggiunta nuovo cantiere
- [ ] Modifica cantiere esistente
- [ ] Eliminazione cantiere
- [ ] Upload foto
- [ ] Note autisti (aggiunta e visualizzazione)
- [ ] Navigazione Google Maps da marker
- [ ] Menu mobile full-screen
- [ ] Dark mode toggle
- [ ] Landing page "Come Funziona"
- [ ] Installazione PWA (iOS e Android)
- [ ] Funzionamento offline base
- [ ] Responsive su tutti i breakpoint (mobile, tablet, desktop)

## API Keys e Limiti

### Google Maps Places API
- **Quota gratuita**: $200/mese di crediti
- **Autocomplete**: ~$2.83 per 1000 richieste (session-based)
- **Geocoding**: ~$5 per 1000 richieste
- **Ottimizzazione**: Usare session tokens per autocomplete

### Geolocation API
- **GRATIS**: API nativa del browser
- **Nessun costo**
- **Nessun limite**
- Richiede HTTPS o localhost
- Richiede permesso utente

### Firebase
- **Spark Plan (Gratuito)**:
  - Firestore: 1GB storage, 50K letture/giorno
  - Storage: 5GB
  - Auth: Illimitati utenti
- **Blaze Plan (Pay-as-you-go)**:
  - Solo quando superi limiti gratuiti

## Troubleshooting Comune

### Mappa non si carica (grigia)
1. Verificare URL tile layer
2. Verificare position absolute sul container
3. Verificare z-index conflicts
4. Check console per errori CORS

### Google Maps API warning
1. Aggiungere `&loading=async` al script
2. Verificare API key valida
3. Verificare billing account abilitato

### Geolocalizzazione non funziona
1. Verificare HTTPS (o localhost)
2. Verificare permessi browser concessi
3. Check console per errori
4. Testare su device fisico (non simulator)

### Service Worker non aggiorna
1. Incrementare CACHE_VERSION
2. Hard refresh (Ctrl+Shift+R)
3. Cancellare cache manualmente da DevTools
4. Unregister e re-register SW

### Dark mode non persiste
1. Verificare localStorage disponibile
2. Check ThemeContext wrapper in main.jsx
3. Verificare inizializzazione nel useEffect

## Roadmap Features Future

- [ ] Notifiche push per cantieri urgenti
- [ ] Export PDF report cantieri
- [ ] Filtri avanzati mappa (per stato, difficoltà, data)
- [ ] Calendario cantieri
- [ ] Multi-lingua (EN, DE, FR)
- [ ] Analytics dashboard
- [ ] Chat team integrata
- [ ] Integrazione meteo API
- [ ] Offline mode completo (sync queue)
- [ ] Desktop app (Electron)

## Contatti e Supporto

**Cliente**: General Beton
**Sviluppatore**: [Nome Sviluppatore]
**Repository**: [URL GitHub]
**Documentazione**: Questo file + README.md

---

## Note per AI Assistant

Quando lavori su questo progetto:

1. **Leggi sempre questo documento PRIMA di fare modifiche**
2. **NON rimuovere mai funzionalità esistenti senza conferma esplicita**
3. **Testa sempre le modifiche alla mappa** (è la parte più critica)
4. **Incrementa Service Worker version** ad ogni modifica
5. **Mantieni lo stile di codice esistente** (nomi in italiano, commenti, etc.)
6. **Gestisci sempre gli errori** con feedback utente chiaro
7. **Pensa mobile-first** (la maggior parte degli utenti sono autisti su smartphone)
8. **Commit atomici e descrittivi** con emoji 🎨🐛✨📱
9. **Chiedi chiarimenti** se una richiesta è ambigua
10. **Documenta le decisioni importanti** in questo file

Buon lavoro! 🚀
