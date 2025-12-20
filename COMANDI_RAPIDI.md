# 🚀 Comandi Rapidi - Setup Cantieri App

## 1️⃣ PRIMA: Crea Repository su GitHub

**Vai su**: https://github.com/new

**Compila**:
- Repository name: `cantieri-app`
- Public ✅
- **NON** aggiungere README/gitignore (già esistono)

Click **Create repository**

---

## 2️⃣ Push Codice su GitHub

```bash
cd /Users/cosminrus/Projects/cantieri-app

# Il remote è già configurato, basta fare push:
git push -u origin main
```

**Credentials quando richiesto**:
- Username: `R3ll36`
- Password: Usa **Personal Access Token** (NON la password normale!)

  👉 Crea token qui: https://github.com/settings/tokens/new
  - Scope: `repo` (Full control of private repositories)
  - Copia il token e usalo come password

---

## 3️⃣ Deploy su Vercel

1. Vai su: https://vercel.com/signup
2. Sign up con GitHub (autorizza Vercel)
3. Import Project → Seleziona `R3ll36/cantieri-app`
4. Configura:
   ```
   Framework: Vite
   Root Directory: web/
   Build Command: npm run build
   Output Directory: dist
   ```

5. **Environment Variables** (copia da Firebase):
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

6. Click **Deploy** → Aspetta 2-3 minuti

7. Copia URL (es: `https://cantieri-app.vercel.app`)

---

## 4️⃣ Configura Firebase per Vercel

Firebase Console → Authentication → Settings → Authorized domains:
- Aggiungi: `cantieri-app.vercel.app`

Google Cloud Console → OAuth Credentials → Authorized redirect URIs:
- Aggiungi: `https://cantieri-app.vercel.app/__/auth/handler`

---

## 5️⃣ Aggiungi Icone PWA

Vai su: https://www.pwabuilder.com/imageGenerator
- Carica un'immagine quadrata
- Genera icone
- Scarica `icon-192.png` e `icon-512.png`
- Metti in `/web/public/`

Poi ricompila e rideploy:
```bash
cd /Users/cosminrus/Projects/cantieri-app
git add web/public/icon-*.png
git commit -m "Add PWA icons"
git push
```

Vercel farà automaticamente redeploy! 🎉

---

## 6️⃣ Test su Mobile

### iPhone/iPad:
Safari → Apri sito → Condividi → "Aggiungi a Home"

### Android:
Chrome → Apri sito → Banner "Aggiungi a schermata Home"

---

## ✅ Done!

Ora hai:
- ✅ Repository GitHub
- ✅ App deployata su Vercel
- ✅ PWA installabile su iOS e Android
- ✅ Aggiornamenti automatici in real-time
- ✅ Google Maps in modalità direzioni

Per modifiche future:
```bash
git add .
git commit -m "La tua modifica"
git push
```

Vercel rideploya automaticamente! 🚀
