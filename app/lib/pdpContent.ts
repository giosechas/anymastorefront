import type {LocaleCode} from '~/lib/locale';
import {getCategoryKey, getSkuColorKey} from '~/lib/skuData';

type Category = 'LIPSTICK' | 'GLOSS' | 'MASCARA';

/**
 * The 4 PDP content blocks below the poetic story (see ANYMA_PDP_CONTENT.md).
 * `descrizione` is color-specific; `applicazione`/`formula`/`anatomia` are
 * shared across every color within a category. Source copy is Italian;
 * EN/ES are hand-translated keeping the same tone (identity over technique,
 * ritual over routine — no "rivoluzionario"/"imperdibile" style claims).
 */
const DESCRIZIONE: Record<LocaleCode, Record<Category, Record<string, string>>> = {
  IT: {
    LIPSTICK: {
      NUDE: 'Un gesto, un colore, una scelta. Il rossetto ANYMA BEAUTY in Nude non copre: rivela. Una tonalità calda e neutra che si adatta a ogni carnagione perché non impone nulla — accompagna. La finitura Pearly Gloss cattura la luce con discrezione, come un segreto visibile solo a chi sa guardare.',
      'RED METAL': 'Il rossetto che non si mette: si dichiara. Red Metal è un rosso metallico che trasforma il gesto quotidiano in un atto di presenza. Non chiede attenzione — la prende. La finitura Metallic riflette la luce come una superficie che sa di essere guardata.',
      VIOLET: "Profondo come una decisione presa in silenzio. Violet è il colore di chi abita lo spazio tra luce e ombra senza chiedere il permesso. La finitura Pearly Gloss aggiunge una luminosità interiore che non si impone — si scopre.",
      CHERRY: 'Vivido, immediato, senza ripensamenti. Cherry è il rossetto di chi agisce prima di spiegare. Un rosso ciliegia che arriva prima delle parole. La finitura Pearly Gloss gli dona una profondità che va oltre la superficie.',
    },
    GLOSS: {
      PINK: 'Il riflesso che non chiede il permesso di brillare. Pink è un gloss con finitura Super Pearly che cattura ogni luce nella stanza e la restituisce come qualcosa di personale. Luminoso, pieno, con una texture che si sente prima ancora di vedersi.',
      'LIGHT GOLD': "L'oro che non si ostenta — si indossa. Light Gold è il gloss di chi sa che la luce più convincente è quella che sembra naturale. Finitura Pearly Gloss, consistenza avvolgente, un calore che non ha bisogno di giustificarsi.",
      CHOCOLATE: 'La profondità di chi sa aspettare. Chocolate è un gloss perlato color cioccolato caldo che rallenta il tempo ogni volta che lo applichi. Avvolgente, ricco, con una presenza che non si impone — si rivela.',
      CHERRY: 'L’intensità che non si spiega. Cherry è un gloss perlato dal rosso ciliegia vibrante che arriva prima di te nella stanza. Non chiede scusa e non ne ha bisogno.',
    },
    MASCARA: {
      'SUPER BLACK': 'Lo sguardo che non abbassa gli occhi. Super Black è un mascara con pigmentazione intensa e profonda che definisce ogni ciglia senza appesantirla. Non aggiunge volume per il volume — aggiunge intenzione. Lo applichi e i tuoi occhi dicono quello che scegli di non dire a parole.',
      PERVINCA: 'Il colore che nessuno si aspetta e tutti ricordano. Pervinca è un mascara blu-viola che trasforma lo sguardo in una scelta. Sottile, elegante, per chi ha capito che la differenza non si costruisce gridando — si costruisce scegliendo qualcosa che gli altri non avrebbero il coraggio di scegliere.',
    },
  },
  EN: {
    LIPSTICK: {
      NUDE: "One gesture, one color, one choice. The ANYMA BEAUTY lipstick in Nude doesn't cover: it reveals. A warm, neutral shade that suits every skin tone because it imposes nothing — it accompanies. The Pearly Gloss finish catches the light with discretion, like a secret visible only to those who know how to look.",
      'RED METAL': "The lipstick that isn't worn: it's declared. Red Metal is a metallic red that turns the everyday gesture into an act of presence. It doesn't ask for attention — it takes it. The Metallic finish reflects light like a surface that knows it's being watched.",
      VIOLET: "Deep as a decision made in silence. Violet is the color of those who inhabit the space between light and shadow without asking permission. The Pearly Gloss finish adds an inner luminosity that doesn't impose itself — it's discovered.",
      CHERRY: 'Vivid, immediate, without second thoughts. Cherry is the lipstick of those who act before explaining. A cherry red that arrives before the words do. The Pearly Gloss finish gives it a depth that goes beyond the surface.',
    },
    GLOSS: {
      PINK: "The reflection that doesn't ask permission to shine. Pink is a gloss with a Super Pearly finish that catches every light in the room and gives it back as something personal. Luminous, full, with a texture you feel before you even see it.",
      'LIGHT GOLD': "The gold that isn't flaunted — it's worn. Light Gold is the gloss for those who know the most convincing light is the one that looks natural. Pearly Gloss finish, an enveloping texture, a warmth that needs no justification.",
      CHOCOLATE: "The depth of someone who knows how to wait. Chocolate is a pearly gloss in warm chocolate brown that slows down time with every application. Enveloping, rich, with a presence that doesn't impose itself — it reveals itself.",
      CHERRY: "The intensity that doesn't explain itself. Cherry is a pearly gloss in vibrant cherry red that enters the room before you do. It doesn't ask for forgiveness, and it doesn't need to.",
    },
    MASCARA: {
      'SUPER BLACK': "The gaze that doesn't lower its eyes. Super Black is a mascara with deep, intense pigmentation that defines every lash without weighing it down. It doesn't add volume for the sake of volume — it adds intention. You apply it, and your eyes say what you choose not to say in words.",
      PERVINCA: "The color no one expects and everyone remembers. Pervinca is a blue-violet mascara that turns a look into a choice. Subtle, elegant, for those who've understood that difference isn't built by shouting — it's built by choosing something others wouldn't have the courage to choose.",
    },
  },
  ES: {
    LIPSTICK: {
      NUDE: 'Un gesto, un color, una elección. El labial ANYMA BEAUTY en Nude no cubre: revela. Un tono cálido y neutro que se adapta a cada piel porque no impone nada — acompaña. El acabado Pearly Gloss captura la luz con discreción, como un secreto visible solo para quien sabe mirar.',
      'RED METAL': 'El labial que no se pone: se declara. Red Metal es un rojo metálico que convierte el gesto cotidiano en un acto de presencia. No pide atención — la toma. El acabado Metallic refleja la luz como una superficie que sabe que la están mirando.',
      VIOLET: 'Profundo como una decisión tomada en silencio. Violet es el color de quien habita el espacio entre la luz y la sombra sin pedir permiso. El acabado Pearly Gloss añade una luminosidad interior que no se impone — se descubre.',
      CHERRY: 'Vívido, inmediato, sin arrepentimientos. Cherry es el labial de quien actúa antes de explicar. Un rojo cereza que llega antes que las palabras. El acabado Pearly Gloss le da una profundidad que va más allá de la superficie.',
    },
    GLOSS: {
      PINK: 'El reflejo que no pide permiso para brillar. Pink es un gloss con acabado Super Pearly que captura cada luz de la sala y la devuelve como algo personal. Luminoso, pleno, con una textura que se siente antes incluso de verse.',
      'LIGHT GOLD': 'El oro que no se ostenta — se lleva puesto. Light Gold es el gloss de quien sabe que la luz más convincente es la que parece natural. Acabado Pearly Gloss, textura envolvente, una calidez que no necesita justificarse.',
      CHOCOLATE: 'La profundidad de quien sabe esperar. Chocolate es un gloss perlado color chocolate cálido que ralentiza el tiempo cada vez que lo aplicas. Envolvente, rico, con una presencia que no se impone — se revela.',
      CHERRY: 'La intensidad que no se explica. Cherry es un gloss perlado de rojo cereza vibrante que entra en la sala antes que tú. No pide disculpas y no las necesita.',
    },
    MASCARA: {
      'SUPER BLACK': 'La mirada que no baja los ojos. Super Black es una máscara con pigmentación intensa y profunda que define cada pestaña sin cargarla. No añade volumen por el volumen — añade intención. Te la aplicas y tus ojos dicen lo que decides no decir con palabras.',
      PERVINCA: 'El color que nadie espera y todos recuerdan. Pervinca es una máscara azul-violeta que convierte la mirada en una elección. Sutil, elegante, para quien ha entendido que la diferencia no se construye gritando — se construye eligiendo algo que otros no tendrían el coraje de elegir.',
    },
  },
};

const APPLICAZIONE: Record<LocaleCode, Record<Category, string>> = {
  IT: {
    LIPSTICK: "Applica partendo dal centro del labbro superiore e procedi verso gli angoli con un gesto sicuro. Per un effetto naturale, una sola passata. Per una presenza piena, stratifica con un secondo passaggio. Non serve uno specchio — serve un'intenzione.",
    GLOSS: "Applica con l'applicatore doe-foot partendo dal centro del labbro inferiore. Un passaggio per una luminosità naturale. Due passaggi per una presenza piena. Sopra il rossetto ANYMA per un finish multidimensionale — il gloss esalta, il rossetto definisce.",
    MASCARA: "Posiziona lo scovolino alla radice delle ciglia superiori. Muovi con piccoli movimenti a zig-zag dalla base alle punte. Per le ciglia inferiori, usa la punta dello scovolino con gesti verticali. Un passaggio per definizione naturale. Due per intensità piena. Non c'è un modo sbagliato — c'è il tuo.",
  },
  EN: {
    LIPSTICK: "Apply starting from the center of the upper lip and work outward toward the corners with a confident gesture. For a natural effect, one pass. For a full presence, layer with a second pass. You don't need a mirror — you need an intention.",
    GLOSS: 'Apply with the doe-foot applicator starting from the center of the lower lip. One pass for natural luminosity. Two passes for a full presence. Layer over ANYMA lipstick for a multidimensional finish — the gloss enhances, the lipstick defines.',
    MASCARA: "Place the wand at the root of the upper lashes. Move in small zig-zag motions from base to tip. For lower lashes, use the tip of the wand with vertical strokes. One pass for natural definition. Two for full intensity. There's no wrong way — there's your way.",
  },
  ES: {
    LIPSTICK: 'Aplica empezando por el centro del labio superior y avanza hacia las comisuras con un gesto seguro. Para un efecto natural, una sola pasada. Para una presencia plena, superpón con una segunda pasada. No necesitas un espejo — necesitas una intención.',
    GLOSS: 'Aplica con el aplicador doe-foot empezando por el centro del labio inferior. Una pasada para una luminosidad natural. Dos pasadas para una presencia plena. Encima del labial ANYMA para un acabado multidimensional — el gloss resalta, el labial define.',
    MASCARA: 'Coloca el cepillo en la raíz de las pestañas superiores. Muévelo en pequeños zig-zags de la base a las puntas. Para las pestañas inferiores, usa la punta del cepillo con gestos verticales. Una pasada para una definición natural. Dos para una intensidad plena. No hay una forma equivocada — está la tuya.',
  },
};

const FORMULA: Record<LocaleCode, Record<Category, string>> = {
  IT: {
    LIPSTICK: "Arricchito con un aroma di zucchero ghiacciato e bubble gum che trasforma l'applicazione in un momento sensoriale. Non è un profumo: è il ricordo di qualcosa di dolce che sta per accadere. Formula sviluppata nei nostri laboratori esclusivi di Milano, conforme al Regolamento (CE) n. 1223/2009.",
    GLOSS: "Aroma di zucchero ghiacciato e bubble gum che trasforma ogni applicazione in un'esperienza sensoriale. La formula con finitura perlata si fonde sulle labbra senza appiccicare, lasciando una sensazione di comfort e un effetto luminoso a lunga durata. Sviluppata nei laboratori ANYMA BEAUTY di Milano.",
    MASCARA: 'Formula volumizzante e allungante con aroma di zucchero ghiacciato e bubble gum. Le setole dello scovolino a spirale catturano ogni singola ciglia, rilasciando la giusta quantità di prodotto per un risultato definito e naturale. Sviluppata nei laboratori ANYMA BEAUTY di Milano, conforme al Regolamento (CE) n. 1223/2009.',
  },
  EN: {
    LIPSTICK: "Enriched with a frozen-sugar-and-bubble-gum scent that turns application into a sensory moment. It's not a fragrance: it's the memory of something sweet about to happen. Formula developed in our exclusive Milan laboratories, compliant with Regulation (EC) No. 1223/2009.",
    GLOSS: "A frozen-sugar-and-bubble-gum scent that turns every application into a sensory experience. The pearly-finish formula melts onto lips without stickiness, leaving a feeling of comfort and a long-lasting luminous effect. Developed in ANYMA BEAUTY's Milan laboratories.",
    MASCARA: "A volumizing, lengthening formula with a frozen-sugar-and-bubble-gum scent. The spiral wand's bristles catch every single lash, releasing just the right amount of product for a defined, natural result. Developed in ANYMA BEAUTY's Milan laboratories, compliant with Regulation (EC) No. 1223/2009.",
  },
  ES: {
    LIPSTICK: 'Enriquecido con un aroma a azúcar helado y bubble gum que convierte la aplicación en un momento sensorial. No es un perfume: es el recuerdo de algo dulce que está por suceder. Fórmula desarrollada en nuestros laboratorios exclusivos de Milán, conforme al Reglamento (CE) n.º 1223/2009.',
    GLOSS: 'Aroma a azúcar helado y bubble gum que convierte cada aplicación en una experiencia sensorial. La fórmula con acabado perlado se fusiona con los labios sin sensación pegajosa, dejando una sensación de confort y un efecto luminoso de larga duración. Desarrollada en los laboratorios ANYMA BEAUTY de Milán.',
    MASCARA: 'Fórmula voluminizadora y alargadora con aroma a azúcar helado y bubble gum. Las cerdas del cepillo en espiral capturan cada pestaña, liberando la cantidad justa de producto para un resultado definido y natural. Desarrollada en los laboratorios ANYMA BEAUTY de Milán, conforme al Reglamento (CE) n.º 1223/2009.',
  },
};

const ANATOMIA: Record<LocaleCode, Record<Category, string>> = {
  IT: {
    LIPSTICK: "Tubo quadrato in materiale composito, 7,3 × 2 × 2 cm. Esterno rivestito nella grafica dell'anima scelta con bordure geometriche chevron in oro riflettente. Interno con cilindro dorato che ospita il bullet con taglio classico angolato. Logo ANYMA BEAUTY integrato nel design del packaging.",
    GLOSS: "Tubo quadrato, 12 × 1,8 × 1,8 cm. Parte superiore rivestita nella grafica dell'anima con bordure chevron dorate. Parte inferiore in acrilico trasparente a parete spessa che lascia intravedere il colore del gloss. Applicatore doe-foot integrato nel tappo. Logo ANYMA BEAUTY nel design del cappuccio.",
    MASCARA: "Tubo quadrato, 12,5 × 1,8 × 1,8 cm. Esterno completamente rivestito nella grafica dell'anima con linee geometriche chevron dorate su tappo, giunto centrale e base. Scovolino a spirale classico con setole specifiche per colore. Logo ANYMA BEAUTY integrato nel packaging.",
  },
  EN: {
    LIPSTICK: "Square tube in composite material, 7.3 × 2 × 2 cm. Exterior finished in the chosen anima's graphic with reflective gold chevron trim. Gold-toned interior cylinder housing the bullet with a classic angled cut. ANYMA BEAUTY logo built into the packaging design.",
    GLOSS: "Square tube, 12 × 1.8 × 1.8 cm. Upper section finished in the anima's graphic with gold chevron trim. Lower section in thick-walled clear acrylic that reveals the gloss color inside. Doe-foot applicator built into the cap. ANYMA BEAUTY logo on the cap design.",
    MASCARA: "Square tube, 12.5 × 1.8 × 1.8 cm. Exterior fully finished in the anima's graphic with gold geometric chevron lines on the cap, center joint and base. Classic spiral wand with bristles specific to each color. ANYMA BEAUTY logo built into the packaging.",
  },
  ES: {
    LIPSTICK: 'Tubo cuadrado en material compuesto, 7,3 × 2 × 2 cm. Exterior revestido con la gráfica del alma elegida y bordes geométricos chevron en oro reflectante. Interior con cilindro dorado que alberga la barra con corte clásico angulado. Logo ANYMA BEAUTY integrado en el diseño del packaging.',
    GLOSS: 'Tubo cuadrado, 12 × 1,8 × 1,8 cm. Parte superior revestida con la gráfica del alma y bordes chevron dorados. Parte inferior en acrílico transparente de pared gruesa que deja ver el color del gloss. Aplicador doe-foot integrado en el tapón. Logo ANYMA BEAUTY en el diseño del tapón.',
    MASCARA: 'Tubo cuadrado, 12,5 × 1,8 × 1,8 cm. Exterior completamente revestido con la gráfica del alma y líneas geométricas chevron doradas en el tapón, la unión central y la base. Cepillo en espiral clásico con cerdas específicas para cada color. Logo ANYMA BEAUTY integrado en el packaging.',
  },
};

export function getPdpDescrizione(
  productType: string,
  colorTag: string | undefined,
  locale: LocaleCode,
): string | undefined {
  const category = getCategoryKey(productType);
  const color = getSkuColorKey(colorTag);
  if (!category || !color) return undefined;
  return DESCRIZIONE[locale]?.[category]?.[color] ?? DESCRIZIONE.IT[category]?.[color];
}

export function getPdpApplicazione(
  productType: string,
  locale: LocaleCode,
): string | undefined {
  const category = getCategoryKey(productType);
  if (!category) return undefined;
  return APPLICAZIONE[locale]?.[category] ?? APPLICAZIONE.IT[category];
}

export function getPdpFormula(
  productType: string,
  locale: LocaleCode,
): string | undefined {
  const category = getCategoryKey(productType);
  if (!category) return undefined;
  return FORMULA[locale]?.[category] ?? FORMULA.IT[category];
}

export function getPdpAnatomia(
  productType: string,
  locale: LocaleCode,
): string | undefined {
  const category = getCategoryKey(productType);
  if (!category) return undefined;
  return ANATOMIA[locale]?.[category] ?? ANATOMIA.IT[category];
}
