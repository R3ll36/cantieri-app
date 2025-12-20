# 🔥 Guida Completa Setup Firebase

## Panoramica

Firebase fornirà:
- **Firestore Database**: Database NoSQL real-time per cantieri e note
- **Storage**: Archiviazione foto/video
- **Authentication**: Login impiantisti/autisti
- **Hosting**: Deploy web app (opzionale)

**Costo: 100% GRATUITO** (fino a 50k letture/giorno, 20k scritture/giorno, 5GB storage)

---

## Passo 1: Crea Progetto Firebase

### 1.1 Vai alla Console Firebase
- Apri https://console.firebase.google.com
- Accedi con il tuo account Google

### 1.2 Crea Nuovo Progetto
1. Click **"Aggiungi progetto"** (o "Add project" se in inglese)
2. **Nome progetto**: `cantieri-app` (o personalizza)
3. Click **"Continua"**
4. **Google Analytics**:
   - Per sviluppo: **Disabilita** (più semplice)
   - Per produzione: Abilita (utile per statistiche)
5. Click **"Crea progetto"**
6. Attendi 30-60 secondi per la creazione
7. Click **"Continua"** quando pronto

---

## Passo 2: Configura Firestore Database

### 2.1 Crea Database
1. Menu laterale sinistro → **"Firestore Database"**
2. Click **"Crea database"**

### 2.2 Modalità Sicurezza (IMPORTANTE!)
Scegli una delle due opzioni:

**Opzione A: Modalità Test (per sviluppo - SEMPLICE)**
- Click **"Inizia in modalità test"**
- ⚠️ **Attenzione**: Chiunque può leggere/scrivere per 30 giorni
- Perfetto per sviluppo iniziale
- Dovrai configurare regole prima di mettere in produzione

**Opzione B: Modalità Produzione (SICURA)**
- Click **"Inizia in modalità produzione"**
- Negherà tutto per default
- Dovrai configurare regole subito (vedi sotto)

**Consiglio**: Usa **Modalità Test** per ora, poi passiamo a regole sicure.

### 2.3 Località Database
- Scegli **`europe-west1 (Belgium)`** - più vicino all'Italia
- ⚠️ **Non puoi cambiare località dopo!**
- Click **"Abilita"**

### 2.4 Attendi Creazione
- Firestore si sta creando (20-30 secondi)
- Vedrai la console Firestore vuota

---

## Passo 3: Configura Firebase Storage

### 3.1 Abilita Storage
1. Menu laterale → **"Storage"**
2. Click **"Inizia"** (o "Get started")

### 3.2 Regole Sicurezza
- Scegli **"Inizia in modalità test"** (come Firestore)
- ⚠️ Scadenza dopo 30 giorni

### 3.3 Località Storage
- Usa **stessa località di Firestore**: `europe-west1`
- Click **"Fine"**

### 3.4 Crea Struttura Cartelle (Opzionale ora)
Storage è pronto. Le cartelle si creeranno automaticamente quando caricherai la prima foto:
- `/cantieri-foto/{cantiereId}/originali/`
- `/cantieri-foto/{cantiereId}/note-autisti/`

---

## Passo 4: Abilita Authentication

### 4.1 Vai a Authentication
1. Menu laterale → **"Authentication"**
2. Click **"Inizia"** (o "Get started")

### 4.2 Abilita Email/Password
1. Tab **"Sign-in method"** (in alto)
2. Trova **"Email/Password"** nella lista
3. Click su di esso
4. Toggle **"Abilita"** → ON
5. (Opzionale) Abilita anche **"Link e-mail (accesso senza password)"** se vuoi
6. Click **"Salva"**

### 4.3 (Opzionale) Abilita Google Sign-In
1. Ancora in "Sign-in method"
2. Click su **"Google"**
3. Toggle **"Abilita"** → ON
4. **Email assistenza progetto**: inserisci tua email
5. Click **"Salva"**

---

## Passo 5: Ottieni Credenziali per Web App

### 5.1 Vai alle Impostazioni Progetto
1. Click sull'icona **ingranaggio** ⚙️ (in alto a sinistra, vicino a "Panoramica progetto")
2. Click **"Impostazioni progetto"**

### 5.2 Registra App Web
1. Scorri fino alla sezione **"Le tue app"** (in basso)
2. Click sull'icona **Web** `</>`
3. Compila il form:
   - **Nickname app**: `cantieri-web`
   - **NON** spuntare "Configura anche Firebase Hosting" (lo faremo dopo se necessario)
4. Click **"Registra app"**

### 5.3 Copia Configurazione Firebase
Vedrai un blocco di codice come questo:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrst",
  authDomain: "cantieri-app-12345.firebaseapp.com",
  projectId: "cantieri-app-12345",
  storageBucket: "cantieri-app-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

**📋 COPIA TUTTO QUESTO BLOCCO!** Lo useremo dopo.

5. Click **"Continua alla console"**

---

## Passo 6: Registra App iOS e Android (per Mobile)

### 6.1 Registra App iOS
1. Sempre in **"Impostazioni progetto"** → **"Le tue app"**
2. Click icona **iOS** (mela)
3. Compila:
   - **ID pacchetto iOS**: `com.cantieriapp.mobile`
   - **Nickname app**: `cantieri-mobile-ios`
   - **App Store ID**: Lascia vuoto (non ancora pubblicata)
4. Click **"Registra app"**
5. **Scarica GoogleService-Info.plist**: Click "Scarica GoogleService-Info.plist"
   - Salva in `/mobile/` (la useremo dopo con Expo)
6. Click **"Continua"** → **"Continua"** → **"Continua alla console"**

### 6.2 Registra App Android
1. Click icona **Android** (robot verde)
2. Compila:
   - **Nome pacchetto Android**: `com.cantieriapp.mobile`
   - **Nickname app**: `cantieri-mobile-android`
   - **Certificato di firma SHA-1**: Lascia vuoto per ora (Expo lo gestisce)
3. Click **"Registra app"**
4. **Scarica google-services.json**: Click "Scarica google-services.json"
   - Salva in `/mobile/` (la useremo dopo con Expo)
5. Click **"Continua"** → **"Continua"** → **"Continua alla console"**

---

## Passo 7: Crea File .env per Web App

### 7.1 Crea File .env
Nella cartella `web/`, crea un file chiamato `.env` (nota il punto all'inizio!)

### 7.2 Inserisci Credenziali
Usa la configurazione copiata al Passo 5.3 e convertila in variabili d'ambiente:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrst
VITE_FIREBASE_AUTH_DOMAIN=cantieri-app-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cantieri-app-12345
VITE_FIREBASE_STORAGE_BUCKET=cantieri-app-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
```

**⚠️ IMPORTANTE:**
- Sostituisci i valori con i TUOI dati (quelli copiati)
- **NON** committare questo file su Git (è già in `.gitignore`)
- Per Vite, le variabili devono iniziare con `VITE_`

### 7.3 Verifica File
Il file `.env` deve essere in:
```
cantieri-app/
└── web/
    ├── .env          ← QUI
    ├── package.json
    └── src/
```

---

## Passo 8: Configura Regole Firestore (Sicurezza)

### 8.1 Vai a Firestore Rules
1. Menu laterale → **"Firestore Database"**
2. Tab **"Regole"** (in alto)

### 8.2 Regole di Sviluppo (Permissive - Solo per Test!)
Per sviluppo iniziale, usa queste regole:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permetti tutto per 30 giorni (SOLO SVILUPPO!)
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 2, 1);
    }
  }
}
```

### 8.3 Regole di Produzione (Sicure - Usa Prima del Lancio!)
Prima di mettere online, usa queste regole:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Collezione cantieri
    match /cantieri/{cantiereId} {
      // Tutti possono leggere
      allow read: if true;

      // Solo utenti autenticati possono creare/modificare
      allow create, update: if request.auth != null;

      // Solo il creatore o admin possono eliminare
      allow delete: if request.auth != null &&
                       (request.auth.uid == resource.data.created_by ||
                        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    // Collezione note_autisti
    match /note_autisti/{noteId} {
      // Tutti possono leggere
      allow read: if true;

      // Solo utenti autenticati possono creare note
      allow create: if request.auth != null;

      // Solo autore può modificare/eliminare propria nota
      allow update, delete: if request.auth != null &&
                                request.auth.uid == resource.data.autista_id;
    }

    // Collezione users (se la crei)
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 8.4 Pubblica Regole
- Click **"Pubblica"** in alto
- Le regole sono attive immediatamente

---

## Passo 9: Configura Regole Storage (Sicurezza)

### 9.1 Vai a Storage Rules
1. Menu laterale → **"Storage"**
2. Tab **"Rules"** (in alto)

### 9.2 Regole di Sviluppo (Permissive)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permetti tutto per 30 giorni (SOLO SVILUPPO!)
    match /{allPaths=**} {
      allow read, write: if request.time < timestamp.date(2025, 2, 1);
    }
  }
}
```

### 9.3 Regole di Produzione (Sicure)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Foto cantieri
    match /cantieri-foto/{cantiereId}/{folder}/{fileName} {
      // Tutti possono leggere
      allow read: if true;

      // Solo autenticati possono caricare (max 5MB)
      allow write: if request.auth != null &&
                      request.resource.size < 5 * 1024 * 1024 &&
                      request.resource.contentType.matches('image/.*') ||
                      request.resource.contentType.matches('video/.*');

      // Solo autenticati possono eliminare
      allow delete: if request.auth != null;
    }
  }
}
```

### 9.4 Pubblica Regole
- Click **"Pubblica"**

---

## Passo 10: (Opzionale) Crea Utente Test

### 10.1 Vai a Authentication
1. Menu laterale → **"Authentication"**
2. Tab **"Users"**

### 10.2 Aggiungi Utente Manualmente
1. Click **"Aggiungi utente"**
2. **Email**: `test@cantieriapp.com` (o tua email)
3. **Password**: `TestCantieri123!` (o personalizza)
4. Click **"Aggiungi utente"**

Userai queste credenziali per testare login nella web app.

---

## Passo 11: (Opzionale) Crea Dati di Test

### 11.1 Vai a Firestore
1. Menu laterale → **"Firestore Database"**
2. Tab **"Dati"**

### 11.2 Crea Collezione `cantieri`
1. Click **"Avvia raccolta"**
2. **ID raccolta**: `cantieri`
3. Click **"Avanti"**

### 11.3 Aggiungi Documento di Test
1. **ID documento**: Lascia "Auto-ID"
2. Aggiungi campi (click "+ Aggiungi campo"):

| Campo | Tipo | Valore |
|-------|------|--------|
| nome | string | Cantiere Test Via Roma |
| indirizzo | string | Via Roma 123, Udine |
| coordinate | map | (vedi sotto) |
| maps_link | string | https://maps.google.com/?q=46.0569,13.2348 |
| cliente | string | Test Cliente SRL |
| tipologia | string | Residenziale |
| note_operative | string | Citofono al civico 12 |
| orari | string | 7:00-18:00 |
| difficolta | string | Facile |
| stato | string | Attivo |
| created_at | timestamp | (click icona orologio, scegli "ora") |
| foto_urls | array | (lascia vuoto per ora) |

Per il campo `coordinate` (tipo **map**):
- Click "map"
- Aggiungi due campi dentro:
  - `lat` (number): `46.0569`
  - `lng` (number): `13.2348`

3. Click **"Salva"**

### 11.4 Verifica
Dovresti vedere il documento creato nella collezione `cantieri`. Questo apparirà nella web app quando la avvierai!

---

## ✅ Setup Completato!

Ora hai:
- ✅ Progetto Firebase creato
- ✅ Firestore Database attivo
- ✅ Storage configurato
- ✅ Authentication abilitata (Email/Password)
- ✅ Credenziali web salvate in `.env`
- ✅ App iOS e Android registrate
- ✅ Regole di sicurezza configurate
- ✅ (Opzionale) Utente e dati di test

---

## 🔧 Prossimi Passi

1. **Sviluppo Web App**:
   ```bash
   cd web
   npm install
   npm run dev
   ```
   Vai su http://localhost:5173 e dovresti vedere la web app connessa a Firebase!

2. **Sviluppo Mobile App**:
   ```bash
   cd mobile
   npm install
   npx expo start
   ```

3. **Monitoraggio Firebase**:
   - Tieni aperta la console Firebase per vedere dati in tempo reale
   - Tab "Usage" per monitorare limiti gratuiti

---

## 🆘 Troubleshooting

### Errore: "Firebase: Error (auth/invalid-api-key)"
- Verifica che il file `.env` sia nella cartella `web/`
- Verifica che le variabili inizino con `VITE_`
- Riavvia il server di sviluppo: `npm run dev`

### Errore: "Missing or insufficient permissions"
- Vai a Firestore Rules e verifica che siano pubblicate
- Usa regole permissive per sviluppo (vedi Passo 8.2)

### Storage non carica foto
- Verifica regole Storage (Passo 9)
- Controlla dimensione file (max 5MB in regole produzione)
- Verifica formato (jpg, png, mp4, etc.)

### "Project not found"
- Verifica che `VITE_FIREBASE_PROJECT_ID` sia corretto
- Controlla di aver copiato le credenziali giuste

---

## 📊 Monitoraggio Limiti Gratuiti

Firebase gratis include:
- **Firestore**: 50,000 letture/giorno, 20,000 scritture/giorno
- **Storage**: 5GB totale, 1GB download/giorno
- **Authentication**: Utenti illimitati (no costi per email/password)

Per monitorare:
1. Console Firebase → **"Usage"** (in alto a destra)
2. Vedi grafici di utilizzo giornaliero
3. Se ti avvicini ai limiti, riceverai email di avviso

**Per 130 autisti**: Sei ampiamente dentro i limiti gratuiti! 🎉

---

## 🔐 Sicurezza - Checklist Prima del Lancio

Prima di pubblicare in produzione:

- [ ] Cambia regole Firestore da "test mode" a regole sicure (Passo 8.3)
- [ ] Cambia regole Storage da "test mode" a regole sicure (Passo 9.3)
- [ ] Rimuovi utenti di test da Authentication
- [ ] Abilita **App Check** (protezione da abuso):
  - Console Firebase → App Check
  - Abilita per web e mobile
- [ ] Configura **backup automatici**:
  - Firebase Console → Firestore → Backup (servizio a pagamento, ma raccomandato)
- [ ] Testa la web app con utenti reali
- [ ] Verifica che `.env` sia in `.gitignore` (NON committare credenziali!)

---

**🎉 Congratulazioni! Firebase è pronto per Cantieri App!**

Torna al [README principale](../README.md) per continuare con lo sviluppo web/mobile.
