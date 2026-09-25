/** UI copy dictionary for IT (default)/EN/ES. Product marketing copy lives
 * in productCopy.ts instead — this file is for site chrome and page text.
 * Keys are read via useT()'s t('namespace.key') in components. */
export const TRANSLATIONS = {
  IT: {
    header: {
      marqueeDiscount: 'Sconto esclusivo per chi si iscrive',
      marqueeShipping: 'Spedizione in 48h',
      leAnyme: 'Le Anyme',
      tutteLeAnyme: 'Tutte le Anyme',
      packPerAnyme: 'Pack per Anyme',
      cercaPerProdotto: 'Cerca per prodotto',
      rossetti: 'Rossetti',
      lipGloss: 'Lip Gloss',
      mascaraEyeliner: 'Mascara & Eyeliner',
      laNostraStoria: 'La nostra storia',
      chiudiMenu: 'Chiudi menu',
      apriMenu: 'Apri menu',
      account: 'Account',
      wishlist: 'Wishlist',
      cart: 'Carrello',
    },
    footer: {
      rivelaChiSei: 'Rivela chi sei',
      laNostraStoria: 'La Nostra Storia',
      areaLegale: 'Area Legale',
      lavoraConNoi: 'Lavora con noi',
      rightsReserved: 'Tutti i diritti riservati',
    },
    support: {
      close: 'Chiudi',
      trackOrder: 'Monitora il tuo ordine',
      trackOrderBody:
        "Inserisci il numero d'ordine e l'email usata per l'acquisto: ti risponderemo con lo stato della spedizione.",
      orderNumberPlaceholder: "Numero d'ordine (es. #1234)",
      orderEmailPlaceholder: "Email dell'ordine",
      send: 'Invia',
      trackOrderSubject: 'Monitora il mio ordine',
      returnOrder: 'Reso Online',
      returnOrderHeadline: "Come posso restituire l'articolo?",
      returnOrderBody:
        "Hai 14 giorni dal ricevimento per richiedere il reso. Il prodotto deve essere sigillato e non utilizzato. Inserisci numero d'ordine ed email: ti risponderemo entro 48 ore con le istruzioni per la spedizione di ritorno.",
      sendRequest: 'Invia richiesta',
      returnRequestSubject: 'Richiesta di reso',
      returnItemsLabel: 'Prodotto/i da restituire: ',
    },
    cookies: {
      ariaLabel: 'Preferenze cookie',
      body: 'Utilizziamo cookie tecnici necessari al funzionamento del sito e, previo consenso, cookie di analisi e marketing. Consulta la',
      privacyPolicy: 'Privacy Policy',
      bodyEnd: 'per maggiori informazioni.',
      reject: 'Rifiuta',
      acceptAll: 'Accetta tutto',
    },
    login: {
      accedi: 'Accedi',
      chiudiAccesso: 'Chiudi accesso',
      accediAlTuoAccount: 'Accedi al tuo account',
      email: 'Email',
      continua: 'Continua',
      nonHaiAccount: 'Non hai un account?',
      registrati: 'Registrati',
      passwordDimenticata: 'Hai dimenticato la password?',
    },
    search: {
      cerca: 'Cerca',
      chiudiRicerca: 'Chiudi ricerca',
      placeholder: 'Cerca prodotti, anime...',
      ricercheRecenti: 'Ricerche recenti',
      rimuoviDallaCronologia: (t: string) => `Rimuovi "${t}" dalla cronologia`,
      ricercaInCorso: 'Ricerca in corso…',
      nessunRisultato: (q: string) => `Nessun risultato per «${q}»`,
      caricamento: 'Caricamento…',
      precedenti: '↑ Precedenti',
      altriProdotti: 'Altri prodotti ↓',
      nessunRisultatoGenerico: "Nessun risultato. Prova con un'altra ricerca.",
      prodotti: 'Prodotti',
      pagine: 'Pagine',
      articoli: 'Articoli',
    },
    gallery: {
      previous: 'Foto precedente',
      next: 'Foto successiva',
      goTo: (n: number) => `Vai alla foto ${n}`,
    },
    account: {
      welcome: (name: string) => `Benvenuta, ${name}`,
      welcomeGeneric: 'Benvenuta nel tuo account.',
      accountDetails: 'Dettagli account',
      orders: 'Ordini',
      profile: 'Profilo',
      addresses: 'Indirizzi',
      signOut: 'Esci',
      clearFilters: 'Rimuovi filtri →',
      startShopping: 'Inizia lo shopping →',
      viewOrder: 'Vedi ordine →',
      noOrdersFiltered: 'Nessun ordine trovato per questa ricerca.',
      noOrdersYet: 'Non hai ancora effettuato ordini.',
      registrati: 'Registrati',
      loadingCart: 'Caricamento carrello…',
      cartHeading: 'CARRELLO',
      menuHeading: 'MENU',
    },
    policiesPage: {
      backToPolicies: '← Torna alle Policy',
    },
    communityVideos: {
      title: 'La community lo indossa',
      more: 'Altri video della community arrivano presto, segui',
      onTikTok: 'su TikTok.',
    },
    rating: {
      noReviewsYet: 'Ancora nessuna recensione',
      outOf5: (rating: number) => `${rating} su 5 Anyme`,
      summary: (rating: string, count: number) =>
        `${rating} · ${count} ${count === 1 ? 'recensione' : 'recensioni'}`,
    },
    wishlist: {
      remove: 'Rimuovi dai preferiti',
      add: 'Aggiungi ai preferiti',
    },
    product: {
      addToCart: 'Aggiungi al carrello',
      soldOut: 'Esaurito',
    },
    hero: {
      slides: [
        {
          title: 'Il primo beauty identitario',
          tagline: 'Non scegli un semplice cosmetico: scegli chi vuoi essere oggi.',
        },
        {
          title: 'La bellezza non è coerenza. È verità.',
          tagline: 'La tua molteplicità è il tuo potere più grande. Rivelala senza scuse.',
        },
        {
          title: 'Chi vuoi essere oggi?',
          tagline: 'Scegli la tua anima. Il tuo oggetto in alluminio ti seguirà.',
        },
        {
          title: 'Questo non è trucco. È il tuo rituale.',
          tagline:
            'Trasformiamo il gesto quotidiano davanti allo specchio in un atto di pura autodeterminazione.',
        },
        {
          title: "Oggetti d'arte che parlano di te",
          tagline: 'Alluminio massiccio, finitura goldrose e la firma fisica della tua identità.',
        },
        {
          title: 'Ti diamo gli strumenti per diventare',
          tagline:
            'Un giorno fiera come Leopard, un giorno libera come Street, un giorno leggera come Candy.',
        },
        {
          title: 'Reveal your soul',
          tagline: 'Oggetti identitari creati in Italia per dare voce a tutte le versioni di te.',
        },
      ],
      discoverAnyme: 'Scopri le tue Anyme',
      shopNow: 'Shop Now',
    },
    animaGrid: {
      le6Anyme: 'Le 6 Anyme',
      scegliLaTuaAnyma: 'Scegli la tua Anyma',
      subtitle:
        'Ogni Anyma ha la sua estetica. Il pack che scegli non è un contenitore: è un simbolo.',
      compraIlPack: 'Compra il Pack',
    },
    brandStory: {
      quote: 'Non esiste una sola te.',
      body: 'Riveliamo le anyme attraverso il make-up. Non vendiamo rossetti. Creiamo gli oggetti con cui le persone si raccontano ogni giorno.',
      cta: 'Scopri la nostra storia',
    },
    founders: {
      postiLimitati: 'Posti limitati',
      title: 'Diventa Anyma Prima',
      subtitle:
        'Spedizione a vita, tessera numerata, 15% di benvenuto: solo per le prime 800 anyme.',
      countOf: (total: number) => `su ${total} anyme già dentro`,
      thanks: 'Grazie, ti faremo sapere quando si apre il tuo posto.',
      emailPlaceholder: 'La tua email',
      reserveSpot: 'Riservati il posto',
    },
    philosophy: {
      truthQuote: 'La bellezza non è coerenza.',
      truthSubquote: 'È verità.',
      identityQuote: 'La personalità',
      identitySubquote: 'non ha colore.',
    },
    meta: {
      homeTitle: 'Anyma Beauty | Rivela chi sei',
      homeDescription:
        'Anyma Beauty, il make-up con personalità. Scegli la tua Anyma, poi il colore.',
    },
    collection: {
      cambiaLaTuaAnyma: 'Cambia la tua Anyma',
      anymaLabel: (name: string) => `Anyma ${name}`,
      inArrivo: 'In arrivo',
    },
    pdp: {
      cambiaAnymaStessoColore: 'Cambia Anyma, stesso colore',
      altriColori: (name: string) => `Altri colori · Anyma ${name}`,
      guardaloAddosso: 'Guardalo addosso',
      unRitualeCompleto: 'Un rituale completo',
      ritualeBody: (name: string) =>
        `Rossetto, gloss e mascara pensati per completarsi. Scopri il trittico Anyma ${name} e porta a casa l'intera esperienza.`,
      trittico: (name: string) => `Trittico Anyma ${name}`,
      componiIlTuoPack: 'Componi il tuo Pack →',
      videoInArrivo: 'Video in arrivo',
      inArrivo: 'In arrivo',
      descrizione: 'Descrizione',
      applicazione: 'Applicazione',
      formula: 'Formula',
      anatomia: 'Anatomia',
      ingredienti: 'Ingredienti',
      ingredientiInArrivo: 'Lista ingredienti in arrivo.',
      tiPotrebberoAncePiacere: 'Ti potrebbero piacere anche',
    },
    social: {
      seguici: 'Seguici',
      guardaciSu: 'Guardaci su',
      body: 'Backstage, texture, anyme in movimento: la parte più vera del brand vive sui social, prima ancora che sullo shop.',
      segui: (handle: string) => `Segui ${handle}`,
    },
    productsByType: {
      cercaPerProdotto: 'Cerca per prodotto',
      subtitle: 'Lo stesso gesto, in tutte le Anyme. Trova il tuo colore.',
      vediPerAnyma: 'Vedi per Anyma',
      vediPerColore: 'Vedi per colore',
      nessunProdotto: 'Nessun prodotto trovato per questa categoria.',
    },
    cart: {
      title: 'Carrello',
      cartPage: 'Pagina del carrello',
      cartDrawer: 'Carrello',
      lineItems: 'Articoli',
      emptyBody:
        'Sembra che tu non abbia ancora aggiunto nulla, iniziamo subito!',
      continueShopping: 'Continua lo shopping →',
      lineItemsWith: (title: string) => `Articoli con ${title}`,
      quantity: (n: number) => `Quantità: ${n}`,
      decreaseQuantity: 'Diminuisci quantità',
      increaseQuantity: 'Aumenta quantità',
      remove: 'Rimuovi',
      totals: 'Totale',
      subtotal: 'Subtotale',
      discounts: 'Sconti',
      discountCode: 'Codice sconto',
      apply: 'Applica',
      removeDiscount: 'Rimuovi sconto',
      applyDiscountCode: 'Applica codice sconto',
      continueToCheckout: 'Vai al checkout →',
      giftCards: 'Carte regalo',
      appliedGiftCards: 'Carte regalo applicate',
      giftCardCode: 'Codice carta regalo',
      applyGiftCardCode: 'Applica carta regalo',
      removeGiftCard: (last: string) => `Rimuovi la carta regalo che termina in ${last}`,
    },
    wishlistPage: {
      laTuaWishlist: 'La tua Wishlist',
      title: 'Wishlist',
      empty:
        'Non hai ancora salvato nessun prodotto. Tocca il cuore su un prodotto per aggiungerlo qui.',
      scopriIProdotti: 'Scopri i prodotti',
      potrebberoPiacertiAnche: 'Potrebbero piacerti anche',
    },
    about: {
      metaTitle: 'Anyma Beauty | Nostra Storia',
      heroTitle: 'Nostra Storia',
      heroSubtitle:
        "Dalla ribellione all'identità: perché esiste ANYMA BEAUTY, e perché non esiste una sola te.",
      originEyebrow: 'Da dove nasce tutto',
      originTitle: "Dalla ribellione all'identità",
      originP1:
        'Il nostro progetto ha mosso i primi passi con un nome che parlava di rottura: Mad Beauty. Volevamo ribellarci, scuotere le fondamenta di un settore diventato improvvisamente troppo rigido, noioso e privo di gioia. Ma durante questo viaggio di analisi e scoperta, abbiamo compreso che la vera rivoluzione non sta nella follia.',
      originQuote1: 'La vera rivoluzione è la verità.',
      originQuote2: "È l'identità.",
      originP2:
        "Non si tratta di essere insoliti a tutti i costi. Si tratta di essere incredibilmente sé stesse. Da questa consapevolezza è nata ANYMA BEAUTY: il primo ecosistema italiano in cui estetica, identità e crescita si incontrano per darti lo spazio e gli strumenti per esprimerti. Senza scuse.",
      voidEyebrow: 'Il vuoto che abbiamo visto',
      voidTitle: 'Un mercato di pack identici',
      voidP1:
        'Ci siamo guardati intorno. Abbiamo analizzato il mercato del trucco e la sua comunicazione. La verità? Tutto appariva spaventosamente omologato. Nero, oro, trasparente, rosa: i packaging dei grandi marchi si somigliano tutti, scatole di plastica fredde che finiscono dentro confezioni di cartone destinate a essere gettate via in pochi secondi.',
      voidP2:
        "Ma il vuoto più grande non era visivo, era emotivo. Il beauty tradizionale parla continuamente del tubetto, mai di te. Leggiamo formule chimiche, pigmenti ad altissima tenuta e promesse di volume immediato. Ma non una sola parola su come ti senti davvero davanti allo specchio alle 7:30 del mattino, o sull'energia che cerchi quando apri la tua trousse.",
      voidP3:
        'Il momento del trucco è stato rubato alle persone, ridotto a una routine meccanica ed estetica per nascondersi, eseguita in fretta per rispettare una norma sociale.',
      voidQuote1: 'Noi abbiamo visto questo vuoto.',
      voidQuote2: 'E abbiamo deciso di restituirti il tuo momento.',
      truthEyebrow: 'La verità fondamentale',
      truthTitle: 'Non esiste una sola te',
      truthP1:
        "Lo sai benissimo ogni mattina quando apri l'armadio: la versione di te del lunedì mattina non è la stessa del venerdì sera o della domenica pomeriggio. Cambiamo mood, energia, linguaggio, estetica. Un giorno ci sentiamo audaci, decise e regali; un altro più leggere, giocose, sensibili; un altro ancora effortless e libere.",
      truthQuote1: 'La bellezza non è coerenza.',
      truthQuote2: 'È verità.',
      truthP2:
        'Siamo creature molteplici, e la molteplicità è la nostra spina dorsale. Per questo non ti chiediamo di trovare te stessa o di accettarti in una gabbia statica. Ti diamo la libertà e gli strumenti per diventare la versione di te che scegli di essere oggi.',
      truthListLeopard: 'per i giorni di energia feroce e presenza assoluta.',
      truthListCandyRosa:
        'per i momenti in cui decidi che la leggerezza è il tuo atto di coraggio più grande.',
      truthListStreet: 'per muoverti nel mondo a tuo agio ovunque, senza filtri.',
      craftEyebrow: 'La nostra unicità',
      craftTitle: 'Tecnologia emotiva made in Italy',
      craftP1:
        "I nostri prodotti non sono semplici cosmetici: sono oggetti d'arte e di status che parlano di te prima ancora che tu apra bocca.",
      craftP2:
        'Grazie a una tecnologia di decorazione proprietaria ed esclusiva, applichiamo grafiche ad altissimo impatto visivo direttamente sul metallo del prodotto, non sulla scatola esterna. Ogni tubetto è realizzato in alluminio premium con la nostra iconica finitura goldrose custom. Inoltre, calibriamo con precisione i contrappesi tecnici interni: in questo modo, quando prendi in mano un prodotto ANYMA, il tuo corpo ne percepisce la solidità e il valore reale prima ancora che la mente lo razionalizzi.',
      craftP3:
        "Le nostre formule, create e certificate in Italia, sono all'avanguardia ed eccellenti. Ma nel nostro e-commerce, la formula va in secondo piano: la qualità è il prerequisito non negoziabile che rende sicura e magnifica la tua scelta.",
      labEyebrow: 'I nostri laboratori',
      labTitle: 'Creato a Milano. Curato per te.',
      labP1:
        "Ogni formula nasce nei nostri laboratori esclusivi nel cuore di Milano, dove la tradizione cosmetica italiana incontra gli standard più rigorosi dell'Unione Europea.",
      labP2:
        "Non ci limitiamo a scegliere ingredienti. Li studiamo, li testiamo, li riformuliamo fino a quando ogni texture, ogni colore, ogni nota olfattiva risponde a un unico criterio: essere all'altezza dell'anima che lo conterrà.",
      labP3:
        'I nostri laboratori sono il luogo dove il rossetto cessa di essere un prodotto e diventa uno strumento. Dove il finish di un lip gloss viene calibrato alla luce naturale, non sotto i neon di un ufficio. Dove un mascara viene testato nella vita reale, non solo in laboratorio.',
      labP4:
        "Ogni formula ANYMA BEAUTY è conforme al Regolamento (CE) n. 1223/2009 dell'Unione Europea, il quadro normativo più severo al mondo in materia di sicurezza cosmetica. Ma la conformità è il punto di partenza, non il traguardo. Noi andiamo oltre: selezioniamo materie prime italiane ed europee, evitiamo scorciatoie industriali e trattiamo ogni lotto come se fosse l'unico.",
      labP5:
        'Il risultato è una formula che non ha bisogno di raccontarsi, perché si sente. Al primo tocco. Al primo gesto. Al primo sguardo allo specchio.',
      labQuote: 'Stessa cura. Stessa formula. Anime diverse.',
      closingTitle: 'Benvenuta tra le Anyme',
      closingP:
        'Chi entra nell\'universo di ANYMA BEAUTY non diventa cliente: entra a far parte di un sistema narrativo. Non ti chiameremo mai "cara cliente" o "consumatrice". Tu sei un\'Anyma della nostra crew. E le anyme non si contano. Crescono.',
      closingQuote1: 'Scegli la tua anyma.',
      closingQuote2: 'Rivela chi sei.',
    },
    careers: {
      metaTitle: 'Anyma Beauty | Lavora con noi',
      eyebrow: 'Lavora con noi',
      title: 'Entra nel mondo Anyma',
      body: 'Siamo sempre alla ricerca di persone che credono in ciò che facciamo: un make-up che non nasconde chi sei, ma lo rivela. Se pensi che il tuo talento possa aggiungere qualcosa ad Anyma Beauty, scrivici e raccontaci di te.',
      cta: 'Invia la tua candidatura',
    },
    pack: {
      componiIlTuoPack: 'Componi il tuo Pack',
      subtitle: (name: string) =>
        `Un rossetto, un gloss, un mascara: la tua Anyma ${name} in una sola scatola.`,
      ilPackaging: 'Il packaging:',
      scarcity:
        'Solo ~42 pezzi al mondo per questa combinazione, lotto di pre-lancio di 800 unità.',
      bullet1: "Rituale completo: i tre gesti della tua giornata, un'unica energia.",
      bullet2: "Spedizione sempre gratuita su tutto l'ordine.",
      bullet3: 'ANYMA Tote Bag in omaggio con ogni trittico.',
      totalePack: 'Totale Pack',
      vaiAlPagamento: 'Vai al pagamento',
      attitudeLeopard:
        "Leopard è l'anima di chi occupa il proprio spazio senza chiedere scusa: presenza magnetica, grinta che protegge la sensibilità invece di nasconderla.",
      packagingLeopard:
        'Sculture in alluminio e acrilico: velatura bronzo-dorata, macchie leopardate in rilievo, chevron dorato lucido.',
      attitudeCandyRosa:
        'Candy Rosa è per i giorni in cui la dolcezza è la tua forza più grande: tenerezza ribelle che trasforma la sensibilità in energia gioiosa.',
      packagingCandyRosa:
        'Finitura oro rosa custom con tappi rosa opaco, motivo paisley pastello e chevron dorato.',
      attitudeStreet:
        "Street è l'anima di chi è a proprio agio ovunque, senza pose: bellezza reale, spontanea, in movimento.",
      packagingStreet:
        'Texture denim azzurro con cuciture arancioni a contrasto e patch in pelle marrone, delimitata dal chevron dorato.',
    },
    allProducts: {
      metaTitle: 'Anyma Beauty | Tutti i Prodotti',
      title: 'Tutti i Prodotti',
    },
  },
  EN: {
    header: {
      marqueeDiscount: 'Exclusive discount when you sign up',
      marqueeShipping: 'Shipping in 48h',
      leAnyme: 'The Anyme',
      tutteLeAnyme: 'All the Anyme',
      packPerAnyme: 'Packs by Anyma',
      cercaPerProdotto: 'Search by product',
      rossetti: 'Lipsticks',
      lipGloss: 'Lip Gloss',
      mascaraEyeliner: 'Mascara & Eyeliner',
      laNostraStoria: 'Our story',
      chiudiMenu: 'Close menu',
      apriMenu: 'Open menu',
      account: 'Account',
      wishlist: 'Wishlist',
      cart: 'Cart',
    },
    footer: {
      rivelaChiSei: 'Reveal who you are',
      laNostraStoria: 'Our Story',
      areaLegale: 'Legal',
      lavoraConNoi: 'Work with us',
      rightsReserved: 'All rights reserved',
    },
    support: {
      close: 'Close',
      trackOrder: 'Track your order',
      trackOrderBody:
        "Enter your order number and the email you used to purchase: we'll reply with your shipping status.",
      orderNumberPlaceholder: 'Order number (e.g. #1234)',
      orderEmailPlaceholder: 'Order email',
      send: 'Send',
      trackOrderSubject: 'Track my order',
      returnOrder: 'Online Returns',
      returnOrderHeadline: 'How do I return an item?',
      returnOrderBody:
        'You have 14 days from delivery to request a return. The product must be sealed and unused. Enter your order number and email: we\'ll reply within 48 hours with return shipping instructions.',
      sendRequest: 'Send request',
      returnRequestSubject: 'Return request',
      returnItemsLabel: 'Item(s) to return: ',
    },
    cookies: {
      ariaLabel: 'Cookie preferences',
      body: 'We use technical cookies necessary for the site to function and, with your consent, analytics and marketing cookies. See our',
      privacyPolicy: 'Privacy Policy',
      bodyEnd: 'for more information.',
      reject: 'Reject',
      acceptAll: 'Accept all',
    },
    login: {
      accedi: 'Log in',
      chiudiAccesso: 'Close login',
      accediAlTuoAccount: 'Log in to your account',
      email: 'Email',
      continua: 'Continue',
      nonHaiAccount: "Don't have an account?",
      registrati: 'Sign up',
      passwordDimenticata: 'Forgot your password?',
    },
    search: {
      cerca: 'Search',
      chiudiRicerca: 'Close search',
      placeholder: 'Search products, souls...',
      ricercheRecenti: 'Recent searches',
      rimuoviDallaCronologia: (t: string) => `Remove "${t}" from history`,
      ricercaInCorso: 'Searching…',
      nessunRisultato: (q: string) => `No results for "${q}"`,
      caricamento: 'Loading…',
      precedenti: '↑ Previous',
      altriProdotti: 'More products ↓',
      nessunRisultatoGenerico: 'No results. Try a different search.',
      prodotti: 'Products',
      pagine: 'Pages',
      articoli: 'Articles',
    },
    gallery: {
      previous: 'Previous photo',
      next: 'Next photo',
      goTo: (n: number) => `Go to photo ${n}`,
    },
    account: {
      welcome: (name: string) => `Welcome, ${name}`,
      welcomeGeneric: 'Welcome to your account.',
      accountDetails: 'Account Details',
      orders: 'Orders',
      profile: 'Profile',
      addresses: 'Addresses',
      signOut: 'Sign out',
      clearFilters: 'Clear filters →',
      startShopping: 'Start Shopping →',
      viewOrder: 'View Order →',
      noOrdersFiltered: 'No orders found matching your search.',
      noOrdersYet: "You haven't placed any orders yet.",
      registrati: 'Sign up',
      loadingCart: 'Loading cart…',
      cartHeading: 'CART',
      menuHeading: 'MENU',
    },
    policiesPage: {
      backToPolicies: '← Back to Policies',
    },
    communityVideos: {
      title: 'The community wears it',
      more: 'More community videos coming soon, follow',
      onTikTok: 'on TikTok.',
    },
    rating: {
      noReviewsYet: 'No reviews yet',
      outOf5: (rating: number) => `${rating} out of 5 Anyme`,
      summary: (rating: string, count: number) =>
        `${rating} · ${count} ${count === 1 ? 'review' : 'reviews'}`,
    },
    wishlist: {
      remove: 'Remove from favorites',
      add: 'Add to favorites',
    },
    product: {
      addToCart: 'Add to cart',
      soldOut: 'Sold out',
    },
    hero: {
      slides: [
        {
          title: 'The first identity beauty',
          tagline: "You're not choosing a simple cosmetic: you're choosing who you want to be today.",
        },
        {
          title: "Beauty is not consistency. It's truth.",
          tagline: 'Your multiplicity is your greatest power. Reveal it without apologies.',
        },
        {
          title: 'Who do you want to be today?',
          tagline: 'Choose your soul. Your aluminum object will follow.',
        },
        {
          title: "This isn't make-up. It's your ritual.",
          tagline:
            'We turn the everyday gesture in front of the mirror into an act of pure self-determination.',
        },
        {
          title: 'Objects of art that speak about you',
          tagline: 'Solid aluminum, goldrose finish, and the physical signature of your identity.',
        },
        {
          title: 'We give you the tools to become',
          tagline:
            'One day fierce like Leopard, one day free like Street, one day light like Candy.',
        },
        {
          title: 'Reveal your soul',
          tagline: 'Identity objects made in Italy to give voice to every version of you.',
        },
      ],
      discoverAnyme: 'Discover your Anyme',
      shopNow: 'Shop Now',
    },
    animaGrid: {
      le6Anyme: 'The 6 Anyme',
      scegliLaTuaAnyma: 'Choose your Anyma',
      subtitle:
        "Every Anyma has its own aesthetic. The pack you choose isn't a container: it's a symbol.",
      compraIlPack: 'Shop the Pack',
    },
    brandStory: {
      quote: "There isn't just one you.",
      body: "We reveal souls through make-up. We don't sell lipsticks. We create the objects people tell their story with, every day.",
      cta: 'Discover our story',
    },
    founders: {
      postiLimitati: 'Limited spots',
      title: 'Become Anyma Prima',
      subtitle:
        'Free shipping for life, a numbered card, 15% welcome discount: only for the first 800 anyme.',
      countOf: (total: number) => `of ${total} anyme already in`,
      thanks: "Thanks — we'll let you know when your spot opens up.",
      emailPlaceholder: 'Your email',
      reserveSpot: 'Reserve your spot',
    },
    philosophy: {
      truthQuote: 'Beauty is not consistency.',
      truthSubquote: "It's truth.",
      identityQuote: 'Personality',
      identitySubquote: 'has no color.',
    },
    meta: {
      homeTitle: 'Anyma Beauty | Reveal who you are',
      homeDescription:
        'Anyma Beauty, make-up with personality. Choose your Anyma, then your color.',
    },
    collection: {
      cambiaLaTuaAnyma: 'Change your Anyma',
      anymaLabel: (name: string) => `Anyma ${name}`,
      inArrivo: 'Coming soon',
    },
    pdp: {
      cambiaAnymaStessoColore: 'Change Anyma, same color',
      altriColori: (name: string) => `More colors · Anyma ${name}`,
      guardaloAddosso: 'See it on',
      unRitualeCompleto: 'A complete ritual',
      ritualeBody: (name: string) =>
        `Lipstick, gloss and mascara designed to complete each other. Discover the Anyma ${name} trio and take home the whole experience.`,
      trittico: (name: string) => `Anyma ${name} Trio`,
      componiIlTuoPack: 'Build your Pack →',
      videoInArrivo: 'Video coming soon',
      inArrivo: 'Coming soon',
      descrizione: 'Description',
      applicazione: 'How to apply',
      formula: 'Formula',
      anatomia: 'Anatomy',
      ingredienti: 'Ingredients',
      ingredientiInArrivo: 'Ingredients list coming soon.',
      tiPotrebberoAncePiacere: 'You might also like',
    },
    social: {
      seguici: 'Follow us',
      guardaciSu: 'Find us on',
      body: "Backstage, textures, souls in motion: the most real side of the brand lives on social, even before the shop.",
      segui: (handle: string) => `Follow ${handle}`,
    },
    productsByType: {
      cercaPerProdotto: 'Search by product',
      subtitle: 'The same gesture, across every Anyme. Find your color.',
      vediPerAnyma: 'View by Anyma',
      vediPerColore: 'View by color',
      nessunProdotto: 'No products found in this category.',
    },
    cart: {
      title: 'Cart',
      cartPage: 'Cart page',
      cartDrawer: 'Cart drawer',
      lineItems: 'Line items',
      emptyBody:
        "Looks like you haven't added anything yet, let's get you started!",
      continueShopping: 'Continue shopping →',
      lineItemsWith: (title: string) => `Line items with ${title}`,
      quantity: (n: number) => `Quantity: ${n}`,
      decreaseQuantity: 'Decrease quantity',
      increaseQuantity: 'Increase quantity',
      remove: 'Remove',
      totals: 'Totals',
      subtotal: 'Subtotal',
      discounts: 'Discounts',
      discountCode: 'Discount code',
      apply: 'Apply',
      removeDiscount: 'Remove discount',
      applyDiscountCode: 'Apply discount code',
      continueToCheckout: 'Continue to Checkout →',
      giftCards: 'Gift cards',
      appliedGiftCards: 'Applied Gift Card(s)',
      giftCardCode: 'Gift card code',
      applyGiftCardCode: 'Apply gift card code',
      removeGiftCard: (last: string) => `Remove gift card ending in ${last}`,
    },
    wishlistPage: {
      laTuaWishlist: 'Your Wishlist',
      title: 'Wishlist',
      empty:
        "You haven't saved any products yet. Tap the heart on a product to add it here.",
      scopriIProdotti: 'Discover our products',
      potrebberoPiacertiAnche: 'You might also like',
    },
    about: {
      metaTitle: 'Anyma Beauty | Our Story',
      heroTitle: 'Our Story',
      heroSubtitle:
        "From rebellion to identity: why ANYMA BEAUTY exists, and why there isn't just one you.",
      originEyebrow: 'Where it all began',
      originTitle: 'From rebellion to identity',
      originP1:
        "Our project took its first steps under a name that spoke of rupture: Mad Beauty. We wanted to rebel, to shake the foundations of an industry that had suddenly become too rigid, too dull, stripped of joy. But along this journey of analysis and discovery, we understood that the real revolution doesn't lie in madness.",
      originQuote1: 'The real revolution is truth.',
      originQuote2: "It's identity.",
      originP2:
        "It's not about being unusual at all costs. It's about being incredibly yourself. From this awareness, ANYMA BEAUTY was born: the first Italian ecosystem where aesthetics, identity and growth meet to give you the space and the tools to express yourself. No apologies.",
      voidEyebrow: 'The void we saw',
      voidTitle: 'A market of identical packs',
      voidP1:
        "We looked around. We analyzed the make-up market and how it spoke to people. The truth? Everything looked frighteningly homogenized. Black, gold, clear, pink: big brands' packaging all look alike, cold plastic cases tucked inside cardboard boxes destined to be thrown away in seconds.",
      voidP2:
        "But the biggest void wasn't visual, it was emotional. Traditional beauty talks endlessly about the tube, never about you. We read chemical formulas, ultra-long-lasting pigments, promises of instant volume. But not a single word about how you actually feel in front of the mirror at 7:30 in the morning, or the energy you're looking for when you open your makeup bag.",
      voidP3:
        "The ritual of make-up was stolen from people, reduced to a mechanical routine, an aesthetic to hide behind, rushed through just to meet a social norm.",
      voidQuote1: 'We saw this void.',
      voidQuote2: 'And we decided to give you back your moment.',
      truthEyebrow: 'The fundamental truth',
      truthTitle: "There isn't just one you",
      truthP1:
        "You know it perfectly well every morning when you open your closet: the version of you on Monday morning isn't the same as Friday night or Sunday afternoon. We shift mood, energy, language, aesthetic. One day we feel bold, decisive, regal; another lighter, playful, sensitive; another still effortless and free.",
      truthQuote1: 'Beauty is not consistency.',
      truthQuote2: "It's truth.",
      truthP2:
        "We are multiple creatures, and multiplicity is our backbone. That's why we don't ask you to find yourself or accept yourself inside a static cage. We give you the freedom and the tools to become the version of you that you choose to be today.",
      truthListLeopard: 'for days of fierce energy and absolute presence.',
      truthListCandyRosa:
        'for the moments you decide lightness is your greatest act of courage.',
      truthListStreet: 'to move through the world at ease anywhere, no filters.',
      craftEyebrow: 'What makes us unique',
      craftTitle: 'Emotional technology, made in Italy',
      craftP1:
        "Our products aren't simple cosmetics: they're objects of art and status that speak about you before you even open your mouth.",
      craftP2:
        "Thanks to a proprietary, exclusive decoration technology, we apply high-impact graphics directly onto the product's metal, not onto the outer box. Every tube is made from premium aluminum with our iconic custom goldrose finish. We also precisely calibrate the internal technical counterweights: this way, when you pick up an ANYMA product, your body perceives its solidity and real value before your mind even rationalizes it.",
      craftP3:
        'Our formulas, created and certified in Italy, are cutting-edge and excellent. But on our e-commerce, the formula takes a back seat: quality is the non-negotiable prerequisite that makes your choice safe and magnificent.',
      labEyebrow: 'Our labs',
      labTitle: 'Created in Milan. Curated for you.',
      labP1:
        'Every formula is born in our exclusive labs in the heart of Milan, where Italian cosmetic tradition meets the strictest standards of the European Union.',
      labP2:
        "We don't just choose ingredients. We study them, test them, reformulate them until every texture, every color, every scent note answers to a single criterion: being worthy of the soul that will hold it.",
      labP3:
        "Our labs are where a lipstick stops being a product and becomes a tool. Where a lip gloss finish is calibrated in natural light, not under office neon. Where a mascara is tested in real life, not just in the lab.",
      labP4:
        'Every ANYMA BEAUTY formula complies with EU Regulation (EC) No. 1223/2009, the strictest regulatory framework in the world for cosmetic safety. But compliance is the starting point, not the finish line. We go further: we select Italian and European raw materials, avoid industrial shortcuts, and treat every batch as if it were the only one.',
      labP5:
        "The result is a formula that doesn't need to explain itself, because you feel it. At the first touch. At the first gesture. At the first look in the mirror.",
      labQuote: 'Same care. Same formula. Different souls.',
      closingTitle: 'Welcome among the Anyme',
      closingP:
        'Whoever enters the ANYMA BEAUTY universe doesn\'t become a customer: they become part of a narrative system. We will never call you "dear customer" or "consumer." You are an Anyma of our crew. And anyme aren\'t counted. They grow.',
      closingQuote1: 'Choose your anyma.',
      closingQuote2: 'Reveal who you are.',
    },
    careers: {
      metaTitle: 'Anyma Beauty | Work with us',
      eyebrow: 'Work with us',
      title: 'Step into the Anyma world',
      body: "We're always looking for people who believe in what we do: make-up that doesn't hide who you are, but reveals it. If you think your talent could add something to Anyma Beauty, write to us and tell us about yourself.",
      cta: 'Send your application',
    },
    pack: {
      componiIlTuoPack: 'Build your Pack',
      subtitle: (name: string) =>
        `A lipstick, a gloss, a mascara: your Anyma ${name} in a single box.`,
      ilPackaging: 'The packaging:',
      scarcity:
        'Only ~42 pieces in the world for this combination, from an 800-unit pre-launch batch.',
      bullet1: 'A complete ritual: the three gestures of your day, one single energy.',
      bullet2: 'Always free shipping on the whole order.',
      bullet3: 'A free ANYMA Tote Bag with every trio.',
      totalePack: 'Pack total',
      vaiAlPagamento: 'Go to checkout',
      attitudeLeopard:
        "Leopard is the soul of someone who takes up her own space without apologizing: magnetic presence, grit that protects sensitivity instead of hiding it.",
      packagingLeopard:
        'Sculptures in aluminum and acrylic: bronze-gold glaze, raised leopard spots, glossy gold chevron.',
      attitudeCandyRosa:
        'Candy Rosa is for the days when sweetness is your greatest strength: rebellious tenderness that turns sensitivity into joyful energy.',
      packagingCandyRosa:
        'Custom rose-gold finish with matte pink caps, pastel paisley pattern and gold chevron.',
      attitudeStreet:
        'Street is the soul of someone at ease anywhere, no poses: real beauty, spontaneous, in motion.',
      packagingStreet:
        'Light-denim texture with contrast orange stitching and a brown leather patch, framed by the gold chevron.',
    },
    allProducts: {
      metaTitle: 'Anyma Beauty | All Products',
      title: 'All Products',
    },
  },
  ES: {
    header: {
      marqueeDiscount: 'Descuento exclusivo al suscribirte',
      marqueeShipping: 'Envío en 48h',
      leAnyme: 'Las Anyme',
      tutteLeAnyme: 'Todas las Anyme',
      packPerAnyme: 'Packs por Anyma',
      cercaPerProdotto: 'Buscar por producto',
      rossetti: 'Labiales',
      lipGloss: 'Lip Gloss',
      mascaraEyeliner: 'Máscara & Eyeliner',
      laNostraStoria: 'Nuestra historia',
      chiudiMenu: 'Cerrar menú',
      apriMenu: 'Abrir menú',
      account: 'Cuenta',
      wishlist: 'Lista de deseos',
      cart: 'Carrito',
    },
    footer: {
      rivelaChiSei: 'Revela quién eres',
      laNostraStoria: 'Nuestra Historia',
      areaLegale: 'Legal',
      lavoraConNoi: 'Trabaja con nosotros',
      rightsReserved: 'Todos los derechos reservados',
    },
    support: {
      close: 'Cerrar',
      trackOrder: 'Monitorea tu pedido',
      trackOrderBody:
        'Ingresa el número de pedido y el email usado en la compra: te responderemos con el estado del envío.',
      orderNumberPlaceholder: 'Número de pedido (ej. #1234)',
      orderEmailPlaceholder: 'Email del pedido',
      send: 'Enviar',
      trackOrderSubject: 'Monitorea mi pedido',
      returnOrder: 'Devolución Online',
      returnOrderHeadline: '¿Cómo puedo devolver el artículo?',
      returnOrderBody:
        'Tienes 14 días desde la recepción para solicitar la devolución. El producto debe estar precintado y sin usar. Ingresa el número de pedido y el email: te responderemos en 48 horas con las instrucciones para el envío de vuelta.',
      sendRequest: 'Enviar solicitud',
      returnRequestSubject: 'Solicitud de devolución',
      returnItemsLabel: 'Producto(s) a devolver: ',
    },
    cookies: {
      ariaLabel: 'Preferencias de cookies',
      body: 'Utilizamos cookies técnicas necesarias para el funcionamiento del sitio y, con tu consentimiento, cookies de análisis y marketing. Consulta la',
      privacyPolicy: 'Política de Privacidad',
      bodyEnd: 'para más información.',
      reject: 'Rechazar',
      acceptAll: 'Aceptar todo',
    },
    login: {
      accedi: 'Iniciar sesión',
      chiudiAccesso: 'Cerrar acceso',
      accediAlTuoAccount: 'Accede a tu cuenta',
      email: 'Email',
      continua: 'Continuar',
      nonHaiAccount: '¿No tienes una cuenta?',
      registrati: 'Regístrate',
      passwordDimenticata: '¿Olvidaste tu contraseña?',
    },
    search: {
      cerca: 'Buscar',
      chiudiRicerca: 'Cerrar búsqueda',
      placeholder: 'Busca productos, anime...',
      ricercheRecenti: 'Búsquedas recientes',
      rimuoviDallaCronologia: (t: string) => `Quitar "${t}" del historial`,
      ricercaInCorso: 'Buscando…',
      nessunRisultato: (q: string) => `Sin resultados para «${q}»`,
      caricamento: 'Cargando…',
      precedenti: '↑ Anteriores',
      altriProdotti: 'Más productos ↓',
      nessunRisultatoGenerico: 'Sin resultados. Prueba con otra búsqueda.',
      prodotti: 'Productos',
      pagine: 'Páginas',
      articoli: 'Artículos',
    },
    gallery: {
      previous: 'Foto anterior',
      next: 'Foto siguiente',
      goTo: (n: number) => `Ir a la foto ${n}`,
    },
    account: {
      welcome: (name: string) => `Bienvenida, ${name}`,
      welcomeGeneric: 'Bienvenida a tu cuenta.',
      accountDetails: 'Detalles de la cuenta',
      orders: 'Pedidos',
      profile: 'Perfil',
      addresses: 'Direcciones',
      signOut: 'Cerrar sesión',
      clearFilters: 'Quitar filtros →',
      startShopping: 'Empezar a comprar →',
      viewOrder: 'Ver pedido →',
      noOrdersFiltered: 'No se encontraron pedidos para esta búsqueda.',
      noOrdersYet: 'Todavía no has realizado ningún pedido.',
      registrati: 'Regístrate',
      loadingCart: 'Cargando carrito…',
      cartHeading: 'CARRITO',
      menuHeading: 'MENÚ',
    },
    policiesPage: {
      backToPolicies: '← Volver a las Policy',
    },
    communityVideos: {
      title: 'La community lo lleva puesto',
      more: 'Más videos de la community muy pronto, sigue a',
      onTikTok: 'en TikTok.',
    },
    rating: {
      noReviewsYet: 'Todavía no hay reseñas',
      outOf5: (rating: number) => `${rating} de 5 Anyme`,
      summary: (rating: string, count: number) =>
        `${rating} · ${count} ${count === 1 ? 'reseña' : 'reseñas'}`,
    },
    wishlist: {
      remove: 'Quitar de favoritos',
      add: 'Añadir a favoritos',
    },
    product: {
      addToCart: 'Añadir al carrito',
      soldOut: 'Agotado',
    },
    hero: {
      slides: [
        {
          title: 'El primer beauty identitario',
          tagline: 'No eliges un simple cosmético: eliges quién quieres ser hoy.',
        },
        {
          title: 'La belleza no es coherencia. Es verdad.',
          tagline: 'Tu multiplicidad es tu mayor poder. Revélala sin excusas.',
        },
        {
          title: '¿Quién quieres ser hoy?',
          tagline: 'Elige tu alma. Tu objeto en aluminio te seguirá.',
        },
        {
          title: 'Esto no es maquillaje. Es tu ritual.',
          tagline:
            'Transformamos el gesto cotidiano ante el espejo en un acto de pura autodeterminación.',
        },
        {
          title: 'Objetos de arte que hablan de ti',
          tagline: 'Aluminio macizo, acabado goldrose y la firma física de tu identidad.',
        },
        {
          title: 'Te damos las herramientas para convertirte',
          tagline:
            'Un día fiera como Leopard, un día libre como Street, un día ligera como Candy.',
        },
        {
          title: 'Reveal your soul',
          tagline: 'Objetos identitarios creados en Italia para dar voz a todas las versiones de ti.',
        },
      ],
      discoverAnyme: 'Descubre tus Anyme',
      shopNow: 'Comprar ahora',
    },
    animaGrid: {
      le6Anyme: 'Las 6 Anyme',
      scegliLaTuaAnyma: 'Elige tu Anyma',
      subtitle:
        'Cada Anyma tiene su propia estética. El pack que eliges no es un envase: es un símbolo.',
      compraIlPack: 'Comprar el Pack',
    },
    brandStory: {
      quote: 'No existe una sola tú.',
      body: 'Revelamos las anyme a través del maquillaje. No vendemos labiales. Creamos los objetos con los que las personas se cuentan a sí mismas cada día.',
      cta: 'Descubre nuestra historia',
    },
    founders: {
      postiLimitati: 'Cupos limitados',
      title: 'Conviértete en Anyma Prima',
      subtitle:
        'Envío de por vida, tarjeta numerada, 15% de bienvenida: solo para las primeras 800 anyme.',
      countOf: (total: number) => `de ${total} anyme ya dentro`,
      thanks: 'Gracias, te avisaremos cuando se abra tu cupo.',
      emailPlaceholder: 'Tu email',
      reserveSpot: 'Reserva tu cupo',
    },
    philosophy: {
      truthQuote: 'La belleza no es coherencia.',
      truthSubquote: 'Es verdad.',
      identityQuote: 'La personalidad',
      identitySubquote: 'no tiene color.',
    },
    meta: {
      homeTitle: 'Anyma Beauty | Revela quién eres',
      homeDescription:
        'Anyma Beauty, el maquillaje con personalidad. Elige tu Anyma, luego el color.',
    },
    collection: {
      cambiaLaTuaAnyma: 'Cambia tu Anyma',
      anymaLabel: (name: string) => `Anyma ${name}`,
      inArrivo: 'Próximamente',
    },
    pdp: {
      cambiaAnymaStessoColore: 'Cambia de Anyma, mismo color',
      altriColori: (name: string) => `Más colores · Anyma ${name}`,
      guardaloAddosso: 'Míralo puesto',
      unRitualeCompleto: 'Un ritual completo',
      ritualeBody: (name: string) =>
        `Labial, gloss y máscara pensados para complementarse. Descubre el trío Anyma ${name} y llévate la experiencia completa.`,
      trittico: (name: string) => `Trío Anyma ${name}`,
      componiIlTuoPack: 'Arma tu Pack →',
      videoInArrivo: 'Video próximamente',
      inArrivo: 'Muy pronto',
      descrizione: 'Descripción',
      applicazione: 'Aplicación',
      formula: 'Fórmula',
      anatomia: 'Anatomía',
      ingredienti: 'Ingredientes',
      ingredientiInArrivo: 'Lista de ingredientes muy pronto.',
      tiPotrebberoAncePiacere: 'También te podría gustar',
    },
    social: {
      seguici: 'Síguenos',
      guardaciSu: 'Míranos en',
      body: 'Backstage, texturas, anyme en movimiento: la parte más real de la marca vive en las redes, incluso antes que en la tienda.',
      segui: (handle: string) => `Sigue ${handle}`,
    },
    productsByType: {
      cercaPerProdotto: 'Buscar por producto',
      subtitle: 'El mismo gesto, en todas las Anyme. Encuentra tu color.',
      vediPerAnyma: 'Ver por Anyma',
      vediPerColore: 'Ver por color',
      nessunProdotto: 'No se encontraron productos en esta categoría.',
    },
    cart: {
      title: 'Carrito',
      cartPage: 'Página del carrito',
      cartDrawer: 'Carrito',
      lineItems: 'Artículos',
      emptyBody: 'Parece que aún no has agregado nada, ¡empecemos!',
      continueShopping: 'Seguir comprando →',
      lineItemsWith: (title: string) => `Artículos con ${title}`,
      quantity: (n: number) => `Cantidad: ${n}`,
      decreaseQuantity: 'Disminuir cantidad',
      increaseQuantity: 'Aumentar cantidad',
      remove: 'Quitar',
      totals: 'Total',
      subtotal: 'Subtotal',
      discounts: 'Descuentos',
      discountCode: 'Código de descuento',
      apply: 'Aplicar',
      removeDiscount: 'Quitar descuento',
      applyDiscountCode: 'Aplicar código de descuento',
      continueToCheckout: 'Continuar al pago →',
      giftCards: 'Tarjetas de regalo',
      appliedGiftCards: 'Tarjetas de regalo aplicadas',
      giftCardCode: 'Código de tarjeta de regalo',
      applyGiftCardCode: 'Aplicar tarjeta de regalo',
      removeGiftCard: (last: string) => `Quitar la tarjeta de regalo que termina en ${last}`,
    },
    wishlistPage: {
      laTuaWishlist: 'Tu Wishlist',
      title: 'Wishlist',
      empty:
        'Todavía no has guardado ningún producto. Toca el corazón en un producto para agregarlo aquí.',
      scopriIProdotti: 'Descubre los productos',
      potrebberoPiacertiAnche: 'También te podría gustar',
    },
    about: {
      metaTitle: 'Anyma Beauty | Nuestra Historia',
      heroTitle: 'Nuestra Historia',
      heroSubtitle:
        'De la rebeldía a la identidad: por qué existe ANYMA BEAUTY, y por qué no existe una sola tú.',
      originEyebrow: 'De dónde nace todo',
      originTitle: 'De la rebeldía a la identidad',
      originP1:
        'Nuestro proyecto dio sus primeros pasos con un nombre que hablaba de ruptura: Mad Beauty. Queríamos rebelarnos, sacudir los cimientos de un sector que de repente se había vuelto demasiado rígido, aburrido y sin alegría. Pero en este viaje de análisis y descubrimiento, comprendimos que la verdadera revolución no está en la locura.',
      originQuote1: 'La verdadera revolución es la verdad.',
      originQuote2: 'Es la identidad.',
      originP2:
        'No se trata de ser insólita a toda costa. Se trata de ser increíblemente tú misma. De esta conciencia nació ANYMA BEAUTY: el primer ecosistema italiano donde estética, identidad y crecimiento se encuentran para darte el espacio y las herramientas para expresarte. Sin disculpas.',
      voidEyebrow: 'El vacío que vimos',
      voidTitle: 'Un mercado de packs idénticos',
      voidP1:
        'Miramos a nuestro alrededor. Analizamos el mercado del maquillaje y su comunicación. ¿La verdad? Todo parecía espantosamente homologado. Negro, dorado, transparente, rosa: los packagings de las grandes marcas se parecen todos, cajas de plástico frío que terminan dentro de envases de cartón destinados a ser tirados en segundos.',
      voidP2:
        'Pero el vacío más grande no era visual, era emocional. El beauty tradicional habla continuamente del tubo, nunca de ti. Leemos fórmulas químicas, pigmentos de altísima fijación y promesas de volumen inmediato. Pero ni una sola palabra sobre cómo te sientes realmente frente al espejo a las 7:30 de la mañana, o sobre la energía que buscas cuando abres tu neceser.',
      voidP3:
        'El momento del maquillaje fue robado a las personas, reducido a una rutina mecánica y estética para esconderse, realizada deprisa para cumplir una norma social.',
      voidQuote1: 'Nosotros vimos este vacío.',
      voidQuote2: 'Y decidimos devolverte tu momento.',
      truthEyebrow: 'La verdad fundamental',
      truthTitle: 'No existe una sola tú',
      truthP1:
        'Lo sabes perfectamente cada mañana cuando abres el armario: la versión de ti del lunes por la mañana no es la misma que la del viernes por la noche o la del domingo por la tarde. Cambiamos de ánimo, energía, lenguaje, estética. Un día nos sentimos audaces, decididas y regias; otro más ligeras, juguetonas, sensibles; otro todavía effortless y libres.',
      truthQuote1: 'La belleza no es coherencia.',
      truthQuote2: 'Es verdad.',
      truthP2:
        'Somos criaturas múltiples, y la multiplicidad es nuestra columna vertebral. Por eso no te pedimos que te encuentres a ti misma ni que te aceptes en una jaula estática. Te damos la libertad y las herramientas para convertirte en la versión de ti que eliges ser hoy.',
      truthListLeopard: 'para los días de energía feroz y presencia absoluta.',
      truthListCandyRosa:
        'para los momentos en que decides que la ligereza es tu acto de valentía más grande.',
      truthListStreet: 'para moverte por el mundo a gusto en cualquier lugar, sin filtros.',
      craftEyebrow: 'Nuestra singularidad',
      craftTitle: 'Tecnología emocional hecha en Italia',
      craftP1:
        'Nuestros productos no son simples cosméticos: son objetos de arte y de estatus que hablan de ti antes de que abras la boca.',
      craftP2:
        'Gracias a una tecnología de decoración propia y exclusiva, aplicamos gráficas de altísimo impacto visual directamente sobre el metal del producto, no sobre la caja exterior. Cada tubo está hecho en aluminio premium con nuestro icónico acabado goldrose personalizado. Además, calibramos con precisión los contrapesos técnicos internos: así, cuando tomas en tus manos un producto ANYMA, tu cuerpo percibe su solidez y su valor real antes de que la mente lo racionalice.',
      craftP3:
        'Nuestras fórmulas, creadas y certificadas en Italia, son vanguardistas y excelentes. Pero en nuestro e-commerce, la fórmula pasa a un segundo plano: la calidad es el prerrequisito no negociable que hace segura y magnífica tu elección.',
      labEyebrow: 'Nuestros laboratorios',
      labTitle: 'Creado en Milán. Cuidado para ti.',
      labP1:
        'Cada fórmula nace en nuestros laboratorios exclusivos en el corazón de Milán, donde la tradición cosmética italiana se encuentra con los estándares más rigurosos de la Unión Europea.',
      labP2:
        'No nos limitamos a elegir ingredientes. Los estudiamos, los probamos, los reformulamos hasta que cada textura, cada color, cada nota olfativa responde a un único criterio: estar a la altura del alma que lo contendrá.',
      labP3:
        'Nuestros laboratorios son el lugar donde el labial deja de ser un producto y se convierte en una herramienta. Donde el acabado de un gloss se calibra con luz natural, no bajo los neones de una oficina. Donde una máscara se prueba en la vida real, no solo en el laboratorio.',
      labP4:
        'Cada fórmula ANYMA BEAUTY cumple con el Reglamento (CE) n.º 1223/2009 de la Unión Europea, el marco normativo más estricto del mundo en materia de seguridad cosmética. Pero el cumplimiento es el punto de partida, no la meta. Nosotros vamos más allá: seleccionamos materias primas italianas y europeas, evitamos atajos industriales y tratamos cada lote como si fuera el único.',
      labP5:
        'El resultado es una fórmula que no necesita contarse, porque se siente. Al primer toque. Al primer gesto. A la primera mirada al espejo.',
      labQuote: 'Mismo cuidado. Misma fórmula. Almas distintas.',
      closingTitle: 'Bienvenida entre las Anyme',
      closingP:
        'Quien entra en el universo de ANYMA BEAUTY no se convierte en clienta: pasa a formar parte de un sistema narrativo. Nunca te llamaremos "estimada clienta" ni "consumidora". Tú eres una Anyma de nuestra crew. Y las anyme no se cuentan. Crecen.',
      closingQuote1: 'Elige tu anyma.',
      closingQuote2: 'Revela quién eres.',
    },
    careers: {
      metaTitle: 'Anyma Beauty | Trabaja con nosotros',
      eyebrow: 'Trabaja con nosotros',
      title: 'Entra en el mundo Anyma',
      body: 'Siempre estamos buscando personas que crean en lo que hacemos: un maquillaje que no esconde quién eres, sino que lo revela. Si crees que tu talento puede sumar algo a Anyma Beauty, escríbenos y cuéntanos sobre ti.',
      cta: 'Envía tu candidatura',
    },
    pack: {
      componiIlTuoPack: 'Arma tu Pack',
      subtitle: (name: string) =>
        `Un labial, un gloss, una máscara: tu Anyma ${name} en una sola caja.`,
      ilPackaging: 'El packaging:',
      scarcity:
        'Solo ~42 piezas en el mundo para esta combinación, lote de pre-lanzamiento de 800 unidades.',
      bullet1: 'Ritual completo: los tres gestos de tu día, una sola energía.',
      bullet2: 'Envío siempre gratuito en todo el pedido.',
      bullet3: 'ANYMA Tote Bag de regalo con cada trío.',
      totalePack: 'Total del Pack',
      vaiAlPagamento: 'Ir al pago',
      attitudeLeopard:
        'Leopard es el alma de quien ocupa su propio espacio sin pedir disculpas: presencia magnética, garra que protege la sensibilidad en lugar de esconderla.',
      packagingLeopard:
        'Esculturas en aluminio y acrílico: veladura bronce-dorada, manchas de leopardo en relieve, chevron dorado brillante.',
      attitudeCandyRosa:
        'Candy Rosa es para los días en que la dulzura es tu mayor fortaleza: ternura rebelde que transforma la sensibilidad en energía alegre.',
      packagingCandyRosa:
        'Acabado oro rosa personalizado con tapas rosa mate, motivo paisley pastel y chevron dorado.',
      attitudeStreet:
        'Street es el alma de quien está a gusto en cualquier lugar, sin poses: belleza real, espontánea, en movimiento.',
      packagingStreet:
        'Textura denim celeste con costuras naranjas de contraste y parche de cuero marrón, enmarcado por el chevron dorado.',
    },
    allProducts: {
      metaTitle: 'Anyma Beauty | Todos los Productos',
      title: 'Todos los Productos',
    },
  },
} as const;
