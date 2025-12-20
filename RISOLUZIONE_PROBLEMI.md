# 🔧 Risoluzione Problemi - Cantieri App

## 1️⃣ Vercel chiede login prima di accedere al sito

### Problema
Il sito `https://cantieri-qtqiy43op-r3ll36s-projects.vercel.app/` richiede login Vercel.

### Causa
Il deployment è in modalità **Preview** invece di **Production**.

### Soluzione A: Promote to Production

1. Vai su **Vercel Dashboard**: https://vercel.com/dashboard
2. Click sul progetto `cantieri-app`
3. Tab **Deployments**
4. Trova il deployment con URL `qtqiy43op`
5. Click sui **3 puntini** `...` accanto
6. **Promote to Production** ✅

### Soluzione B: Verifica Branch Git

1. Vercel Dashboard → Progetto → **Settings**
2. **Git** sezione
3. **Production Branch**: deve essere `main` (non `master` o altro)
4. Se diverso, cambia e salva
5. Fai nuovo push:
   ```bash
   git push origin main
   ```

### Soluzione C: URL Production

Dopo promotion, il sito sarà disponibile su:
```
https://cantieri-app.vercel.app
```
(senza il suffisso qtqiy43op)

---

## 2️⃣ Note Autisti sembrano non funzionare

### Verifica
Le **Note Autisti sono già implementate**! 🎉

Sono nella vista **Dettaglio Cantiere**:
- File: `web/src/App.jsx` linea 466
- Componente: `<NoteAutisti cantiereId={selectedCantiere.id} currentUser={user} />`

### Come accedere

1. **Lista Cantieri** → Click su un cantiere
2. Oppure **Mappa** → Click marker → Click "Vedi dettagli"
3. Si apre vista dettagli con 2 colonne:
   - **Sinistra**: Info cantiere
   - **Destra**: Note Autisti (form + lista)

### Funzionalità Note Autisti

- ✅ Form per aggiungere nota (testo + foto/video)
- ✅ Upload file su Firebase Storage
- ✅ Lista note real-time (Firestore onSnapshot)
- ✅ Mostra autore e timestamp
- ✅ Foto/video cliccabili per aprire

### Test

1. Apri cantiere → Vista dettagli
2. Scroll colonna destra
3. Scrivi nota nel form
4. Click "Aggiungi Nota"
5. La nota appare in lista immediatamente

---

## 3️⃣ App non è responsive

### Verifica Cache Browser

Il CSS responsive è **già implementato**, ma il browser potrebbe aver cachato la versione vecchia.

### Hard Refresh

**Chrome/Edge**:
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Safari**:
- `Cmd + Option + R`

**Firefox**:
- `Ctrl + F5`

### Test Responsive (DevTools)

1. **F12** → Apri DevTools
2. **Toggle Device Toolbar**: `Ctrl + Shift + M` (Windows) o `Cmd + Shift + M` (Mac)
3. Seleziona device: iPhone 12, Galaxy S21, ecc.
4. Verifica:
   - ✅ Layout 1 colonna (non 2)
   - ✅ Bottoni grandi (44px)
   - ✅ Input grandi
   - ✅ Tooltip piccolo sopra marker

### Verifica Deployment Vercel

Assicurati che Vercel abbia fatto rebuild con il nuovo codice:

1. Vercel Dashboard → Deployments
2. Ultimo deployment deve essere **dopo** il commit responsive
3. Se no, fai **Redeploy**:
   - Click deployment → `...` → **Redeploy**

### CSS Responsive Implementato

Il file `web/src/index.css` contiene:

```css
/* Mobile < 768px */
@media (max-width: 768px) {
  .lg\:grid-cols-2 { grid-template-columns: 1fr; }
  button { min-height: 44px; }
  input { min-height: 44px; font-size: 16px; }
  .leaflet-tooltip.cantiere-tooltip { font-size: 10px; }
}

/* Tablet 768px - 1024px */
@media (min-width: 768px) and (max-width: 1024px) {
  .lg\:grid-cols-2 { grid-template-columns: 1fr; }
}

/* Touch devices */
@media (hover: none) and (pointer: coarse) {
  button:active { transform: scale(0.98); }
}
```

---

## 4️⃣ Firebase Console - Progetto non visibile

### Problema Comune: Account Google Sbagliato

Firebase potrebbe essere creato con un account Google diverso da quello attualmente loggato.

### Soluzione A: Switch Account

1. Vai su https://console.firebase.google.com/
2. **Top-right**: Click icona profilo (cerchio con iniziali)
3. **Switch account** o **Add account**
4. Seleziona l'account con cui hai creato il progetto
5. Il progetto dovrebbe apparire

### Soluzione B: URL Diretto

Se conosci il Project ID:

1. Trova il `.env` file: `web/.env`
2. Cerca `VITE_FIREBASE_PROJECT_ID=cantieri-app-xxxxx`
3. Usa URL diretto:
   ```
   https://console.firebase.google.com/u/0/project/[PROJECT_ID]
   ```
   (sostituisci `[PROJECT_ID]` con il tuo valore)

### Soluzione C: Verifica Email

Il progetto Firebase è associato all'email usata durante la creazione:

1. Controlla quale email hai usato per creare il progetto
2. Login Firebase con quella email
3. Se non ricordi, prova tutte le tue email Google

### Soluzione D: Crea Nuovo Progetto

Se proprio non trovi il progetto:

1. Vai su https://console.firebase.google.com/
2. **Add project** → Crea nuovo
3. Nome: `cantieri-app-new`
4. Segui wizard setup
5. Aggiorna `.env` con nuove credenziali

---

## 5️⃣ Google OAuth Error "redirect_uri_mismatch"

### Soluzione (da completare manualmente)

1. Vai su https://console.cloud.google.com/
2. Seleziona progetto Firebase
3. Menu → **APIs & Services** → **Credentials**
4. Click **OAuth 2.0 Client ID** (Web application)
5. **Authorized redirect URIs** → Add URI:
   ```
   https://cantieri-app.vercel.app/__/auth/handler
   ```
6. **Save**

**IMPORTANTE**: Sostituisci `cantieri-app.vercel.app` con il tuo URL Vercel reale!

---

## 6️⃣ Service Worker non si registra

### Verifica HTTPS

PWA richiede HTTPS:
- ✅ Vercel fornisce HTTPS automatico
- ❌ `localhost` HTTP non funziona (usa `localhost` solo per dev)

### Verifica Console

1. **F12** → **Console** tab
2. Cerca:
   - ✅ `Service Worker registrato:`
   - ❌ `Errore registrazione Service Worker:`

3. Se errore, vai su **Application** tab → **Service Workers**
4. Click **Unregister** se presente
5. Ricarica pagina (`F5`)

---

## 7️⃣ PWA non installabile su mobile

### iOS (Safari)

**Requisiti**:
- ✅ HTTPS (Vercel lo fornisce)
- ✅ `manifest.json` presente
- ✅ Meta tag `apple-mobile-web-app-capable`
- ✅ Icone `apple-touch-icon`

**Installazione**:
1. Apri sito su Safari (NON Chrome iOS!)
2. Tap icona **Condividi** (quadrato con freccia)
3. Scroll → **"Aggiungi a Home"**
4. Tap **Aggiungi**

**Nota**: Chrome iOS non supporta PWA install! Serve Safari.

### Android (Chrome)

**Requisiti**:
- ✅ HTTPS
- ✅ `manifest.json` con icone
- ✅ Service Worker registrato

**Installazione**:
1. Apri sito su Chrome Android
2. Banner automatico appare: **"Aggiungi a schermata Home"**
3. Oppure: Menu `⋮` → **"Installa app"**
4. Tap **Installa**

---

## 8️⃣ Firestore "Permission denied"

### Problema

Errore in console:
```
FirebaseError: Missing or insufficient permissions
```

### Causa

Le regole Firestore sono troppo restrittive o scadute (modalità test scade dopo 30 giorni).

### Soluzione

1. Firebase Console → **Firestore Database**
2. Tab **Rules**
3. Sostituisci con:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Cantieri: tutti possono leggere, solo autenticati scrivere
       match /cantieri/{cantiereId} {
         allow read: if true;
         allow write: if request.auth != null;
       }

       // Note autisti: solo autenticati
       match /note_autisti/{noteId} {
         allow read: if true;
         allow create: if request.auth != null;
       }
     }
   }
   ```
4. **Publish**

---

## 📞 Supporto Rapido

### Checklist Debug

- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Vercel deployment è Production (non Preview)
- [ ] Firebase account corretto loggato
- [ ] HTTPS attivo (Vercel lo fornisce automaticamente)
- [ ] Service Worker registrato (controlla Console)
- [ ] Firestore Rules configurate
- [ ] Environment Variables su Vercel configurate

### Link Utili

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Firebase Console**: https://console.firebase.google.com/
- **Google Cloud Console**: https://console.cloud.google.com/

---

**Problema ancora non risolto?** Controlla:
1. Browser Console (F12) per errori
2. Vercel Deployment Logs
3. Firebase Usage (quota superata?)

🎉 **Buona fortuna!**
