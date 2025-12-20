# Setup GitHub e Deployment

## ⚠️ IMPORTANTE: Devi completare questi passaggi manualmente

GitHub ha disabilitato l'autenticazione con password. Segui questi passaggi per creare il repository e fare il deployment:

---

## 1️⃣ Crea Repository su GitHub (2 minuti)

### Opzione A: Interfaccia Web (consigliato)

1. Vai su https://github.com/new
2. Login con:
   - **Username**: `R3ll36`
   - **Password**: `Zigzaga_1324`

3. Compila form:
   - **Repository name**: `cantieri-app`
   - **Description**: `PWA per gestione cantieri e navigazione autisti pompe calcestruzzo`
   - **Public** ✅ (o Private se preferisci)
   - **NO** Add README (già esiste)
   - **NO** Add .gitignore (già esiste)
   - **NO** Add license

4. Click **Create repository**

5. Copia il comando mostrato sotto "…or push an existing repository from the command line":
   ```bash
   git remote add origin https://github.com/R3ll36/cantieri-app.git
   git branch -M main
   git push -u origin main
   ```

### Opzione B: Personal Access Token (se vuoi automatizzare)

Se vuoi fare push senza inserire password ogni volta:

1. Vai su https://github.com/settings/tokens/new
2. Login e crea token con scope `repo` (accesso completo ai repository)
3. Copia il token generato (es: `ghp_xxxxxxxxxxxx`)
4. Usa il token invece della password quando richiesto

---

## 2️⃣ Push Codice su GitHub

Dopo aver creato il repository, esegui questi comandi nel terminale:

```bash
cd /Users/cosminrus/Projects/cantieri-app

# Aggiungi remote GitHub
git remote add origin https://github.com/R3ll36/cantieri-app.git

# Push codice
git branch -M main
git push -u origin main
```

Se richiesto:
- **Username**: `R3ll36`
- **Password**: Il tuo **Personal Access Token** (NON la password normale!)

---

## 3️⃣ Deploy su Vercel (GRATUITO - 5 minuti)

### Perché Vercel?
- ✅ Deploy automatico da GitHub
- ✅ 100% gratuito per progetti personali
- ✅ HTTPS automatico
- ✅ CDN globale
- ✅ Preview automatiche per ogni commit
- ✅ Perfetto per PWA React + Vite

### Procedura:

1. **Vai su** https://vercel.com/signup

2. **Sign Up con GitHub**:
   - Click "Continue with GitHub"
   - Autorizza Vercel ad accedere ai tuoi repository

3. **Import Project**:
   - Click "Add New..." → "Project"
   - Seleziona `R3ll36/cantieri-app`

4. **Configure Project**:
   ```
   Framework Preset: Vite
   Root Directory: web/
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Environment Variables** (IMPORTANTE!):

   Aggiungi queste variabili d'ambiente da Firebase:

   ```
   VITE_FIREBASE_API_KEY=<il tuo API key>
   VITE_FIREBASE_AUTH_DOMAIN=<il tuo auth domain>
   VITE_FIREBASE_PROJECT_ID=<il tuo project ID>
   VITE_FIREBASE_STORAGE_BUCKET=<il tuo storage bucket>
   VITE_FIREBASE_MESSAGING_SENDER_ID=<il tuo sender ID>
   VITE_FIREBASE_APP_ID=<il tuo app ID>
   ```

   **Dove trovare questi valori?**
   - Firebase Console → Project Settings → General → Your apps → Web app
   - Oppure copia da `web/src/firebase/config.js` (se hai già configurato Firebase)

6. **Deploy**:
   - Click "Deploy"
   - Aspetta 2-3 minuti
   - Vercel ti darà un URL tipo: `https://cantieri-app.vercel.app`

7. **Configura Firebase per Vercel**:

   Una volta ottenuto l'URL di Vercel, vai su Firebase Console e aggiungi il dominio:

   - Firebase Console → Authentication → Settings → Authorized domains
   - Aggiungi: `cantieri-app.vercel.app` (o il tuo URL custom)

   Per Google Login:
   - Google Cloud Console → APIs & Services → Credentials
   - OAuth 2.0 Client → Authorized redirect URIs
   - Aggiungi: `https://cantieri-app.vercel.app/__/auth/handler`

---

## 4️⃣ Aggiungi Icone PWA

Per completare la PWA, devi creare 2 icone:

### Opzione 1: Generatore Online (consigliato)
1. Vai su https://www.pwabuilder.com/imageGenerator
2. Carica un'immagine quadrata (logo/brand)
3. Genera tutte le icone
4. Scarica e metti in `/web/public/`:
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)

### Opzione 2: Crea Manualmente
- Software: Figma, Canva, Photoshop
- Dimensioni: 512x512px e 192x192px
- Design: Sfondo arancione (#f97316) con simbolo camion/cantiere bianco

---

## 5️⃣ Test PWA su Mobile

### iOS (iPhone/iPad):
1. Apri Safari e vai su `https://cantieri-app.vercel.app`
2. Tap icona **Condividi** (quadrato con freccia)
3. Scroll e tap **"Aggiungi a Home"**
4. Conferma
5. L'app sarà installata sulla home screen!

### Android:
1. Apri Chrome e vai su `https://cantieri-app.vercel.app`
2. Vedrai banner "Aggiungi a schermata Home"
3. Tap "Aggiungi"
4. Oppure: Menu (⋮) → "Installa app"

### Test Aggiornamenti Real-Time:
1. Installa app su mobile
2. Modifica un cantiere dal web
3. L'app mobile si aggiornerà automaticamente (entro 60 secondi)

---

## 6️⃣ Post-Deploy: Configurazioni Extra

### Domain Personalizzato (opzionale):
- Vercel: Settings → Domains → Add
- Es: `cantieri.tuodominio.com`

### Analytics (opzionale):
- Vercel Analytics (gratuito): Project Settings → Analytics → Enable

### Monitoring:
- Vercel ti avvisa automaticamente se il sito va down
- Puoi vedere metriche di performance in real-time

---

## ✅ Checklist Finale

Prima di considerare il progetto "live":

- [ ] Repository GitHub creato e codice pushato
- [ ] Firebase configurato (Firestore, Auth, Storage)
- [ ] Deploy su Vercel completato
- [ ] Environment variables configurate su Vercel
- [ ] Domini autorizzati aggiunti su Firebase
- [ ] Google OAuth redirect URIs configurati
- [ ] Icone PWA aggiunte (192px e 512px)
- [ ] Test installazione PWA su iOS
- [ ] Test installazione PWA su Android
- [ ] Test aggiornamenti real-time
- [ ] Test navigazione Google Maps (modalità direzioni)
- [ ] Test note collaborative autisti

---

## 🆘 Problemi Comuni

### "redirect_uri_mismatch" (Google Login)
→ Aggiungi `https://cantieri-app.vercel.app/__/auth/handler` agli Authorized redirect URIs

### PWA non installabile su iOS
→ Verifica meta tag `apple-mobile-web-app-capable` in `index.html`
→ Aggiungi icone con formato PNG (non SVG)

### Service Worker non si registra
→ PWA richiede HTTPS (Vercel lo fornisce automaticamente)
→ Verifica console browser per errori

### Firebase "permission denied"
→ Controlla Firestore Rules in Firebase Console
→ Assicurati che autenticazione sia abilitata

---

## 📞 Supporto

- **Vercel Docs**: https://vercel.com/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **PWA Docs**: https://web.dev/progressive-web-apps/

Buon lavoro! 🚀
