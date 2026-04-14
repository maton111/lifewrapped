# LifeWrapped — Roadmap Production-Ready 2025

> Il tuo anno in dati, come Spotify Wrapped ma per la tua vita digitale.

**Stack:** Next.js 14 · .NET 8 Web API · PostgreSQL + JSONB · Cloudflare R2 · Vercel + Railway

---

## Framework React — Raccomandazione

Visto che la tua esperienza React è su Vite + React puro e la timeline è 10 giorni, la scelta più intelligente è **Next.js 14**, per ragioni architetturali precise:

| Motivo | Dettaglio |
|---|---|
| SSR nativo | La pagina pubblica `/result/{token}` richiede server-side rendering per SEO e OG image. Vite non ce l'ha out of the box. |
| OG Image dinamica | `@vercel/og` funziona in modo nativo con Next.js App Router come route handler. Su Remix o Vite richiederebbe setup custom. |
| Deploy zero-config | Vercel è fatto da Vercel per Next.js. Un push su `main` = deploy automatico, variabili d'ambiente, edge network. |
| Curva di apprendimento | Da Vite a Next.js App Router la distanza è bassa — è ancora React. Il file routing è l'unica novità rilevante. |
| Rischio portfolio | Next.js è il framework più riconoscibile nei CV frontend 2024-2025. Vite + React puro è ottimo ma meno segnalante per SSR. |

**Conclusione: usa Next.js 14. Il rischio è zero, il gain in termini di portfolio e funzionalità è massimo.**

---

## Giorno 0 — Infrastruttura (prima di scrivere codice)

Questo giorno non produce codice ma è il più critico. Un setup sbagliato dell'infrastruttura blocca il deploy finale.

### Account da creare — in ordine

| # | Servizio | Azione | Note |
|---|---|---|---|
| 1 | GitHub | Nuovo repo monorepo `lifewrapped/` | Struttura: `/api` (backend) e `/web` (frontend) nella stessa repo |
| 2 | Vercel | Collega repo GitHub | Deploy automatico da branch `main` — scegli `/web` come Root Directory |
| 3 | Railway | Nuovo progetto + plugin PostgreSQL | Railway genera automaticamente `DATABASE_URL` come variabile d'ambiente |
| 4 | Cloudflare | Account free + bucket R2 `lifewrapped-assets` | Genera API token con permessi R2 — serve per upload asset statici |
| 5 | Steam | Registra API key | `steamcommunity.com/dev/apikey` — gratuita, approvazione immediata |

### Variabili d'ambiente — configurare subito

**.NET API — Railway**
```
STEAM_API_KEY=xxxxxxxxxxxxxxxxxxxx
DATABASE_URL=              # Railway lo genera automaticamente
JWT_SECRET=                # genera con: openssl rand -base64 32
ALLOWED_ORIGINS=https://lifewrapped.vercel.app
```

**Next.js — Vercel**
```
NEXT_PUBLIC_API_URL=       # URL Railway dopo il primo deploy del backend
```

---

## Giorni 1–2 — Backend Core (.NET 8)

### Setup progetto

```bash
dotnet new webapi -n LifeWrapped.API
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package CsvHelper
```

### Struttura cartelle

```
LifeWrapped.API/
├── Controllers/
│   ├── UploadController.cs
│   ├── WrappedController.cs
│   └── SteamController.cs
├── Services/
│   ├── AggregatorService.cs
│   ├── WrappedGeneratorService.cs
│   └── SteamService.cs
├── Parsers/
│   ├── IDataParser.cs
│   ├── GoogleActivityParser.cs
│   └── InstagramParser.cs
├── Models/
│   ├── LifeStats.cs
│   ├── WrappedResult.cs
│   └── TemplatePhrase.cs
└── Data/
    └── AppDbContext.cs
```

### Priorità Giorno 1

| Task | Dettaglio |
|---|---|
| `IDataParser` interface | Metodo `Task<LifeStats> ParseAsync(Stream input)` — tutti i parser implementano questa |
| `GoogleActivityParser` | Deserializza `MyActivity.json`, estrae count ricerche, ora di punta (groupby ora), topic top (campo `title`, rimuovi prefisso "Hai cercato "), count YouTube (`titleUrl` contiene `youtube.com`) |
| `InstagramParser` | Legge ZIP in memoria con `ZipArchive` — mai su disco. Conta DM (sender = tu), conta like da `liked_posts.json`, estrae ora e giorno settimana da `timestamp_ms` |
| `UploadController` | Endpoint `POST /api/upload` — accetta `multipart/form-data`, `IFormFile`, processa in memoria, non scrive mai su disco |

### Priorità Giorno 2

| Task | Dettaglio |
|---|---|
| Schema PostgreSQL + EF Core | Migration iniziale con `AppDbContext` — tabelle `wrapped_results` e `global_aggregates` |
| `AppDbContext` | `DbSet` per `WrappedResult` con JSONB per `stats` e `phrases`, array `TEXT[]` per `sources` |
| Test con file reali | Scarica i tuoi dati Google e Instagram per validare i parser prima di procedere — trovare bug ora costa zero |
| CORS | Configurare per `localhost:3000` (dev) e dominio Vercel (prod) — separare con variabile d'ambiente |

---

## Giorno 3 — Parser Rimanenti + Steam

### SpotifyParser

| Aspetto | Implementazione |
|---|---|
| Input | Accetta lista di stream — ci possono essere più file (`StreamingHistory_music_0.json`, `_1.json`, ecc.) — leggere tutti |
| `ms_played` | Somma `ms_played`, skippa tracce sotto 30.000ms per dati puliti (skip track) |
| Artista top | Groupby `master_metadata_album_artist_name` → artista con più `ms_played` totale |
| Stat notturna | Estrai ora da campo `ts` → conta ascolti in fascia 00:00–04:00 come stat ironica |

### NetflixParser

| Aspetto | Implementazione |
|---|---|
| Libreria | CsvHelper (NuGet) per parsing robusto di `ViewingActivity.csv` |
| Colonne usate | `Profile Name`, `Start Time`, `Duration`, `Title` |
| Duration | Parsare formato `HH:MM:SS` → sommare in ore totali |
| Serie top | Pulizia titolo: strip tutto dopo "Season" / "Stagione" / "Episode" → groupby → serie con più entries |
| Picco serale | Estrarre ora da `Start Time` → distribuzione oraria |

### SteamService

| Aspetto | Implementazione |
|---|---|
| Input | Testo libero — può essere vanity URL (`steamcommunity.com/id/nome`) o Steam ID numerico (17 cifre) |
| Resolve vanity | Se input non è numerico: `GET ISteamUser/ResolveVanityURL/v1/?vanityurl={nome}` |
| Dati giochi | `GET IPlayerService/GetOwnedGames/v1/?steamid={id}&include_appinfo=true` → `appid`, `name`, `playtime_forever` (minuti) |
| Elaborazione | Somma `playtime_forever` → ore totali. Ordina per playtime → gioco top. |
| Profilo privato | Restituire errore strutturato `{ error: "PRIVATE_PROFILE", helpUrl: "..." }` con link istruzioni Steam |
| Sicurezza | `STEAM_API_KEY` rimane esclusivamente lato .NET — mai esposta al frontend, mai in risposta API |

---

## Giorno 4 — Logica Business + API Complete

### AggregatorService

- Riceve un dizionario **source → LifeStats** parziali (uno per ogni sorgente caricata dall'utente).
- Fa merge in un unico `LifeStats` con flag per le sorgenti presenti — non assume dati assenti.
- Normalizza correttamente: se l'utente carica solo Spotify, i campi Google/Instagram/Netflix/Steam rimangono **null**, non `0` — la distinzione è semanticamente importante per le frasi ironiche.

### WrappedGeneratorService

Carica le frasi da un file **`phrases.json`** di configurazione — le soglie e i template sono dati, non codice hardcoded. Questo permette di aggiungere frasi senza ricompilare il backend.

**Struttura `phrases.json`:**

```json
[
  {
    "key": "spotify_night_owl",
    "threshold": 500,
    "template": "Hai ascoltato {value} minuti di notte. Stai bene?",
    "source": "spotify",
    "field": "NightMinutes"
  },
  {
    "key": "google_searcher",
    "threshold": 2000,
    "template": "Hai cercato '{topic}' {value} volte. Hai ancora speranza.",
    "source": "google",
    "field": "TotalSearches"
  }
]
```

Il service seleziona le frasi applicabili in base ai dati reali, le ordina per impatto e ne restituisce massimo 6–8.

### Endpoints da completare

| Method | Endpoint | Funzione |
|---|---|---|
| `POST` | `/api/wrapped/save` | Persiste `WrappedResult`, genera token 12 char |
| `GET` | `/api/wrapped/{token}` | Restituisce result pubblico per condivisione |
| `GET` | `/api/stats/global` | Aggregate anonime globali per homepage |

### Token Generation

```csharp
Convert.ToBase64String(RandomNumberGenerator.GetBytes(9))
// → URL-safe, 12 caratteri, 72 bit di entropia
```

---

## Giorni 5–6 — Frontend Next.js 14

### Setup progetto

```bash
npx create-next-app@latest web --typescript --tailwind --app
cd web
npm install framer-motion @vercel/og
```

### Struttura cartelle

```
app/
├── page.tsx                    → landing + upload multi-sorgente
├── result/[token]/
│   ├── page.tsx                → pagina risultato pubblica (SSR)
│   └── opengraph-image.tsx     → OG image dinamica (@vercel/og)
├── components/
│   ├── SourceSelector.tsx      → scelta sorgenti (file o Steam ID)
│   ├── FileUploader.tsx        → drag & drop per ogni sorgente
│   ├── SteamInput.tsx          → input Steam ID con validazione
│   ├── StoryScroll.tsx         → scroll storytelling stile Wrapped
│   ├── StatCard.tsx            → card singola statistica
│   └── ShareButton.tsx         → copia link + Web Share API
└── lib/
    ├── api.ts                  → fetch verso .NET backend
    └── animations.ts           → varianti Framer Motion
```

### Componenti — Giorno 5

| Componente | Responsabilità |
|---|---|
| `SourceSelector.tsx` | Grid di card per ogni piattaforma. Stato selezionato/deselezionato con border accent. Icona piattaforma + hint sul file da caricare. Almeno una sorgente richiesta per procedere. |
| `FileUploader.tsx` | Drag & drop per ogni sorgente selezionata. Validazione estensione client-side (`.json` per Google/Spotify, `.zip` per Instagram, `.csv` per Netflix). Preview nome file caricato. |
| `SteamInput.tsx` | Input con validazione formato — accetta URL profilo Steam o ID numerico (17 cifre). Mostra messaggio specifico per profilo privato con link istruzioni. |
| `api.ts` | `uploadFiles(files: Record<string, File>): Promise<LifeStats>` · `lookupSteam(steamId: string): Promise<SteamStats>` · `saveWrapped(stats: LifeStats): Promise<{token: string}>` · `getWrapped(token: string): Promise<WrappedResult>` |

### Componenti — Giorno 6

| Componente | Responsabilità |
|---|---|
| Loading screen animato | Frasi ironiche che ruotano ogni 1.5s durante fetch. Esempi: "Stiamo giudicando le tue scelte musicali...", "Contando le ore perse su Netflix...", "Calcolando quanto Steam ti ha rubato...". Progress bar indeterminata. |
| `StatCard.tsx` | Card singola con valore numerico grande, label descrittiva, icona sorgente, colore accent per piattaforma (Spotify `#1db954`, Netflix `#e50914`, Steam `#1b2838`, Google `#4285f4`, Instagram gradiente). |

---

## Giorno 7 — StoryScroll + Tema

### StoryScroll.tsx — Il componente centrale del portfolio

Ogni slide occupa `100dvh`. Auto-advance ogni 3 secondi con progress bar visibile. Lo scroll manuale dell'utente sovrascrive l'auto-advance. Framer Motion gestisce le transizioni tra slide.

```typescript
// animations.ts
export const slideVariants = {
  enter: { y: "100%", opacity: 0 },
  center: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: { y: "-100%", opacity: 0, transition: { duration: 0.3 } }
}

export const numberCountUp = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", delay: 0.2 }
  }
}
```

### Tema Dark/Neon — Design System

| Token | Valore | Uso |
|---|---|---|
| Background | `#0a0a0a` | Sfondo globale — nero quasi puro |
| Accent primario | `#a855f7` | Viola — neutro rispetto alle piattaforme, usato per UI chrome |
| Spotify | `#1db954` | Accent per card e slide Spotify |
| Netflix | `#e50914` | Accent per card e slide Netflix |
| Steam | `#1b2838` | Accent per card e slide Steam (navy scuro) |
| Google | `#4285f4` | Accent per card e slide Google |
| Instagram | gradiente `#f09433→#bc1888` | Accent per card e slide Instagram |
| Font display | Inter 800, size 5xl+ | Numeri grandi nelle slide — devono dominare la schermata |
| Mobile viewport | `100dvh` invece di `100vh` | Evita bug iOS Safari con la barra degli indirizzi dinamica |

---

## Giorno 8 — Share + OG Image

### ShareButton.tsx

- Prova Web Share API (`navigator.share`) — funziona su mobile e mostra il foglio nativo di condivisione iOS/Android.
- Fallback su desktop: copia URL negli appunti con `navigator.clipboard.writeText`.
- Feedback visivo: testo "Copiato!" con icona checkmark animata per 2 secondi, poi ritorno allo stato normale.

### Pagina pubblica — `app/result/[token]/page.tsx`

La pagina è SSR: i dati vengono fetchati lato server per garantire che i meta tag OG siano presenti nell'HTML iniziale (richiesto da crawler social come Twitter, WhatsApp, iMessage).

```typescript
export async function generateMetadata({ params }) {
  const result = await getWrapped(params.token)
  return {
    title: "Il mio LifeWrapped 2026",
    openGraph: {
      title: "Il mio LifeWrapped 2026",
      images: [`/result/${params.token}/opengraph-image`]
    }
  }
}
```

### OG Image — `app/result/[token]/opengraph-image.tsx`

| Aspetto | Dettaglio |
|---|---|
| Dimensioni | 1200×630 px — standard OpenGraph per Twitter/LinkedIn/WhatsApp |
| Contenuto | 3 stat principali — quelle con i valori più alti o le frasi più ironiche |
| Libreria | `@vercel/og` con font Inter incluso — generazione server-side, zero JS client |
| Design | Background `#0a0a0a`, accent viola, testo bianco — riconoscibile nel feed social |
| Performance | Generata on-demand e cachata da Vercel CDN — zero costo su revisit |

---

## Giorno 9 — Deploy Production

### Railway — Backend .NET

**Dockerfile (nella root di `/api`)**

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "LifeWrapped.API.dll"]
```

**Rate Limiting — aggiungere in `Program.cs`**

```csharp
builder.Services.AddRateLimiter(options => {
  options.AddFixedWindowLimiter("upload", o => {
    o.PermitLimit = 10;
    o.Window = TimeSpan.FromMinutes(1);
    o.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
  });
});

// Sul controller:
[EnableRateLimiting("upload")]
public class UploadController : ControllerBase { }
```

Aggiungere anche un endpoint `GET /health` che restituisce `200 OK` — Railway lo usa per health check e routing.

### Vercel — Frontend Next.js

- Collega repo GitHub su vercel.com → New Project → seleziona `/web` come Root Directory.
- Imposta `NEXT_PUBLIC_API_URL` con l'URL Railway dopo il primo deploy del backend.
- Testa `opengraph-image.tsx` localmente con `vercel dev` prima del deploy — la generazione OG ha comportamenti leggermente diversi in locale vs edge.
- Verifica che il dominio Vercel sia in `ALLOWED_ORIGINS` sul backend Railway.

### CORS Production

```csharp
builder.Services.AddCors(options => {
  options.AddPolicy("Production", policy => {
    policy
      .WithOrigins(builder.Configuration["ALLOWED_ORIGINS"]!)
      .WithMethods("GET", "POST")
      .WithHeaders("Content-Type", "Authorization");
  });
});
```

---

## Giorno 10 — Polish + Portfolio-Ready

| Task | Dettaglio |
|---|---|
| Test parser con file reali | Upload file reali su tutti e 5 i parser in ambiente production — trovare edge case su file reali che i test sintetici non coprono. |
| README tecnico GitHub | Includere: architettura con diagramma, screenshot del flow completo, link live demo, spiegazione privacy by design, tech stack con badge. |
| Global stats homepage | Sezione in fondo alla landing: "X LifeWrapped generati, Y ore di Netflix processate, Z minuti Spotify analizzati" — aggiornata da `/api/stats/global`. |
| `100dvh` fix iOS Safari | StoryScroll usa `100dvh` invece di `100vh` — su iOS Safari la barra degli indirizzi dinamica causa jump di layout con `100vh`. |
| Lighthouse score | Target: 90+ Performance. Il principale rischio è il caricamento della OG image — assicurarsi che sia cachata correttamente da Vercel CDN. |
| Video demo per portfolio | Registrare screen recording del flow completo: upload → loading ironico → StoryScroll reveal → pagina share. Convertire in GIF o video MP4 per la hero del README GitHub. |

---

## Dipendenze e Requisiti Completi

### Backend — .NET NuGet

| Pacchetto | Tipo | Uso |
|---|---|---|
| CsvHelper | NuGet | Parsing `ViewingActivity.csv` di Netflix — gestisce quoting, escape, encoding in modo robusto |
| `System.IO.Compression` | Built-in | Lettura ZIP Instagram in memoria con `ZipArchive` — zero scrittura su disco |
| `System.Text.Json` | Built-in | Deserializzazione JSON Google, Instagram, Spotify — preferibile a Newtonsoft per performance |
| `HttpClient` | Built-in | Chiamate Steam Web API dal backend — iniettato via `IHttpClientFactory` |
| Npgsql / EF Core | NuGet | ORM per PostgreSQL — supporto nativo JSONB, array `TEXT[]`, UUID |

### Frontend — npm

| Pacchetto | Versione | Uso |
|---|---|---|
| `framer-motion` | latest | Animazioni StoryScroll (slide transitions), StatCard reveal, contatore numerico spring |
| `@vercel/og` | latest | Generazione OG image dinamica server-side — usa Edge Runtime di Vercel |
| `sharp` | peer dep | Richiesto da `@vercel/og` per image processing — si installa automaticamente |

---

## Schema PostgreSQL Completo

```sql
CREATE TABLE wrapped_results (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token       VARCHAR(12) UNIQUE NOT NULL,
  stats       JSONB NOT NULL,
  phrases     JSONB NOT NULL,
  sources     TEXT[],
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE global_aggregates (
  stat_key    VARCHAR(100),
  total       BIGINT,
  count       INT,
  updated_at  TIMESTAMP
);

CREATE INDEX idx_wrapped_token ON wrapped_results(token);
CREATE INDEX idx_wrapped_created ON wrapped_results(created_at DESC);
```

### Frasi Ironiche — Soglie di Riferimento

| Sorgente | Condizione | Frase generata |
|---|---|---|
| Google | `TotalSearches > 2000` | "Hai cercato 'come fare la pasta' 47 volte. Hai ancora speranza." |
| Spotify | `MinutesListened > 30000` | "Hai ascoltato 38.000 minuti di musica. Stai bene?" |
| Netflix | `HoursWatched > 200` | "Netflix ti ha rubato 312 ore. Quanti film avresti potuto vedere al cinema?" |
| Steam | `TopGameHours > 500` | "Steam dice che hai 847 ore su un gioco. Hai una famiglia?" |

---

## Privacy by Design — Decisioni Architetturali

Queste scelte vanno comunicate come feature di design nel portfolio, non come semplificazioni tecniche.

| Principio | Implementazione concreta |
|---|---|
| File mai salvati su disco | Il backend riceve i file via `IFormFile`, li processa in memoria con `Stream`, li scarta. Nessun file system touch. |
| Nessun dato grezzo nel DB | PostgreSQL contiene solo l'oggetto `LifeStats` (numeri aggregati) + token anonimo. Zero dati personali grezzi. |
| Token anonimo | Il token di 12 caratteri non è derivato da nessun dato utente — è completamente random. Nessuna correlazione possibile. |
| Steam ID pubblica | La Steam ID è pubblica per design di Steam — nessun dato sensibile transita. L'unico segreto è la API key, che resta server-side. |
| Schema DB minimal | `wrapped_results`: id, token, stats (JSONB), phrases (JSONB), sources (TEXT[]), created_at. Zero PII. |
| Nessuna autenticazione | Non c'è login, non c'è account, non c'è profilazione utente. Ogni sessione è completamente anonima. |

---

## Prompt per Mockup UI

### v0.dev (consigliato — restituisce codice React funzionante)

```
Create a dark-themed web app UI called "LifeWrapped" — a Spotify Wrapped-style yearly digital life recap.

Design system:
- Background: #0a0a0a
- Primary accent: #a855f7 (purple)
- Platform colors: Spotify #1db954, Netflix #e50914, Steam #1b2838, Google #4285f4, Instagram gradient #f09433→#e6683c→#dc2743→#cc2366→#bc1888
- Font: Inter. Large display numbers (5xl+) for stats. Clean, minimal UI.
- Style: dark neon, generous whitespace, no borders — use subtle glow effects instead

Screens to design (as separate sections in one page):

1. LANDING / UPLOAD SCREEN
- Hero: "Il tuo anno in dati" headline + subtitle "Come Spotify Wrapped, ma per tutta la tua vita digitale"
- Platform selector: 5 cards in a grid (Google, Instagram, Spotify, Netflix, Steam). Each card has platform icon, name, file format hint. Selected state: glowing accent border.
- For Steam: text input instead of file upload. For others: drag & drop zone.
- CTA button: "Genera il mio LifeWrapped →"

2. STORY SCROLL SLIDE (full viewport)
- One stat per slide, full screen
- Example slide: giant number "38.421" centered, label below "minuti ascoltati su Spotify", Spotify green accent, ironic phrase at bottom: "Hai ascoltato 38.000 minuti di musica. Stai bene?"
- Progress bar at top showing slide 3/7
- Subtle "scroll or wait" hint

3. FINAL RECAP SCREEN
- Grid of StatCards (2 col mobile, 3 col desktop)
- Each card: platform color accent left border, stat value large, label, ironic phrase small
- Bottom: large "Condividi il tuo LifeWrapped" button with share icon

4. PUBLIC SHARE PAGE (/result/token)
- Same dark theme, read-only version of recap
- "Genera il tuo →" CTA prominent at bottom
- OG preview card visible: 1200x630 dark card with top 3 stats

All screens mobile-first. Use Tailwind classes. Make it feel premium and slightly ironic — like if Spotify Wrapped had a sarcastic Italian cousin.
```

### Midjourney / DALL-E (visual reference only)

```
Dark web app UI design, Spotify Wrapped aesthetic, Italian digital life recap app called LifeWrapped. Full screen story slide showing giant statistic number "38.421" centered on near-black background #0a0a0a, purple glow accent #a855f7, Spotify green highlight, Inter font, minimalist neon dark theme, mobile screen mockup, premium feel, slightly ironic tone --ar 9:16 --style raw
```

---

## Note Finali — Portfolio Strategy

| Consiglio | Dettaglio |
|---|---|
| Video demo per GitHub README | Registra uno screen recording del flow completo: upload → loading ironico → StoryScroll reveal → pagina share. Converti in GIF o video MP4 e mettilo come hero del README. È quello che cattura chi guarda il portfolio prima ancora di leggere. |
| Sezione "Cosa dimostra" | Il README deve includere esplicitamente una sezione Skills/Evidenze — recruiter tecnici apprezzano la meta-consapevolezza del candidato sulle proprie skill. |
| Link demo live obbligatorio | Senza demo live il portfolio project perde il 70% del suo impatto. Vercel free tier è sufficiente — mantienilo attivo. |
| Privacy by design come selling point | Nella descrizione del progetto, evidenzia la scelta architetturale di non salvare dati grezzi come decisione consapevole, non come semplificazione tecnica. |
| Global stats come social proof | La homepage con "X wrapped generati" crea social proof anche con numeri bassi — dimostra che il sistema è in produzione e usato. |
