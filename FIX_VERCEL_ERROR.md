# 🔧 Fix Errore Vercel "Command exited with 1"

## ✅ Problema Risolto!

Ho corretto il file `vercel.json` che causava l'errore. Ora segui questi passaggi:

---

## 📝 Configurazione Corretta Vercel

Quando configuri il progetto su Vercel, usa **ESATTAMENTE** queste impostazioni:

### Step 1: Import Project
- Repository: `R3ll36/cantieri-app`

### Step 2: Configure Project

```
Framework Preset: Vite
Root Directory: web
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**IMPORTANTE**:
- ✅ **Root Directory**: `web` (NON `web/`)
- ✅ **Output Directory**: `dist` (NON `web/dist`)
- ✅ Lascia i comandi di default, Vercel li eseguirà automaticamente nella directory `web/`

### Step 3: Environment Variables

Aggiungi queste variabili (copia da Firebase Console):

```
VITE_FIREBASE_API_KEY=<tuo_valore>
VITE_FIREBASE_AUTH_DOMAIN=<tuo_valore>
VITE_FIREBASE_PROJECT_ID=<tuo_valore>
VITE_FIREBASE_STORAGE_BUCKET=<tuo_valore>
VITE_FIREBASE_MESSAGING_SENDER_ID=<tuo_valore>
VITE_FIREBASE_APP_ID=<tuo_valore>
```

**Dove trovare questi valori?**
- Firebase Console → Project Settings → General
- Scroll a "Your apps" → Web app → Config
- Oppure copia da `web/src/firebase/config.js`

### Step 4: Deploy

Click **Deploy** e aspetta 2-3 minuti.

---

## 🚀 Se hai già deployato e hai avuto errore

### Opzione 1: Redeploy (consigliato)

1. Vai su Vercel Dashboard
2. Click sul progetto `cantieri-app`
3. Settings → General
4. Scroll a **Build & Development Settings**
5. Modifica:
   - **Root Directory**: `web`
   - **Output Directory**: `dist`
6. Deployments → Ultima deployment → `...` → **Redeploy**

### Opzione 2: Cancella e ricrea

1. Vercel Dashboard → Progetto → Settings
2. Scroll in fondo → **Delete Project**
3. Conferma
4. Ricrea seguendo le istruzioni sopra

---

## 📦 Cosa ho corretto

**Prima** (`vercel.json` - SBAGLIATO):
```json
{
  "buildCommand": "cd web && npm install && npm run build",
  "installCommand": "cd web && npm install"
}
```

**Dopo** (`vercel.json` - CORRETTO):
```json
{
  "rewrites": [...],
  "headers": [...]
}
```

**Perché?**
- Vercel gestisce automaticamente i comandi quando imposti `Root Directory: web`
- I comandi personalizzati causavano conflitti
- Ora `vercel.json` contiene solo configurazioni headers e rewrites

---

## ✅ Checklist Deploy

- [ ] Push su GitHub completato
- [ ] Vercel collegato a repository GitHub
- [ ] **Root Directory** impostato su `web`
- [ ] **Framework** impostato su `Vite`
- [ ] **Output Directory** impostato su `dist`
- [ ] Environment Variables Firebase aggiunte
- [ ] Deploy completato con successo
- [ ] URL pubblico ottenuto (es: `https://cantieri-app.vercel.app`)

---

## 🆘 Ancora Errori?

### Errore: "No Output Directory named 'dist' found"

**Causa**: Root Directory non impostato correttamente

**Fix**:
- Settings → Build & Development → Root Directory → `web`

### Errore: "Module not found"

**Causa**: Dipendenze mancanti o environment variables errate

**Fix**:
1. Verifica environment variables in Vercel (devono iniziare con `VITE_`)
2. Settings → Environment Variables → Controlla tutte le 6 variabili

### Errore: Build fallisce con errori TypeScript/ESLint

**Fix temporaneo**:
- Settings → Build & Development
- Build Command: `npm run build -- --mode production`
- Override → Save

---

## 📞 Deployment URL

Dopo deploy riuscito, Vercel ti darà un URL tipo:

```
https://cantieri-app.vercel.app
```

**Prossimo step**: Aggiungi questo dominio a Firebase:
1. Firebase Console → Authentication → Settings
2. Authorized domains → Add domain → `cantieri-app.vercel.app`

Per Google OAuth:
1. Google Cloud Console → Credentials
2. OAuth client → Authorized redirect URIs
3. Add: `https://cantieri-app.vercel.app/__/auth/handler`

---

## 🎉 Dopo Deploy Riuscito

1. **Testa PWA**:
   - Apri URL su mobile Safari/Chrome
   - Banner "Aggiungi a Home" dovrebbe apparire

2. **Testa Google Maps**:
   - Apri cantiere
   - Click "Naviga"
   - Google Maps dovrebbe aprirsi in modalità direzioni

3. **Testa Aggiornamenti**:
   - Modifica codice
   - Push su GitHub
   - Vercel rideploya automaticamente
   - App mobile riceve popup "Nuova versione disponibile"

---

Buon deploy! 🚀
