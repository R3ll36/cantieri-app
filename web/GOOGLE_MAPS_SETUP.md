# Setup Google Maps API

Per abilitare la barra di ricerca sulla mappa, devi configurare una API Key di Google Maps.

## Passaggi:

### 1. Ottieni una API Key

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuovo progetto o seleziona uno esistente
3. Vai su "APIs & Services" → "Credentials"
4. Click su "Create Credentials" → "API Key"
5. Copia la tua API key

### 2. Abilita le API necessarie

Il landing page lo vedo solo su versione mobile, invece dovrei vederlo su sito intero come prima voce del menu, non mi sembra proprio professionale poi,
se volessi aggingere la posizione di ogni utente mentre si visualizza la mappa come possiamo fare? E a pagamento? vorrei fare come su google maps, lutente puo vedere la sua posizione e mentre visita unaltro posto deve avere il pulsante target dove la mappa lo riporta sulla posizione attuale.

Nel Google Cloud Console, vai su "APIs & Services" → "Library" e abilita:

- **Maps JavaScript API**
- **Places API**
- **Geocoding API**

### 3. Configura l'API Key nell'app

Apri il file `index.html` e sostituisci la chiave placeholder:

```html
<!-- Trova questa riga -->
<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBHmT0n4gY8YqK_example_replace_this&libraries=places&language=it&region=IT"></script>

<!-- Sostituisci AIzaSyBHmT0n4gY8YqK_example_replace_this con la tua API key -->
<script async defer src="https://maps.googleapis.com/maps/api/js?key=TUA_API_KEY_QUI&libraries=places&language=it&region=IT"></script>
```

### 4. Limita l'API Key (Opzionale ma raccomandato)

Per sicurezza, limita la tua API key:

1. In Google Cloud Console → Credentials
2. Click sulla tua API key
3. In "Application restrictions":
   - Seleziona "HTTP referrers"
   - Aggiungi il dominio della tua app (es. `yourdomain.com/*`)
4. In "API restrictions":
   - Seleziona "Restrict key"
   - Seleziona solo le API necessarie (Maps JavaScript API, Places API, Geocoding API)

### 5. Verifica il funzionamento

1. Riavvia il server di sviluppo: `npm run dev`
2. Apri la mappa
3. Digita un indirizzo nella barra di ricerca
4. Dovresti vedere i suggerimenti in tempo reale

## Troubleshooting

### Non vedo i suggerimenti

- Controlla che le API siano abilitate
- Verifica che la chiave API sia corretta
- Apri la console del browser (F12) e controlla eventuali errori

### Errore "API key not valid"

- Assicurati di aver copiato l'intera chiave API
- Verifica che le restrizioni non blocchino il tuo dominio

### Errore "This API project is not authorized..."

- Vai su Google Cloud Console
- Abilita le API mancanti (Maps JavaScript API, Places API, Geocoding API)

## Costi

Google Maps offre $200 di crediti gratuiti al mese. Con un utilizzo normale, l'app rientra nei limiti gratuiti.

Tariffe (dopo i crediti gratuiti):
- Places Autocomplete: $2.83 per 1000 richieste
- Geocoding API: $5 per 1000 richieste
- Maps JavaScript API: Gratuita per caricamenti

Per maggiori info: https://cloud.google.com/maps-platform/pricing
