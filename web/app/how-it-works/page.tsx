import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo-lifewrap.svg";

export const metadata: Metadata = {
  title: "Come Funziona | LifeWrapped",
  description:
    "Scopri come LifeWrapped analizza i tuoi dati digitali da Google, Instagram, Spotify, Netflix e Steam per generare il tuo anno in cifre.",
};

export default function HowItWorksPage() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
      />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="LifeWrapped" priority className="h-10 w-auto" />
        </Link>
        <Link
          href="/"
          className="bg-[#c284ff] text-black px-4 py-1.5 rounded-lg font-bold text-sm hover:scale-95 transition-transform"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Inizia ora
        </Link>
      </header>

      <main className="pt-28 pb-32 px-6 max-w-3xl mx-auto min-h-screen">

        {/* Hero */}
        <div className="mb-16">
          <p
            className="text-[#cc97ff] uppercase tracking-widest text-xs mb-4"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Guida al servizio
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold tracking-tighter leading-none mb-6"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Come funziona
            <br />
            <span className="text-[#cc97ff]">LifeWrapped.</span>
          </h1>
          <p className="text-neutral-500 text-sm leading-relaxed max-w-xl" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            In sei passaggi, dai tuoi file di esportazione alle statistiche finali.
            Nessuna registrazione. Nessun dato salvato sul disco. Solo i tuoi numeri.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12 text-neutral-300" style={{ fontFamily: "Inter, sans-serif" }}>

          {/* 1 */}
          <Step label="1." title="Scegli le piattaforme">
            <p>
              Dalla home, seleziona una o più piattaforme tra quelle supportate. Puoi combinare più sorgenti
              nella stessa sessione: LifeWrapped fonde automaticamente i dati e produce un unico wrapped aggregato.
            </p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLATFORMS.map(({ name, color, badge, description }) => (
                <div key={name} className="bg-[#131313] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full border" style={{ color, borderColor: color + "40", backgroundColor: color + "12" }}>
                      {badge}
                    </span>
                    <span className="text-white text-sm font-semibold">{name}</span>
                  </div>
                  <p className="text-neutral-500 text-xs leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </Step>

          {/* 2 */}
          <Step label="2." title="Esporta i tuoi dati dalla piattaforma">
            <p className="mb-5">
              Ogni piattaforma ti permette di scaricare una copia dei tuoi dati personali.
              Il processo richiede in genere da qualche minuto a qualche ora. Segui le istruzioni qui sotto
              per ciascuna piattaforma che hai selezionato.
            </p>

            <ExportGuide
              platform="Google"
              color="#4285F4"
              steps={[
                "Vai su takeout.google.com e accedi con il tuo account.",
                "Clicca \"Deseleziona tutto\", poi seleziona solo \"Cronologia delle ricerche\" e \"YouTube e YouTube Music\" (Cronologia visualizzazioni).",
                "Scegli il formato ZIP e la dimensione massima del file, poi clicca \"Crea esportazione\".",
                "Scarica l'archivio quando è pronto. Il file che ti serve è il JSON dentro la cartella Cronologia delle ricerche.",
              ]}
            />

            <ExportGuide
              platform="Instagram"
              color="#E1306C"
              steps={[
                "Apri Instagram sul telefono, vai su Impostazioni → Attività → Scarica le informazioni.",
                "Seleziona \"Alcune informazioni\" e spunta: Messaggi, Mi piace, Storia.",
                "Scegli il formato JSON e un intervallo di date (es. Ultimo anno).",
                "Riceverai una notifica quando il file è pronto da scaricare.",
              ]}
            />

            <ExportGuide
              platform="Spotify"
              color="#1DB954"
              steps={[
                "Vai su spotify.com/account/privacy e accedi.",
                "Scorri fino a \"Privacy dei dati\" e clicca \"Richiedi\", poi seleziona \"Cronologia delle riproduzioni estesa\".",
                "Spotify invierà i dati entro 30 giorni via email (di solito molto prima).",
                "Scarica il file ZIP e carica tutti i file endsong_*.json che contiene.",
              ]}
            />

            <ExportGuide
              platform="Netflix"
              color="#E50914"
              steps={[
                "Accedi a Netflix.com, clicca sul tuo profilo in alto a destra → Account.",
                "Nella sezione \"Profilo e controllo parentale\", seleziona il tuo profilo.",
                "Clicca su \"Scarica tutti\" accanto a \"Cronologia di visione\".",
                "Scarica il file CSV che viene generato immediatamente.",
              ]}
            />

            <ExportGuide
              platform="Steam"
              color="#1b2838"
              steps={[
                "Per Steam non serve alcun file: basta il tuo Steam ID o il tuo URL personalizzato (es. steamcommunity.com/id/tuonome).",
                "Il tuo profilo Steam deve essere impostato su Pubblico per permettere la lettura dei dati.",
                "Puoi verificare la visibilità in Steam → Profilo → Modifica profilo → Impostazioni privacy.",
              ]}
            />
          </Step>

          {/* 3 */}
          <Step label="3." title="Carica su LifeWrapped">
            <p>
              Torna su LifeWrapped e trascina (o seleziona) i file nella rispettiva sezione di upload.
              Per Steam, incolla semplicemente il tuo Steam ID nel campo apposito.
            </p>
            <p className="mt-3">
              Una volta caricati tutti i file, clicca{" "}
              <strong className="text-white">Genera il mio LifeWrapped</strong>. Il sistema invierà i dati
              al server tramite connessione{" "}
              <strong className="text-white">HTTPS cifrata</strong>.
            </p>
            <div className="mt-5 pl-4 border-l border-[#cc97ff]/30">
              <p className="text-white font-semibold text-sm mb-2">Formati supportati</p>
              <div className="text-sm leading-relaxed text-neutral-400 space-y-1">
                <p><span className="text-neutral-300 font-mono text-xs">.json</span> — Google, Instagram, Spotify</p>
                <p><span className="text-neutral-300 font-mono text-xs">.csv</span> — Netflix</p>
                <p><span className="text-neutral-300 font-mono text-xs">Steam ID / URL</span> — inserito manualmente nel campo testo</p>
              </div>
            </div>
          </Step>

          {/* 4 */}
          <Step label="4." title="Elaborazione istantanea in memoria">
            <p>
              Il tuo file non viene mai scritto su disco. Il server carica il contenuto direttamente in{" "}
              <strong className="text-white">RAM</strong>, estrae le statistiche rilevanti e poi scarta
              il tutto. Nessuna copia rimane dopo l&apos;elaborazione.
            </p>
            <p className="mt-3">
              Da ogni file viene estratto un insieme ridotto di metriche aggregate anonime — mai il
              contenuto testuale grezzo (messaggi, ricerche specifiche, URL).
            </p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STATS_EXTRACTED.map(({ platform, color, stats }) => (
                <div key={platform} className="bg-[#131313] rounded-xl p-4 border border-white/5">
                  <p className="text-sm font-semibold mb-2" style={{ color }}>{platform}</p>
                  <ul className="space-y-1">
                    {stats.map((s) => (
                      <li key={s} className="text-neutral-500 text-xs flex items-start gap-2">
                        <span className="text-[#cc97ff]/60 mt-0.5 shrink-0">—</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Step>

          {/* 5 */}
          <Step label="5." title="Scopri il tuo anno">
            <p>
              Completata l&apos;analisi, LifeWrapped ti guida attraverso una sequenza di{" "}
              <strong className="text-white">card animate</strong> che rivelano una statistica alla volta,
              con frasi generate appositamente per il tuo profilo digitale.
            </p>
            <p className="mt-3">
              Al termine dello scroll narrativo trovi il <strong className="text-white">riepilogo finale</strong>:
              tutte le statistiche in un&apos;unica schermata, organizzate per piattaforma.
            </p>
            <div className="mt-5 bg-[#131313] rounded-xl border border-white/5 overflow-hidden">
              <div className="border-b border-white/5 px-5 py-3">
                <p className="text-white text-xs font-semibold uppercase tracking-wider">Struttura della sessione</p>
              </div>
              <div className="divide-y divide-white/5">
                {SESSION_FLOW.map(({ step, label, desc }) => (
                  <div key={step} className="px-5 py-3 flex items-start gap-4">
                    <span className="text-[#cc97ff] font-mono text-xs shrink-0 mt-0.5">{step}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{label}</p>
                      <p className="text-neutral-500 text-xs mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Step>

          {/* 6 */}
          <Step label="6." title="Salva e condividi (opzionale)">
            <p>
              Se vuoi conservare il tuo wrapped o condividerlo, LifeWrapped genera un{" "}
              <strong className="text-white">token anonimo di 12 caratteri</strong> (es.{" "}
              <code className="bg-[#1a1a1a] px-1 rounded text-xs">aB3kR9mXz1Qw</code>
              ) e salva le sole statistiche aggregate nel database. Nessun dato identificativo
              (email, IP, account) viene mai associato al token.
            </p>
            <p className="mt-3">
              Chiunque abbia il link può visualizzare i risultati. La condivisione è sempre una
              scelta volontaria: se non clicchi il pulsante Salva, nulla viene memorizzato.
            </p>
            <div className="mt-5 pl-4 border-l border-[#cc97ff]/30">
              <p className="text-white font-semibold text-sm mb-2">Conservazione dei dati salvati</p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                I wrapped salvati vengono conservati per un massimo di{" "}
                <strong className="text-white">24 mesi</strong> dall&apos;ultima generazione,
                poi eliminati automaticamente. Puoi richiedere la cancellazione anticipata
                scrivendo a{" "}
                <a href="mailto:privacy@lifewrapped.app" className="text-[#cc97ff] hover:underline">
                  privacy@lifewrapped.app
                </a>{" "}
                indicando il tuo token.
              </p>
            </div>
          </Step>

          {/* FAQ */}
          <section className="scroll-mt-28 pt-4">
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-[#cc97ff] text-xs font-mono">—</span>
              <h2
                className="text-2xl font-bold tracking-tight text-white"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Domande frequenti
              </h2>
            </div>
            <div className="space-y-4">
              {FAQS.map(({ q, a }) => (
                <div key={q} className="bg-[#131313] rounded-xl p-5 border border-white/5">
                  <p className="text-white font-semibold text-sm mb-2">{q}</p>
                  <p className="text-neutral-500 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] w-full py-12 px-6 mt-16 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-3xl mx-auto text-[10px] uppercase tracking-[0.2em]">
          <div className="text-white font-bold">LifeWrapped</div>
          <div className="text-neutral-600">© 2025 LifeWrapped — Tutti i diritti riservati</div>
          <div className="flex gap-8 text-neutral-600">
            <Link href="/how-it-works" className="text-[#cc97ff]">Come funziona</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
          </div>
        </div>
      </footer>

      {/* Background decoration */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#cc97ff]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </>
  );
}

/* ── Helper components ── */

function Step({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-28">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="text-[#cc97ff] text-xs font-mono">{label}</span>
        <h2
          className="text-2xl font-bold tracking-tight text-white"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {title}
        </h2>
      </div>
      <div className="text-sm leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

function ExportGuide({
  platform,
  color,
  steps,
}: {
  platform: string;
  color: string;
  steps: string[];
}) {
  return (
    <div className="mt-4 pl-4 border-l border-white/10">
      <p className="font-semibold text-sm mb-3" style={{ color }}>{platform}</p>
      <ol className="space-y-2">
        {steps.map((s, i) => (
          <li key={i} className="text-neutral-400 text-sm flex gap-3">
            <span className="text-neutral-600 font-mono text-xs shrink-0 mt-0.5">{i + 1}.</span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── Static data ── */

const PLATFORMS = [
  {
    name: "Google",
    badge: "Google",
    color: "#4285F4",
    description: "Ricerche effettuate, ora di picco attività, argomenti più cercati e visualizzazioni su YouTube.",
  },
  {
    name: "Instagram",
    badge: "Instagram",
    color: "#E1306C",
    description: "DM inviati, like dati, storie pubblicate, orario di picco e utenti più frequentati nelle chat.",
  },
  {
    name: "Spotify",
    badge: "Spotify",
    color: "#1DB954",
    description: "Ore totali di ascolto, artista preferito, brani più ascoltati e ascolti in orario notturno.",
  },
  {
    name: "Netflix",
    badge: "Netflix",
    color: "#E50914",
    description: "Ore di visione totali, serie più guardата, ora di picco e giorni di binge watching.",
  },
  {
    name: "Steam",
    badge: "Steam",
    color: "#66c0f4",
    description: "Ore totali di gioco, gioco più giocato e numero di titoli nella libreria. Richiede profilo pubblico.",
  },
];

const STATS_EXTRACTED = [
  {
    platform: "Google",
    color: "#4285F4",
    stats: [
      "Numero totale ricerche",
      "Ora di picco attività",
      "Argomento più cercato",
      "Visualizzazioni YouTube",
    ],
  },
  {
    platform: "Instagram",
    color: "#E1306C",
    stats: [
      "DM inviati",
      "Like totali dati",
      "Storie pubblicate",
      "Ora e giorno di picco",
      "Top 10 utenti citati nelle chat",
    ],
  },
  {
    platform: "Spotify",
    color: "#1DB954",
    stats: [
      "Millisecondi totali ascoltati",
      "Artista più ascoltato",
      "Percentuale ascolti notturni",
    ],
  },
  {
    platform: "Netflix",
    color: "#E50914",
    stats: [
      "Ore totali di visione",
      "Titolo più guardato",
      "Ora di picco visione",
    ],
  },
  {
    platform: "Steam",
    color: "#66c0f4",
    stats: [
      "Ore totali di gioco",
      "Gioco con più ore",
      "Numero titoli in libreria",
    ],
  },
];

const SESSION_FLOW = [
  {
    step: "01",
    label: "Caricamento",
    desc: "I file vengono inviati al server via HTTPS. Nessun dato tocca mai il disco.",
  },
  {
    step: "02",
    label: "Analisi",
    desc: "Il server elabora i file in RAM ed estrae le metriche aggregate per ciascuna piattaforma.",
  },
  {
    step: "03",
    label: "Story scroll",
    desc: "Navighi tra una serie di card animate, una statistica alla volta, con frasi generate sul tuo profilo.",
  },
  {
    step: "04",
    label: "Riepilogo finale",
    desc: "Tutte le statistiche in un'unica schermata, suddivise per piattaforma, pronte per lo screenshot.",
  },
  {
    step: "05",
    label: "Salvataggio (opz.)",
    desc: "Se lo desideri, clicca Salva per ottenere un link condivisibile con token anonimo.",
  },
];

const FAQS = [
  {
    q: "I miei file vengono letti da qualcuno?",
    a: "No. I file vengono processati automaticamente dal server senza alcuna revisione manuale. Vengono eliminati dalla memoria al termine dell'elaborazione.",
  },
  {
    q: "Posso usare LifeWrapped senza creare un account?",
    a: "Sì. LifeWrapped non richiede registrazione, email o password. Funziona completamente in anonimo.",
  },
  {
    q: "Cosa succede se non salvo il wrapped?",
    a: "Se non clicchi il pulsante Salva, nessun dato viene conservato nel database. La sessione termina e i dati vengono scartati.",
  },
  {
    q: "Posso usare più piattaforme insieme?",
    a: "Sì. Puoi selezionare tutte le piattaforme che vuoi nella stessa sessione. I dati vengono fusi in un unico wrapped aggregato.",
  },
  {
    q: "Il profilo Steam deve essere pubblico?",
    a: "Sì. La funzione Steam usa le API pubbliche di Valve. Se il tuo profilo è privato, il sistema restituirà un errore e ti chiederà di renderlo pubblico.",
  },
  {
    q: "Come posso cancellare il mio wrapped salvato?",
    a: "Scrivi a privacy@lifewrapped.app indicando il token del tuo wrapped (visibile nel link di condivisione). Cancelleremo i dati entro 30 giorni.",
  },
];
