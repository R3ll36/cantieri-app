# 🚛 Cantieri App - Sistema Gestione Cantieri Calcestruzzo

Sistema completo PWA per gestione e localizzazione cantieri per autisti betonpompa - **100% GRATUITO**

## 📋 Panoramica

- **PWA (Progressive Web App)**: Installabile su iOS e Android come app nativa!
- **Web App React**: Per impiantisti - gestione cantieri (aggiunta, modifica, visualizzazione)
- **Mobile Web**: Per autisti - navigazione, note collaborative, real-time sync
- **Backend Firebase**: Database real-time, storage foto/video, autenticazione

## 🎉 Novità PWA

✅ **Installabile come app su iOS e Android** - Nessun App Store necessario!
✅ **Aggiornamenti automatici in tempo reale** - Sempre l'ultima versione
✅ **Google Maps integrato** - Apre direttamente in modalità direzioni
✅ **Funziona offline** - Service Worker cache
✅ **Deploy gratuito su Vercel** - HTTPS, CDN globale, zero configurazione

## 🎯 Funzionalità Principali

### Web App (Impiantisti)
- ✅ Mappa interattiva Leaflet con marker colorati
- ✅ **Right-click su mappa** per aggiungere cantiere con popup conferma
- ✅ Parsing automatico coordinate da link Google/Apple Maps
- ✅ Form completo: nome, indirizzo, cliente, tipologia, note, foto, difficoltà, orari, coordinatore
- ✅ Visualizza note/foto/video da autisti in real-time
- ✅ CRUD completo con filtri e ricerca avanzata
- ✅ Bottone **"Naviga"** - apre Google Maps in modalità direzioni
- ✅ Login Email/Password + **Google OAuth**

### Mobile PWA (Autisti)
- ✅ **Installabile come app nativa** (iOS Safari + Android Chrome)
- ✅ Mappa con marker colorati (rosso=difficile, giallo=medio, verde=facile, grigio=completato)
- ✅ **Google Maps in modalità direzioni** - tap per avviare navigazione
- ✅ Note collaborative real-time con foto/video
- ✅ Aggiornamenti automatici ogni 60 secondi
- ✅ Service Worker per cache e prestazioni
- ✅ Funziona offline (dati cached)

## 🚀 Quick Start

### Opzione 1: Deploy Rapido (Consigliato)

Se vuoi pubblicare subito l'app online:

1. **Leggi**: `COMANDI_RAPIDI.md` per istruzioni passo-passo
2. **Crea repository GitHub**: https://github.com/new
3. **Deploy su Vercel**: https://vercel.com/new
4. **Installa PWA** su mobile e inizia a usarla!

**Tempo totale**: ~10 minuti

---

### Opzione 2: Sviluppo Locale

Se vuoi testare in locale prima del deploy:

## 🚀 Setup Iniziale

### 1. Setup Firebase (IMPORTANTE - DA FARE PER PRIMO!)

#### Passo 1: Crea progetto Firebase
1. Vai su https://console.firebase.google.com
2. Click **"Aggiungi progetto"** (o "Create a project")
3. Nome progetto: `cantieri-app` (o quello che preferisci)
4. **Google Analytics**: Puoi disabilitarlo per ora (non necessario per MVP)
5. Click **"Crea progetto"** e attendi creazione

#### Passo 2: Configura Firestore Database
1. Nel menu laterale Firebase, click **"Firestore Database"**
2. Click **"Crea database"**
3. **Modalità**: Scegli **"Inizia in modalità test"** (per development)
   - Attenzione: le regole di test scadono dopo 30 giorni, poi dovrai configurare le regole di sicurezza
4. **Località**: Scegli `europe-west1` (Belgio - più vicino all'Italia)
5. Click **"Abilita"**

#### Passo 3: Configura Firebase Storage
1. Nel menu laterale, click **"Storage"**
2. Click **"Inizia"**
3. **Modalità**: Scegli **"Inizia in modalità test"**
4. **Località**: `europe-west1` (stessa del database)
5. Click **"Fine"**

#### Passo 4: Abilita Authentication
1. Nel menu laterale, click **"Authentication"**
2. Click **"Inizia"**
3. Tab **"Sign-in method"**
4. Abilita **"Email/Password"**:
   - Click su "Email/Password"
   - Toggle **"Abilita"** ON
   - Click **"Salva"**
5. (Opzionale) Abilita anche **"Google"** per login social

#### Passo 5: Ottieni credenziali Web App
1. Nella home del progetto Firebase (icona ingranaggio → Impostazioni progetto)
2. Scorri fino a **"Le tue app"**
3. Click sull'icona **"Web"** (`</>`)
4. **Nickname app**: `cantieri-web`
5. **NON** spuntare "Configura Firebase Hosting" (lo faremo dopo)
6. Click **"Registra app"**
7. **COPIA** tutto il blocco `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "cantieri-app-xxxxx.firebaseapp.com",
  projectId: "cantieri-app-xxxxx",
  storageBucket: "cantieri-app-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

8. **Salva queste credenziali** in `web/.env` (vedi sotto)
9. Click **"Continua alla console"**

#### Passo 6: Aggiungi app iOS e Android (per mobile)
1. Dalla home Firebase, click di nuovo sull'icona ingranaggio → Impostazioni progetto
2. Scorri a **"Le tue app"**
3. Click icona **iOS** (per app iOS):
   - **ID pacchetto iOS**: `com.cantieriapp.mobile` (lo cambieremo dopo in Expo)
   - **Nickname**: `cantieri-mobile-ios`
   - Click **"Registra app"** → **"Continua"** → **"Continua"** → **"Continua alla console"**
4. Click icona **Android**:
   - **Nome pacchetto Android**: `com.cantieriapp.mobile`
   - **Nickname**: `cantieri-mobile-android`
   - Click **"Registra app"** → **"Continua"** → **"Continua"** → **"Continua alla console"**

#### Passo 7: Crea file .env per Web App
Crea il file `web/.env` con le tue credenziali Firebase:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=cantieri-app-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cantieri-app-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=cantieri-app-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**✅ Firebase Setup Completato!**

---

### 2. Setup Web App (React + Vite)

```bash
cd web
npm install
npm run dev
```

Apri http://localhost:5173

**Credenziali test (per sviluppo):**
- Crea un utente dalla console Firebase Authentication
- Oppure usa registrazione nella web app

---

### 3. Setup Mobile App (React Native + Expo)

```bash
cd mobile
npm install
npx expo start
```

**Test su device:**
- Installa **Expo Go** da App Store/Play Store
- Scannerizza QR code da terminale

**Deep Linking Test:**
1. Apri browser del telefono
2. Vai su `https://maps.google.com/?q=46.022747,13.125890`
3. L'app dovrebbe aprirsi automaticamente!

---

## 📁 Struttura Progetto

```
cantieri-app/
├── web/                     # React Web App (Vite)
│   ├── src/
│   │   ├── components/      # Componenti React
│   │   ├── firebase/        # Config e utilities Firebase
│   │   ├── hooks/           # Custom hooks
│   │   └── App.jsx
│   ├── .env                 # Credenziali Firebase (NON committare!)
│   └── package.json
│
├── mobile/                  # React Native App (Expo)
│   ├── src/
│   │   ├── screens/         # Schermate app
│   │   ├── components/      # Componenti riutilizzabili
│   │   ├── services/        # Firebase, navigation, etc.
│   │   └── App.js
│   ├── app.json             # Config Expo (deep linking)
│   └── package.json
│
├── firebase/                # Config Firebase (regole, deploy)
│   ├── firestore.rules      # Regole sicurezza Firestore
│   ├── storage.rules        # Regole sicurezza Storage
│   └── firebase.json
│
└── docs/                    # Documentazione
    ├── SETUP_FIREBASE.md    # Guida setup Firebase
    └── API.md               # Documentazione API/Database
```

---

## 🔥 Database Firebase

### Collezione `cantieri`
```javascript
{
  id: "auto-generated",
  nome: "Cantiere Residenziale Via Roma",
  indirizzo: "Via Roma 123, San Daniele del Friuli",
  coordinate: { lat: 46.022747, lng: 13.125890 },
  maps_link: "https://maps.google.com/?q=46.022747,13.125890",
  cliente: "Costruzioni Rossi",
  tipologia: "Residenziale", // 'Residenziale' | 'Industriale' | 'Stradale' | 'Altro'
  note_operative: "Citofono civico 12, parcheggio pompa nel cortile",
  orari: "7:00-18:00",
  difficolta: "Medio", // 'Facile' | 'Medio' | 'Difficile'
  stato: "Attivo", // 'Attivo' | 'Completato' | 'Sospeso'
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
  testo: "Terreno molto fangoso dopo la pioggia",
  media_urls: ["url_foto", "url_video"],
  media_types: ["image", "video"],
  timestamp: timestamp
}
```

---

## 💰 Costi

**100% GRATUITO per sempre:**
- Firebase (limiti generosi): 50k letture/giorno, 20k scritture/giorno, 5GB storage
- Vercel hosting web: gratis
- NO pubblicità, NO abbonamenti

**Opzionale (pubblicazione app stores):**
- Apple Developer: $99/anno
- Google Play: $25 una tantum

**Alternativa 100% gratis:** PWA (Progressive Web App) - accessibile da browser, installabile come app

---

## 🛠️ Tecnologie

- **Frontend**: React 19 + Vite
- **Mappa**: Leaflet + React Leaflet + OpenStreetMap (gratuito!)
- **Styling**: Custom Vanilla CSS (Tailwind-like utilities)
- **Form**: React Hook Form
- **Backend**: Firebase (Firestore + Storage + Auth)
- **PWA**: Service Worker + Web App Manifest
- **Deployment**: Vercel (web hosting gratuito con CDN globale)

---

## 📱 Features Chiave

### 1. Google Maps in Modalità Direzioni
Quando clicchi **"Naviga"** o apri un link cantiere:
- Google Maps si apre **direttamente in modalità direzioni**
- Partenza automatica da posizione corrente
- Basta premere **"Avvia"** per partire
- Formato: `https://maps.google.com/maps?saddr=Current+Location&daddr=LAT,LNG&directionsmode=driving`

### 2. PWA Installabile (iOS + Android)
**iOS (Safari)**:
1. Apri sito → Condividi → "Aggiungi a Home"
2. L'app appare sulla home screen come app nativa
3. Funziona a schermo intero senza barra browser

**Android (Chrome)**:
1. Apri sito → Banner "Aggiungi a schermata Home"
2. Oppure: Menu → "Installa app"
3. Icona app sulla home screen

**Aggiornamenti Real-Time**:
- Service Worker controlla aggiornamenti ogni 60 secondi
- Popup chiede conferma per ricaricare nuova versione
- Zero downtime, sempre aggiornato!

### 3. Right-Click per Aggiungere Cantieri
- **Right-click** su mappa → appare marker blu temporaneo
- Popup con coordinate e bottoni "Aggiungi" / "Annulla"
- Conferma → apre form compilato con coordinate

### 4. Note Collaborative Autisti
Gli autisti si aiutano tra loro in tempo reale:
- "Oggi parcheggio pieno, usa via laterale"
- "Attenzione: terreno fangoso dopo pioggia"
- Foto/video dell'ingresso aggiornato
- Sincronizzazione istantanea via Firestore

---

## 🚧 Roadmap

**✅ FASE 1 (Completata):**
- Setup Firebase (Firestore + Storage + Auth)
- Web app React + Vite con mappa Leaflet
- CRUD cantieri con filtri e ricerca
- Parsing automatico link Google/Apple Maps
- Right-click per aggiungere cantieri
- Google Maps in modalità direzioni
- Note autisti collaborative
- Login Email/Password + Google OAuth
- **PWA completo** (Service Worker + Manifest)
- **Installabile su iOS e Android**
- **Aggiornamenti automatici real-time**

**🔄 FASE 2 (In corso):**
- Deployment su Vercel
- Creazione icone PWA professionali
- Testing completo su iOS e Android
- Ottimizzazioni performance

**📅 FASE 3 (Prossimamente):**
- Testing con autisti reali
- Raccolta feedback e miglioramenti UX
- Tooltip con nome cantiere sopra marker
- Notifiche push per nuovi cantieri/note

**🔮 Futuro:**
- Modalità offline avanzata (cache completa)
- Database sottopassi crowd-sourced
- Chat real-time per cantiere
- Statistiche e report (cantieri completati, ore lavorate)
- Esportazione dati (PDF, Excel)

---

## 📞 Supporto

Per domande o problemi:
1. Controlla documentazione in `/docs`
2. Verifica setup Firebase
3. Controlla console errori browser/Expo

---

**Fatto con ❤️ per gli autisti betonpompa**
