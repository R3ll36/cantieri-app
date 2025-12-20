# Cantieri App - Web Application

Web app React per gestione cantieri calcestruzzo (impiantisti).

## 🚀 Avvio Rapido

### 1. Setup Firebase

Prima di avviare l'app, **devi completare il setup Firebase**:

📖 Segui la guida: [`../docs/SETUP_FIREBASE.md`](../docs/SETUP_FIREBASE.md)

Al termine avrai le credenziali Firebase da inserire nel file `.env`.

### 2. Crea file .env

Crea un file `.env` nella cartella `web/` (questa cartella):

```bash
# Copia il template
cp .env.example .env
```

Poi modifica `.env` e inserisci le TUE credenziali Firebase (ottenute dal setup):

```env
VITE_FIREBASE_API_KEY=AIza...la-tua-api-key
VITE_FIREBASE_AUTH_DOMAIN=cantieri-app-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cantieri-app-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=cantieri-app-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 3. Installa dipendenze

```bash
npm install
```

### 4. Avvia server di sviluppo

```bash
npm run dev
```

Apri http://localhost:5173 nel browser.

### 5. Crea primo utente

Dalla Console Firebase:
1. Vai su **Authentication** → **Users**
2. Click **Aggiungi utente**
3. Email: `admin@cantieriapp.com` (o tua email)
4. Password: `Admin123!` (o personalizza)
5. Click **Aggiungi utente**

Ora puoi fare login nella web app con queste credenziali!

---

## 📖 Funzionalità Web App

### Per Impiantisti (Autenticati)

- ✅ **Visualizza tutti i cantieri** su mappa o lista
- ✅ **Aggiungi cantiere** tramite:
  - Link Google/Apple Maps (incolla link, app estrae coordinate automaticamente)
  - Click diretto su mappa
- ✅ **Modifica/Elimina cantieri**
- ✅ **Visualizza note autisti** in tempo reale
- ✅ **Upload foto cantiere** (max 5 foto, 5MB ciascuna)
- ✅ **Condividi link Google Maps** del cantiere (da mandare agli autisti)

### Per Ospiti (Non autenticati)

- ✅ **Solo visualizzazione** cantieri (lista e mappa)
- ✅ **Vedi dettagli** cantieri
- ✅ **Vedi note autisti**
- ❌ Non può aggiungere/modificare/eliminare

Click "Continua come Ospite" nella schermata login.

---

## 🗺️ Parsing Link Google/Apple Maps

L'app supporta questi formati link:

### Google Maps
```
https://maps.google.com/?q=46.022747,13.125890
https://maps.app.goo.gl/Nz3qn49qHQ6ds31J8
https://www.google.com/maps/@46.022747,13.125890,15z
```

### Apple Maps
```
https://maps.apple.com/?ll=46.022747,13.125890
https://maps.apple.com/?address=Via%20Roma%20123,%20Udine
```

**Come usare:**
1. Apri Google Maps sul telefono
2. Premi e tieni premuto su un punto → appare pin rosso
3. Tap sul pin → "Condividi" → Copia link
4. Incolla link nella web app → Click "Carica"
5. App estrae coordinate e mostra posizione su mappa

---

## 🔥 Struttura Database Firebase

### Collezione `cantieri`
```javascript
{
  id: "auto-generated",
  nome: "Cantiere Residenziale Via Roma",
  indirizzo: "Via Roma 123, Udine",
  coordinate: { lat: 46.022747, lng: 13.125890 },
  maps_link: "https://maps.google.com/?q=46.022747,13.125890",
  cliente: "Costruzioni Rossi SRL",
  tipologia: "Residenziale", // Residenziale | Industriale | Stradale | Altro
  note_operative: "Citofono civico 12",
  orari: "7:00-18:00",
  difficolta: "Medio", // Facile | Medio | Difficile
  stato: "Attivo", // Attivo | Completato | Sospeso
  data_inizio: "2024-01-15",
  data_fine_prevista: "2024-03-30",
  coordinatore_nome: "Marco Bianchi",
  coordinatore_telefono: "+39 333 1234567",
  foto_urls: ["url1", "url2"],
  created_at: timestamp,
  updated_at: timestamp,
  created_by: "user_id"
}
```

### Collezione `note_autisti`
```javascript
{
  id: "auto-generated",
  cantiere_id: "ref_to_cantiere",
  autista_nome: "Giovanni",
  testo: "Terreno fangoso dopo pioggia",
  media_urls: ["url_foto"],
  media_types: ["image"],
  timestamp: timestamp
}
```

---

## 🎨 UI/UX

### Header
- **Lista** / **Mappa** / **Nuovo** (bottoni navigazione)
- Contatore cantieri totali
- Email utente + Logout

### Vista Lista
- Ricerca per nome/indirizzo
- Filtri: stato, tipologia, ordinamento
- Card cantieri con:
  - Info principali
  - Badge difficoltà e stato
  - Bottoni: Copia Link, Modifica, Elimina

### Vista Mappa
- Mappa Leaflet con marker colorati:
  - 🟢 Verde = Facile
  - 🟡 Giallo = Medio
  - 🔴 Rosso = Difficile
  - ⚫ Grigio = Completato
- Click marker → popup con info
- Click mappa → aggiungi cantiere (se autenticato)

### Form Cantiere
- Incolla link Maps → estrae coordinate automaticamente
- Form completo con tutti i campi
- Upload fino a 5 foto (preview)
- Validazione campi obbligatori

### Dettaglio Cantiere
- **Colonna sinistra**: Info complete, foto, link Maps
- **Colonna destra**: Note autisti (real-time)
- Bottone "Apri in Google Maps"

---

## 🔒 Sicurezza

### Regole Firestore (da configurare prima del lancio)

Vedi `../firebase/firestore.rules` per regole complete.

**Sintesi:**
- Tutti possono **leggere** cantieri (anche non autenticati)
- Solo utenti **autenticati** possono creare/modificare cantieri
- Solo **creatore** o **admin** può eliminare cantiere
- Tutti possono creare note autisti
- Solo **autore** può eliminare propria nota

---

## 🛠️ Comandi Disponibili

```bash
# Sviluppo
npm run dev          # Avvia server dev (http://localhost:5173)

# Build produzione
npm run build        # Compila per produzione (cartella dist/)
npm run preview      # Preview build produzione

# Linting
npm run lint         # Controlla codice
```

---

## 📦 Dipendenze Principali

- **React 18** - UI library
- **Vite** - Build tool (super veloce!)
- **Firebase** - Backend (Firestore + Storage + Auth)
- **React Leaflet** - Mappe interattive
- **React Hook Form** - Gestione form
- **Tailwind CSS** - Styling

---

## 🚀 Deploy Produzione

### Opzione 1: Vercel (GRATUITO, consigliato)

```bash
# Installa Vercel CLI
npm install -g vercel

# Deploy
vercel

# Segui wizard:
# - Link progetto a Vercel
# - Configura variabili ambiente (copia da .env)
# - Deploy!
```

Vercel fornirà un URL tipo: `https://cantieri-app.vercel.app`

### Opzione 2: Firebase Hosting (GRATUITO)

```bash
# Installa Firebase CLI
npm install -g firebase-tools

# Login Firebase
firebase login

# Inizializza hosting
firebase init hosting
# Scegli: dist come cartella pubblica

# Build + Deploy
npm run build
firebase deploy --only hosting
```

URL Firebase: `https://cantieri-app-xxxxx.web.app`

---

## ⚠️ Troubleshooting

### Errore: "Firebase: Error (auth/invalid-api-key)"
- Verifica che il file `.env` sia nella cartella `web/`
- Controlla che le variabili inizino con `VITE_`
- Riavvia server dev: `npm run dev`

### Mappa non si vede
- Verifica connessione internet (Leaflet usa tile OpenStreetMap)
- Controlla console browser per errori
- Prova a ricaricare pagina

### Icone mappa non si vedono
- Già fixato in `src/components/MapView.jsx`
- Usa CDN unpkg per icone Leaflet

### Errore upload foto
- Max 5MB per foto
- Formati supportati: JPG, PNG, WEBP, MP4
- Verifica regole Storage Firebase

### "Missing or insufficient permissions"
- Vai a Firebase Console → Firestore → Rules
- Verifica che regole siano pubblicate
- Per sviluppo usa regole "test mode"

---

## 📱 Prossimo Passo: Mobile App

Una volta che la web app funziona, passa allo sviluppo della mobile app:

📂 Vai a: `../mobile/README.md`

L'app mobile userà lo **stesso database Firebase**, quindi i dati saranno sincronizzati automaticamente in tempo reale tra web e mobile!

---

## 💡 Tips

1. **Test con dati reali**: Aggiungi 3-5 cantieri di prova con coordinate reali
2. **Invita colleghi**: Crea account per impiantisti e fai testare
3. **Mobile first**: Testa anche su tablet/smartphone (responsive)
4. **Performance**: Con <100 cantieri, tutto è istantaneo
5. **Backup**: Firebase fa backup automatici, ma esporta periodicamente dati

---

## 📞 Supporto

Per problemi:
1. Controlla documentazione Firebase: [`../docs/SETUP_FIREBASE.md`](../docs/SETUP_FIREBASE.md)
2. Verifica console errori browser (F12)
3. Controlla console Firebase per limiti/errori

---

**Buon lavoro! 🚀**
