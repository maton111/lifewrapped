import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo-lifewrap.svg";

export const metadata: Metadata = {
  title: "Privacy Policy & Cookie Policy | LifeWrapped",
  description:
    "Informativa sulla privacy, trattamento dei dati personali e cookie policy di LifeWrapped, ai sensi del GDPR (Reg. UE 2016/679).",
};

const LAST_UPDATED = "11 aprile 2025";

export default function PrivacyPage() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
      />

      {/* TopBar */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="LifeWrapped" priority className="h-10 w-auto" />
        </Link>
        <Link
          href="/"
          className="bg-[#c284ff] text-black px-4 py-1.5 rounded-lg font-bold text-sm hover:scale-95 transition-transform"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Torna alla Home
        </Link>
      </header>

      <main className="pt-28 pb-32 px-6 max-w-3xl mx-auto min-h-screen">
        {/* Hero */}
        <div className="mb-16">
          <p
            className="text-[#cc97ff] uppercase tracking-widest text-xs mb-4"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Documento legale
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold tracking-tighter leading-none mb-6"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Privacy &amp;
            <br />
            <span className="text-[#cc97ff]">Cookie Policy</span>
          </h1>
          <p className="text-neutral-500 text-sm" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Ai sensi del Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018.
            <br />
            Ultimo aggiornamento: <span className="text-neutral-300">{LAST_UPDATED}</span>
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-neutral-300" style={{ fontFamily: "Inter, sans-serif" }}>

          {/* 1. Titolare */}
          <Section id="titolare" label="1." title="Titolare del Trattamento">
            <p>
              Il titolare del trattamento dei dati personali è il team di sviluppo di <strong className="text-white">LifeWrapped</strong>.
            </p>
            <p className="mt-3">
              Per qualsiasi richiesta relativa alla presente informativa o al trattamento dei tuoi dati, puoi contattarci all&apos;indirizzo e-mail:{" "}
              <a
                href="mailto:privacy@lifewrapped.app"
                className="text-[#cc97ff] hover:underline"
              >
                privacy@lifewrapped.app
              </a>
            </p>
          </Section>

          {/* 2. Dati trattati */}
          <Section id="dati-trattati" label="2." title="Dati Personali Trattati">
            <p className="mb-4">
              LifeWrapped è progettato con una filosofia <strong className="text-white">privacy-first</strong>. Non richiediamo registrazione, non conserviamo dati identificativi personali (nome, e-mail, telefono) e non utilizziamo sistemi di autenticazione.
            </p>
            <p className="mb-4">Di seguito i dati trattati in dettaglio:</p>

            <SubSection title="A) File caricati dall'utente (elaborazione esclusivamente in memoria)">
              <p>
                Quando carichi i tuoi file di esportazione da Google, Instagram, Spotify o Netflix, questi vengono trasmessi al nostro server tramite connessione HTTPS cifrata e <strong className="text-white">processati interamente in memoria RAM</strong>. I file originali non vengono mai scritti su disco, non vengono conservati dopo l&apos;elaborazione e non vengono ceduti a terzi.
              </p>
              <p className="mt-3">I dati <em>statistici</em> estratti dai file includono, a seconda della piattaforma selezionata:</p>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li><strong className="text-white">Google:</strong> numero totale di ricerche, ora di picco, argomento di ricerca più frequente, numero di visualizzazioni YouTube</li>
                <li><strong className="text-white">Instagram:</strong> numero di DM inviati, like dati, storie pubblicate, repost, ora e giorno di picco attività, lista (fino a 10) degli utenti più citati nelle conversazioni</li>
                <li><strong className="text-white">Spotify:</strong> millisecondi totali ascoltati, artista preferito, ascolti notturni</li>
                <li><strong className="text-white">Netflix:</strong> ore totali di visione, serie più guardata, ora di picco visione</li>
              </ul>
              <p className="mt-3 text-neutral-500 text-sm">
                Questi dati statistici derivati <em>non</em> contengono il contenuto testuale dei messaggi, le ricerche specifiche, le URL visualizzate o qualsiasi altro dato grezzo originale.
              </p>
            </SubSection>

            <SubSection title="B) Dati Steam (tramite API pubblica)">
              <p>
                Se utilizzi la funzione Steam, il sistema effettua una chiamata alle API pubbliche di Valve Corporation (<em>Steam Web API</em>) tramite il tuo Steam ID o vanity URL. Valve acquisisce i dati della richiesta nei propri sistemi secondo la propria{" "}
                <a
                  href="https://store.steampowered.com/privacy_agreement/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#cc97ff] hover:underline"
                >
                  Privacy Policy
                </a>
                . I dati restituiti (ore di gioco, libreria posseduta) vengono processati esattamente come quelli dei file caricati.
              </p>
            </SubSection>

            <SubSection title="C) Risultati Wrapped salvati (token anonimo)">
              <p>
                Quando scegli di salvare e condividere il tuo LifeWrapped, il sistema genera un{" "}
                <strong className="text-white">token univoco anonimo di 12 caratteri</strong> (es.{" "}
                <code className="bg-[#1a1a1a] px-1 rounded text-xs">aB3kR9mXz1Qw</code>
                ). Il token viene memorizzato nel nostro database PostgreSQL insieme ai soli dati statistici aggregati e alle frasi generate. <strong className="text-white">Non è associato ad alcun dato identificativo personale</strong> (nessuna email, nessun IP registrato stabilmente, nessun account utente).
              </p>
              <p className="mt-3">
                Chiunque sia in possesso del link contenente il token può visualizzare i risultati salvati. La condivisione del link è una scelta volontaria dell&apos;utente.
              </p>
            </SubSection>

            <SubSection title="D) Statistiche aggregate globali">
              <p>
                Ogni volta che viene generato un LifeWrapped, il sistema aggiorna contatori aggregati anonimi (es. numero totale di wrapped generati, ore totali Netflix di tutti gli utenti, minuti totali Spotify). Questi dati sono puramente statistici, non riferibili a singoli individui e vengono utilizzati per la pagina pubblica di statistiche globali del servizio.
              </p>
            </SubSection>

            <SubSection title="E) Dati tecnici di connessione (log di sistema)">
              <p>
                Come qualsiasi servizio web, il nostro server e l&apos;infrastruttura di hosting (Vercel, Railway) possono conservare <strong className="text-white">log tecnici</strong> contenenti indirizzi IP, timestamp, URL richiesti e user-agent. Questi dati sono trattati dagli stessi fornitori di infrastruttura secondo le loro policy (vedi sezione 7) e non vengono mai incrociati con i dati statistici del wrapped.
              </p>
            </SubSection>
          </Section>

          {/* 3. Finalità e base giuridica */}
          <Section id="finalita" label="3." title="Finalità e Base Giuridica del Trattamento">
            <div className="space-y-4">
              <FinalitaRow
                finalita="Elaborare i file e generare le statistiche wrapped"
                base="Esecuzione di un contratto / servizio richiesto dall'utente (art. 6(1)(b) GDPR)"
              />
              <FinalitaRow
                finalita="Salvare e rendere accessibile il wrapped tramite token condivisibile"
                base="Consenso esplicito dell'utente all'atto del salvataggio (art. 6(1)(a) GDPR)"
              />
              <FinalitaRow
                finalita="Aggiornare le statistiche aggregate anonime globali"
                base="Legittimo interesse del titolare (art. 6(1)(f) GDPR) — i dati sono irriferibili a singoli individui"
              />
              <FinalitaRow
                finalita="Prevenire abusi e garantire la sicurezza del servizio (rate limiting)"
                base="Legittimo interesse del titolare (art. 6(1)(f) GDPR)"
              />
              <FinalitaRow
                finalita="Adempimento a obblighi legali"
                base="Obbligo legale (art. 6(1)(c) GDPR)"
              />
            </div>
          </Section>

          {/* 4. Conservazione */}
          <Section id="conservazione" label="4." title="Periodo di Conservazione dei Dati">
            <ul className="space-y-3">
              <li>
                <span className="text-white font-medium">File caricati:</span>{" "}
                non vengono conservati. Vengono eliminati dalla memoria al termine dell&apos;elaborazione della richiesta HTTP.
              </li>
              <li>
                <span className="text-white font-medium">Risultati wrapped (token):</span>{" "}
                conservati nel database fino a eventuale richiesta di cancellazione da parte dell&apos;utente, oppure per un massimo di <strong className="text-white">24 mesi</strong> dall&apos;ultima generazione, al termine dei quali vengono eliminati automaticamente.
              </li>
              <li>
                <span className="text-white font-medium">Statistiche aggregate globali:</span>{" "}
                conservate a tempo indeterminato in quanto irriferibili a individui specifici.
              </li>
              <li>
                <span className="text-white font-medium">Log tecnici di sistema:</span>{" "}
                gestiti da Vercel e Railway secondo le rispettive policy, generalmente conservati per un periodo non superiore a 30-90 giorni.
              </li>
            </ul>
          </Section>

          {/* 5. Diritti GDPR */}
          <Section id="diritti" label="5." title="Diritti dell'Interessato">
            <p className="mb-4">
              In qualità di interessato, hai il diritto di esercitare in qualsiasi momento i seguenti diritti ai sensi degli artt. 15-22 del GDPR:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: "📄", nome: "Accesso (art. 15)", desc: "Ottenere conferma se dati che ti riguardano sono trattati e riceverne copia." },
                { icon: "✏️", nome: "Rettifica (art. 16)", desc: "Richiedere la correzione di dati inesatti o incompleti." },
                { icon: "🗑️", nome: "Cancellazione (art. 17)", desc: "Richiedere la rimozione del tuo wrapped tramite il token condivisibile." },
                { icon: "⏸️", nome: "Limitazione (art. 18)", desc: "Richiedere la limitazione del trattamento in determinati casi previsti dalla legge." },
                { icon: "📦", nome: "Portabilità (art. 20)", desc: "Ricevere i dati in formato strutturato e leggibile da macchina." },
                { icon: "🚫", nome: "Opposizione (art. 21)", desc: "Opporti al trattamento basato su legittimo interesse." },
                { icon: "↩️", nome: "Revoca del consenso", desc: "Revocare in qualsiasi momento il consenso prestato, senza pregiudicare la liceità del trattamento precedente." },
                { icon: "⚖️", nome: "Reclamo al Garante", desc: "Proporre reclamo all'Autorità Garante per la Protezione dei Dati Personali (www.garanteprivacy.it)." },
              ].map(({ icon, nome, desc }) => (
                <div key={nome} className="bg-[#131313] rounded-xl p-4 border border-white/5">
                  <div className="text-lg mb-1">{icon} <span className="text-white text-sm font-semibold">{nome}</span></div>
                  <p className="text-neutral-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm">
              Per esercitare i tuoi diritti, scrivi a{" "}
              <a href="mailto:privacy@lifewrapped.app" className="text-[#cc97ff] hover:underline">
                privacy@lifewrapped.app
              </a>
              . Risponderemo entro 30 giorni dalla ricezione della richiesta.
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Per richiedere la cancellazione di uno specifico wrapped, è sufficiente indicare il token nella richiesta.
            </p>
          </Section>

          {/* 6. Cookie */}
          <Section id="cookie" label="6." title="Cookie Policy">
            <p className="mb-4">
              LifeWrapped utilizza esclusivamente <strong className="text-white">cookie tecnici strettamente necessari</strong> al funzionamento del servizio. Non utilizziamo cookie di profilazione, cookie di terze parti per finalità di marketing o sistemi di tracciamento comportamentale.
            </p>
            <div className="bg-[#131313] rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left p-3 text-neutral-400 font-semibold">Cookie</th>
                    <th className="text-left p-3 text-neutral-400 font-semibold">Tipo</th>
                    <th className="text-left p-3 text-neutral-400 font-semibold">Finalità</th>
                    <th className="text-left p-3 text-neutral-400 font-semibold">Scadenza</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-400">
                  <tr className="border-b border-white/5">
                    <td className="p-3 font-mono">__vercel_*</td>
                    <td className="p-3">Tecnico</td>
                    <td className="p-3">Routing CDN Vercel (infrastruttura hosting)</td>
                    <td className="p-3">Sessione</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">next-*</td>
                    <td className="p-3">Tecnico</td>
                    <td className="p-3">Funzionamento del framework Next.js (prefetching, navigazione)</td>
                    <td className="p-3">Sessione</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-neutral-500">
              Poiché utilizziamo solo cookie tecnici necessari, non è richiesto il consenso preventivo per il loro utilizzo ai sensi dell&apos;art. 122 del D.Lgs. 196/2003 e delle linee guida del Garante.
            </p>
          </Section>

          {/* 7. Terze parti */}
          <Section id="terze-parti" label="7." title="Responsabili del Trattamento e Terze Parti">
            <p className="mb-4">
              Per l&apos;erogazione del servizio ci avvaliamo dei seguenti fornitori di infrastruttura, nominati responsabili del trattamento ai sensi dell&apos;art. 28 GDPR:
            </p>
            <div className="space-y-3">
              {[
                {
                  nome: "Vercel Inc.",
                  ruolo: "Hosting frontend (Next.js)",
                  sede: "USA — coperto da Standard Contractual Clauses (SCC)",
                  link: "https://vercel.com/legal/privacy-policy",
                },
                {
                  nome: "Railway / Neon (o fornitore DB equivalente)",
                  ruolo: "Hosting database PostgreSQL",
                  sede: "USA/EU — coperto da SCC o adeguatezza",
                  link: "https://railway.app/legal/privacy",
                },
                {
                  nome: "Valve Corporation (Steam Web API)",
                  ruolo: "Fornitore API per dati gaming (solo se si usa la funzione Steam)",
                  sede: "USA — il trattamento avviene sui sistemi Valve",
                  link: "https://store.steampowered.com/privacy_agreement/",
                },
              ].map(({ nome, ruolo, sede, link }) => (
                <div key={nome} className="bg-[#131313] rounded-xl p-4 border border-white/5">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-white font-semibold text-sm">{nome}</p>
                      <p className="text-neutral-500 text-xs mt-1">{ruolo}</p>
                      <p className="text-neutral-600 text-xs mt-1">{sede}</p>
                    </div>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#cc97ff] text-xs hover:underline shrink-0"
                    >
                      Privacy Policy →
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-neutral-500">
              Non vendiamo, affittiamo o cediamo i tuoi dati a terzi per finalità di marketing o profilazione.
            </p>
          </Section>

          {/* 8. Trasferimenti internazionali */}
          <Section id="trasferimenti" label="8." title="Trasferimenti Internazionali">
            <p>
              Alcuni dei nostri fornitori di infrastruttura (es. Vercel) hanno sede negli Stati Uniti. Il trasferimento dei dati verso tali paesi avviene nel rispetto degli artt. 44-49 del GDPR, tramite <strong className="text-white">Clausole Contrattuali Standard (SCC)</strong> approvate dalla Commissione Europea, garantendo un livello di protezione adeguato.
            </p>
            <p className="mt-3">
              Le chiamate all&apos;API Steam vengono instradate verso i server di Valve Corporation (USA). In questo caso il trattamento è necessario per l&apos;esecuzione del servizio richiesto dall&apos;utente (art. 49(1)(b) GDPR).
            </p>
          </Section>

          {/* 9. Minori */}
          <Section id="minori" label="9." title="Minori">
            <p>
              LifeWrapped non è destinato a persone di età inferiore ai <strong className="text-white">14 anni</strong> (limite previsto dall&apos;art. 8 GDPR e dall&apos;art. 2-quinquies del D.Lgs. 196/2003 per l&apos;Italia). Non raccogliamo consapevolmente dati di minori di 14 anni. Se ritieni che un minore abbia utilizzato il servizio, ti invitiamo a contattarci per richiedere la cancellazione dei dati.
            </p>
          </Section>

          {/* 10. Sicurezza */}
          <Section id="sicurezza" label="10." title="Misure di Sicurezza">
            <p className="mb-3">Adottiamo misure tecniche e organizzative adeguate per proteggere i dati trattati:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Tutte le comunicazioni tra browser e server avvengono tramite <strong className="text-white">HTTPS con TLS</strong></li>
              <li>I file caricati non vengono mai scritti su disco — <strong className="text-white">elaborazione esclusivamente in memoria</strong></li>
              <li>Il database è accessibile solo tramite connessione cifrata con SSL/TLS</li>
              <li>Il sistema di <strong className="text-white">rate limiting</strong> (10 richieste/minuto per endpoint) protegge da abusi e attacchi automatizzati</li>
              <li>Nessun dato personale identificativo viene associato ai risultati saved</li>
              <li>Le chiavi API (Steam, database) sono conservate come variabili d&apos;ambiente cifrate e non sono mai esposte al frontend</li>
            </ul>
          </Section>

          {/* 11. Modifiche */}
          <Section id="modifiche" label="11." title="Modifiche alla Presente Informativa">
            <p>
              Ci riserviamo il diritto di aggiornare la presente informativa in qualsiasi momento, ad esempio per adeguarla a modifiche normative o a nuove funzionalità del servizio. La data dell&apos;ultimo aggiornamento è indicata in cima alla pagina. In caso di modifiche sostanziali, pubblicheremo un avviso in evidenza sul sito.
            </p>
            <p className="mt-3">
              L&apos;uso continuato del servizio dopo la pubblicazione delle modifiche costituisce accettazione della nuova informativa.
            </p>
          </Section>

          {/* 12. Contatti */}
          <Section id="contatti" label="12." title="Contatti">
            <p>
              Per qualsiasi domanda, richiesta di esercizio dei diritti o segnalazione relativa alla protezione dei dati personali, puoi contattarci a:
            </p>
            <div className="mt-4 bg-[#131313] rounded-xl p-6 border border-white/5">
              <p className="text-white font-semibold">LifeWrapped — Team Privacy</p>
              <p className="text-neutral-400 text-sm mt-1">
                E-mail:{" "}
                <a href="mailto:privacy@lifewrapped.app" className="text-[#cc97ff] hover:underline">
                  privacy@lifewrapped.app
                </a>
              </p>
              <p className="text-neutral-600 text-xs mt-3">
                Autorità di controllo competente: Garante per la Protezione dei Dati Personali —{" "}
                <a
                  href="https://www.garanteprivacy.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#cc97ff] hover:underline"
                >
                  www.garanteprivacy.it
                </a>
              </p>
            </div>
          </Section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] w-full py-12 px-6 mt-16 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-3xl mx-auto text-[10px] uppercase tracking-[0.2em]">
          <div className="text-white font-bold">LifeWrapped</div>
          <div className="text-neutral-600">© 2025 LifeWrapped — Tutti i diritti riservati</div>
          <div className="flex gap-8 text-neutral-600">
            <Link href="/privacy" className="text-[#cc97ff]">Privacy Policy</Link>
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

function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
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

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 pl-4 border-l border-[#cc97ff]/30">
      <p className="text-white font-semibold text-sm mb-2">{title}</p>
      <div className="text-sm leading-relaxed text-neutral-400 space-y-2">{children}</div>
    </div>
  );
}

function FinalitaRow({ finalita, base }: { finalita: string; base: string }) {
  return (
    <div className="bg-[#131313] rounded-xl p-4 border border-white/5">
      <p className="text-white text-sm font-medium">{finalita}</p>
      <p className="text-neutral-500 text-xs mt-1">Base giuridica: {base}</p>
    </div>
  );
}
