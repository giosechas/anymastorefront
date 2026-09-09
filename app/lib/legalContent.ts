export interface LegalSection {
  heading: string;
  body: string;
}

export interface LegalPolicy {
  slug: string;
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

/**
 * Real legal text drafted for Anyma Beauty (MAD SOLUTION S.R.L.), source:
 * ANYMA_AREA_LEGALE.docx. [DA COMPLETARE] markers are still open (company
 * address, P.IVA, REA, PEC) — fill in once the lawyer/accountant confirms
 * them, then update lastUpdated.
 */
export const LEGAL_POLICIES: LegalPolicy[] = [
  {
    slug: 'condizioni-di-uso',
    title: 'Condizioni di Uso',
    lastUpdated: '[DA COMPLETARE]',
    sections: [
      {
        heading: '1. Titolarità del sito',
        body: 'Il sito web anyma-beauty.com (di seguito "Sito") è di proprietà e gestito da MAD SOLUTION S.R.L., con sede legale in [DA COMPLETARE], P.IVA [DA COMPLETARE], iscritta al Registro delle Imprese di Milano al n. [DA COMPLETARE] (di seguito "Titolare").',
      },
      {
        heading: '2. Ambito di applicazione',
        body: 'Le presenti Condizioni di Uso disciplinano l\'accesso e la navigazione del Sito da parte di qualsiasi utente (di seguito "Utente"). L\'accesso al Sito implica l\'accettazione integrale delle presenti condizioni.',
      },
      {
        heading: '3. Proprietà intellettuale',
        body: 'Tutti i contenuti presenti sul Sito, inclusi testi, immagini, grafiche, loghi, marchi, design del packaging, nomi delle collezioni (Leopard, Panther, Candy Rosa, Candy Tiffany, Street, Urban), il sistema delle "Anime" e ogni altro elemento creativo, sono di proprietà esclusiva di MAD SOLUTION S.R.L. o dei rispettivi licenzianti e sono protetti dalle leggi italiane, europee e internazionali in materia di proprietà intellettuale. È vietata qualsiasi riproduzione, distribuzione, trasmissione, modifica o utilizzo dei contenuti del Sito senza autorizzazione scritta del Titolare.',
      },
      {
        heading: '4. Utilizzo consentito',
        body: 'L\'Utente si impegna a utilizzare il Sito esclusivamente per finalità lecite e in conformità alla normativa vigente. In particolare, è vietato: (a) utilizzare il Sito per scopi fraudolenti o illeciti; (b) tentare di accedere a sezioni riservate o ai sistemi informatici del Sito; (c) raccogliere dati personali di altri utenti; (d) interferire con il funzionamento del Sito.',
      },
      {
        heading: '5. Esclusione di responsabilità',
        body: 'Il Titolare si impegna a mantenere il Sito aggiornato e funzionante, ma non garantisce la continuità, completezza o assenza di errori dei contenuti. Il Titolare non è responsabile per danni diretti o indiretti derivanti dall\'utilizzo del Sito o dall\'impossibilità di accedervi.',
      },
      {
        heading: '6. Link a siti terzi',
        body: 'Il Sito può contenere link a siti web di terze parti. Il Titolare non ha alcun controllo su tali siti e non è responsabile per i loro contenuti, le loro politiche sulla privacy o le loro pratiche.',
      },
      {
        heading: '7. Modifiche',
        body: 'Il Titolare si riserva il diritto di modificare le presenti Condizioni in qualsiasi momento. Le modifiche saranno efficaci dalla data di pubblicazione sul Sito.',
      },
      {
        heading: '8. Legge applicabile e foro competente',
        body: 'Le presenti Condizioni sono regolate dalla legge italiana. Per qualsiasi controversia sarà competente in via esclusiva il Foro di Milano, fatto salvo il foro del consumatore ai sensi dell\'art. 66-bis del D.Lgs. 206/2005.',
      },
    ],
  },
  {
    slug: 'condizioni-di-vendita',
    title: 'Condizioni di Vendita',
    lastUpdated: '[DA COMPLETARE]',
    sections: [
      {
        heading: '1. Ambito di applicazione',
        body: 'Le presenti Condizioni Generali di Vendita si applicano a tutti gli acquisti effettuati sul sito anyma-beauty.com da consumatori (persone fisiche che agiscono per scopi estranei alla propria attività professionale) residenti nell\'Unione Europea, in conformità al Codice del Consumo (D.Lgs. 206/2005) e alla Direttiva UE 2011/83 sui diritti dei consumatori.',
      },
      {
        heading: '2. Venditore',
        body: 'Il venditore è MAD SOLUTION S.R.L., con sede legale in [DA COMPLETARE], P.IVA [DA COMPLETARE], e-mail: info@anyma-beauty.com, PEC: [DA COMPLETARE].',
      },
      {
        heading: '3. Prodotti',
        body: 'I prodotti venduti sul Sito sono cosmetici a marchio ANYMA BEAUTY, fabbricati in Italia nel rispetto del Regolamento (CE) n. 1223/2009 sui prodotti cosmetici. Le immagini dei prodotti hanno scopo illustrativo; lievi variazioni di colore possono dipendere dalle impostazioni del dispositivo dell\'Utente.',
      },
      {
        heading: '4. Procedura d\'acquisto',
        body: 'Per effettuare un acquisto, l\'Utente deve: (a) selezionare i prodotti desiderati e aggiungerli al carrello; (b) inserire i dati di spedizione e fatturazione; (c) scegliere il metodo di pagamento; (d) verificare il riepilogo dell\'ordine; (e) confermare l\'ordine. La conferma dell\'ordine costituisce proposta contrattuale. Il contratto si perfeziona con l\'invio della conferma d\'ordine da parte del Venditore.',
      },
      {
        heading: '5. Prezzi',
        body: 'Tutti i prezzi sono espressi in Euro (EUR) e includono l\'IVA applicabile nel Paese di destinazione. Le spese di spedizione sono indicate separatamente prima della conferma dell\'ordine. Il Venditore si riserva il diritto di modificare i prezzi in qualsiasi momento; il prezzo applicato è quello vigente al momento della conferma dell\'ordine.',
      },
      {
        heading: '6. Pagamenti',
        body: 'I metodi di pagamento accettati sono: carte di credito e debito (Visa, Mastercard, American Express), Apple Pay, Google Pay, e ulteriori metodi resi disponibili tramite Shopify Payments. Il pagamento viene addebitato al momento della conferma dell\'ordine.',
      },
      {
        heading: '7. Spedizione e consegna',
        body: 'I prodotti vengono spediti da [DA COMPLETARE] (Italia). I tempi di consegna indicativi sono: Italia 2-4 giorni lavorativi; Unione Europea 4-8 giorni lavorativi. I tempi indicati non sono vincolanti. In ogni caso, la consegna avverrà entro 30 giorni dalla conferma dell\'ordine, salvo comunicazione di ritardo.',
      },
      {
        heading: '8. Diritto di recesso',
        body: 'Ai sensi degli artt. 52-59 del D.Lgs. 206/2005, il consumatore ha diritto di recedere dal contratto entro 14 giorni dal ricevimento dei prodotti, senza obbligo di motivazione. Per i prodotti cosmetici, il diritto di recesso è escluso se il prodotto è stato aperto, utilizzato o se il sigillo igienico è stato rimosso, ai sensi dell\'art. 59, lett. e) del Codice del Consumo. Per esercitare il diritto di recesso, l\'Utente deve inviare una comunicazione scritta a info@anyma-beauty.com o tramite il modulo di reso disponibile sul Sito, indicando il numero d\'ordine. I prodotti devono essere restituiti integri, nella confezione originale, entro 14 giorni dalla comunicazione di recesso.',
      },
      {
        heading: '9. Garanzia legale di conformità',
        body: 'I prodotti sono coperti dalla garanzia legale di conformità di cui agli artt. 128-135 del D.Lgs. 206/2005 (24 mesi dalla consegna). In caso di difetto di conformità, il consumatore ha diritto alla riparazione o sostituzione del prodotto, o a una riduzione del prezzo o risoluzione del contratto.',
      },
      {
        heading: '10. Legge applicabile',
        body: 'I contratti di vendita sono regolati dalla legge italiana. Si applica la normativa inderogabile a protezione del consumatore del Paese di residenza abituale dell\'Utente, ove più favorevole. Per le controversie, è competente il foro del consumatore.',
      },
      {
        heading: '11. Risoluzione alternativa delle controversie (ADR/ODR)',
        body: 'Il consumatore residente nell\'UE può utilizzare la piattaforma ODR della Commissione Europea per la risoluzione online delle controversie: https://ec.europa.eu/consumers/odr',
      },
    ],
  },
  {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    lastUpdated: '[DA COMPLETARE]',
    sections: [
      {
        heading: '1. Cosa sono i cookie',
        body: 'I cookie sono piccoli file di testo che i siti web visitati inviano al browser dell\'Utente, dove vengono memorizzati per essere ritrasmessi agli stessi siti alla visita successiva. I cookie permettono al Sito di funzionare correttamente e di migliorare l\'esperienza di navigazione.',
      },
      {
        heading: '2. Tipologie di cookie utilizzati',
        body: 'Cookie tecnici (necessari): indispensabili per il funzionamento del Sito, gestione del carrello, sessione di navigazione, preferenze di lingua e valuta. Non richiedono il consenso dell\'Utente.\n\nCookie analitici: utilizzati per raccogliere informazioni aggregate sull\'utilizzo del Sito (pagine visitate, tempo di permanenza, provenienza degli Utenti). Utilizziamo Google Analytics con anonimizzazione dell\'indirizzo IP. Questi cookie vengono installati solo previo consenso dell\'Utente.\n\nCookie di profilazione e marketing: utilizzati per inviare messaggi pubblicitari personalizzati in base alle preferenze dell\'Utente. Possono essere installati da terze parti (Meta Pixel, Google Ads). Questi cookie vengono installati solo previo consenso esplicito dell\'Utente.',
      },
      {
        heading: '3. Cookie di terze parti',
        body: 'Il Sito utilizza servizi di terze parti che possono installare propri cookie: Shopify (funzionamento e-commerce), Google Analytics (analisi), Meta/Facebook Pixel (marketing), Google Ads (marketing). Per le politiche sui cookie di ciascun fornitore, si rimanda alle rispettive informative.',
      },
      {
        heading: '4. Gestione dei cookie',
        body: 'Al primo accesso al Sito, un banner informa l\'Utente sull\'utilizzo dei cookie e consente di: (a) accettare tutti i cookie; (b) rifiutare i cookie non necessari; (c) personalizzare le preferenze per categoria. L\'Utente può modificare le proprie preferenze in qualsiasi momento tramite il link "Gestisci cookie" presente nel footer del Sito. È inoltre possibile gestire i cookie dalle impostazioni del proprio browser.',
      },
      {
        heading: '5. Base giuridica',
        body: 'Cookie tecnici: legittimo interesse del Titolare (art. 6.1.f GDPR). Cookie analitici e di marketing: consenso dell\'Utente (art. 6.1.a GDPR), in conformità al Provvedimento del Garante Privacy n. 231/2021.',
      },
    ],
  },
  {
    slug: 'policy-di-reso',
    title: 'Policy di Reso',
    lastUpdated: '[DA COMPLETARE]',
    sections: [
      {
        heading: '1. Diritto di reso',
        body: 'Hai 14 giorni dal ricevimento dell\'ordine per richiedere il reso, senza obbligo di motivazione. Per prodotti cosmetici, il reso è accettato solo se il prodotto è sigillato e non è stato aperto o utilizzato (art. 59, lett. e, D.Lgs. 206/2005).',
      },
      {
        heading: '2. Come richiedere un reso',
        body: 'Invia una e-mail a info@anyma-beauty.com indicando: (a) numero d\'ordine; (b) prodotto/i da restituire; (c) motivo del reso (facoltativo). Riceverai entro 48 ore le istruzioni per la spedizione di ritorno.',
      },
      {
        heading: '3. Condizioni del reso',
        body: 'I prodotti devono essere restituiti: (a) nella confezione originale integra; (b) con il sigillo igienico intatto; (c) senza segni di utilizzo; (d) entro 14 giorni dalla comunicazione di reso. Le spese di spedizione per il reso sono a carico dell\'Utente, salvo prodotto difettoso o errore del Venditore.',
      },
      {
        heading: '4. Rimborso',
        body: 'Il rimborso viene effettuato entro 14 giorni dal ricevimento del prodotto restituito, tramite lo stesso metodo di pagamento utilizzato per l\'acquisto. Il rimborso include il prezzo del prodotto e le spese di spedizione iniziali (limitatamente al metodo di spedizione standard).',
      },
      {
        heading: '5. Prodotti difettosi o non conformi',
        body: 'Se il prodotto ricevuto è difettoso, danneggiato o diverso da quello ordinato, contatta info@anyma-beauty.com entro 48 ore dal ricevimento allegando fotografie del prodotto e dell\'imballaggio. Le spese di reso saranno a nostro carico e provvederemo alla sostituzione o al rimborso integrale.',
      },
    ],
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    lastUpdated: '[DA COMPLETARE]',
    sections: [
      {
        heading: '1. Titolare del trattamento',
        body: 'Il Titolare del trattamento dei dati personali è MAD SOLUTION S.R.L., con sede legale in [DA COMPLETARE], P.IVA [DA COMPLETARE], e-mail: info@anyma-beauty.com, PEC: [DA COMPLETARE].',
      },
      {
        heading: '2. Dati raccolti',
        body: 'Dati forniti dall\'Utente: nome, cognome, indirizzo e-mail, indirizzo di spedizione e fatturazione, numero di telefono, dati di pagamento (elaborati direttamente da Shopify Payments/Stripe, il Titolare non ha accesso ai numeri completi delle carte).\n\nDati raccolti automaticamente: indirizzo IP (anonimizzato), tipo di browser e dispositivo, pagine visitate, data e ora della visita, dati di interazione con il Sito (tramite cookie, previo consenso).',
      },
      {
        heading: '3. Finalità e base giuridica del trattamento',
        body: '(a) Esecuzione del contratto (art. 6.1.b GDPR): gestione dell\'ordine, spedizione, fatturazione, assistenza post-vendita.\n(b) Obbligo legale (art. 6.1.c GDPR): adempimenti fiscali e contabili, conservazione dei dati per il periodo previsto dalla legge.\n(c) Legittimo interesse (art. 6.1.f GDPR): prevenzione delle frodi, miglioramento del Sito e dei servizi, sicurezza informatica.\n(d) Consenso (art. 6.1.a GDPR): invio di comunicazioni promozionali via e-mail, profilazione per marketing personalizzato, cookie analitici e di marketing.',
      },
      {
        heading: '4. Destinatari dei dati',
        body: 'I dati possono essere comunicati a: (a) fornitori di servizi tecnici (hosting, e-commerce: Shopify Inc., con sede in Canada, decisione di adeguatezza della Commissione Europea); (b) corrieri per la consegna degli ordini; (c) fornitori di servizi di pagamento (Stripe); (d) fornitori di servizi di analisi e marketing (Google, Meta), previo consenso dell\'Utente; (e) autorità pubbliche, ove richiesto dalla legge.',
      },
      {
        heading: '5. Trasferimenti extra-UE',
        body: 'Alcuni dei nostri fornitori di servizi (Shopify, Google, Meta) possono trattare dati al di fuori dello Spazio Economico Europeo. Tali trasferimenti avvengono sulla base di: (a) decisioni di adeguatezza della Commissione Europea; (b) clausole contrattuali standard (art. 46.2.c GDPR); (c) Data Privacy Framework UE-USA, ove applicabile.',
      },
      {
        heading: '6. Periodo di conservazione',
        body: 'Dati di acquisto: 10 anni (obblighi fiscali). Dati dell\'account cliente: fino alla cancellazione dell\'account. Dati di marketing: fino alla revoca del consenso. Cookie analitici: massimo 26 mesi. Log di navigazione: 90 giorni.',
      },
      {
        heading: '7. Diritti dell\'interessato',
        body: 'L\'Utente ha diritto di: (a) accedere ai propri dati; (b) ottenerne la rettifica o la cancellazione; (c) limitare il trattamento; (d) opporsi al trattamento; (e) ottenere la portabilità dei dati; (f) revocare il consenso in qualsiasi momento. Per esercitare tali diritti, inviare una richiesta a info@anyma-beauty.com. L\'Utente ha inoltre il diritto di proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).',
      },
    ],
  },
  {
    slug: 'informativa-trattamento-dati',
    title: 'Informativa relativa al trattamento dei dati personali',
    lastUpdated: '[DA COMPLETARE]',
    sections: [
      {
        heading: 'Ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679 (GDPR)',
        body: 'Identità del Titolare: MAD SOLUTION S.R.L., con sede legale in [DA COMPLETARE], P.IVA [DA COMPLETARE]. Contatto: info@anyma-beauty.com. Il Titolare non ha nominato un DPO (Responsabile della Protezione dei Dati) in quanto non rientra nei casi previsti dall\'art. 37 del GDPR.',
      },
      {
        heading: 'Se acquisti un prodotto',
        body: 'Trattiamo nome, indirizzo, e-mail e dati di pagamento per eseguire il contratto di vendita, gestire la spedizione e fornire assistenza post-vendita. Base giuridica: esecuzione del contratto (art. 6.1.b GDPR). Il conferimento dei dati è necessario; il rifiuto comporta l\'impossibilità di completare l\'acquisto.',
      },
      {
        heading: 'Se ti iscrivi alla newsletter',
        body: 'Trattiamo il tuo indirizzo e-mail per inviarti comunicazioni commerciali su prodotti, novità e promozioni. Base giuridica: consenso (art. 6.1.a GDPR). Il consenso è facoltativo e revocabile in qualsiasi momento tramite il link di disiscrizione presente in ogni e-mail.',
      },
      {
        heading: 'Se partecipi al programma Anime Prime',
        body: 'Trattiamo i dati da te forniti (nome, e-mail, profilo social, feedback sui prodotti) per la gestione del programma di co-validazione e per comunicazioni riservate. Base giuridica: consenso (art. 6.1.a GDPR) e legittimo interesse (art. 6.1.f GDPR).',
      },
      {
        heading: 'Se navighi il Sito',
        body: 'Raccogliamo dati di navigazione tramite cookie tecnici (necessari) e, previo consenso, cookie analitici e di marketing. Per maggiori dettagli, consulta la Cookie Policy.',
      },
      {
        heading: 'Comunicazione e diffusione',
        body: 'I dati non saranno diffusi. Potranno essere comunicati ai soggetti indicati nella Privacy Policy (fornitori di servizi, corrieri, autorità).',
      },
      {
        heading: 'Processo decisionale automatizzato',
        body: 'Il Titolare non effettua processi decisionali automatizzati o profilazione che producano effetti giuridici o significativi sull\'Utente.',
      },
    ],
  },
  {
    slug: 'accessibilita',
    title: 'Dichiarazione di Accessibilità',
    lastUpdated: '[DA COMPLETARE]',
    sections: [
      {
        heading: 'Il nostro impegno',
        body: 'MAD SOLUTION S.R.L. si impegna a rendere il sito anyma-beauty.com accessibile a tutti gli utenti, incluse le persone con disabilità, in conformità alla Direttiva UE 2016/2102 sull\'accessibilità dei siti web e alla Legge 4/2004 (Legge Stanca) e successive modifiche (D.Lgs. 106/2018).',
      },
      {
        heading: 'Standard di riferimento',
        body: 'Il Sito è progettato per rispettare le linee guida WCAG 2.1 livello AA (Web Content Accessibility Guidelines), che riguardano: percepibilità, utilizzabilità, comprensibilità e robustezza dei contenuti web.',
      },
      {
        heading: 'Misure adottate',
        body: '(a) Testi alternativi per tutte le immagini dei prodotti. (b) Contrasto cromatico conforme ai requisiti WCAG 2.1 AA tra testo e sfondo. (c) Navigazione completa da tastiera. (d) Struttura semantica delle pagine con heading gerarchici. (e) Etichette descrittive per i campi dei moduli. (f) Dimensioni dei target interattivi adeguate.',
      },
      {
        heading: 'Limitazioni note',
        body: 'Alcune funzionalità di terze parti (widget di pagamento Shopify, strumenti di analisi) potrebbero non essere pienamente accessibili. Stiamo lavorando con i fornitori per migliorare progressivamente la conformità.',
      },
      {
        heading: 'Feedback e contatti',
        body: 'Se riscontri barriere di accessibilità sul nostro Sito, ti invitiamo a segnalarcelo scrivendo a info@anyma-beauty.com. Ci impegniamo a rispondere entro 30 giorni e a prendere le misure necessarie.',
      },
      {
        heading: 'Applicazione',
        body: 'In caso di risposta insoddisfacente, l\'Utente può inviare una segnalazione all\'Agenzia per l\'Italia Digitale (AgID) tramite il modulo disponibile su https://www.agid.gov.it/it/design-servizi/accessibilita.',
      },
    ],
  },
];

export function getLegalPolicy(slug: string): LegalPolicy | undefined {
  return LEGAL_POLICIES.find((p) => p.slug === slug);
}
