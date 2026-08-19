import type {Route} from './+types/about';
import {ScrollReveal} from '~/components/ScrollReveal';
import {ParallaxImage} from '~/components/ParallaxImage';
import lipsHero from '~/assets/images/story/lips-hero.webp';
import sketchDesk from '~/assets/images/story/sketch-desk.webp';
import sketchHand from '~/assets/images/story/sketch-hand.webp';
import render3d from '~/assets/images/story/render-3d.webp';
import diversity from '~/assets/images/story/diversity.webp';
import productMacro from '~/assets/images/story/product-macro.webp';
import flatlay from '~/assets/images/story/flatlay.webp';
import lineup from '~/assets/images/story/lineup.webp';
import lifestyleMilano from '~/assets/images/story/lifestyle-milano.webp';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Anyma Beauty | Nostra Storia'}];
};

export default function About() {
  return (
    <div className="bg-paper">
      <StoryHero />
      <StorySectionOrigin />
      <StorySectionVoid />
      <StorySectionTruth />
      <StorySectionCraft />
      <StorySectionClosing />
    </div>
  );
}

function StoryHero() {
  return (
    <header className="grid grid-cols-1 sm:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 sm:py-24">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-gold">
          Anyma Beauty
        </p>
        <h1 className="font-display text-5xl uppercase leading-[1.05] tracking-[0.02em] text-nero sm:text-6xl">
          Nostra Storia
        </h1>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-nero/70">
          Dalla ribellione all&rsquo;identità: perché esiste ANYMA BEAUTY, e
          perché non esiste una sola te.
        </p>
      </div>
      <ParallaxImage
        src={lipsHero}
        strength={50}
        objectPosition="top"
        className="aspect-[4/5] sm:aspect-auto sm:h-full"
      />
    </header>
  );
}

function StorySectionOrigin() {
  return (
    <section className="grid grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2 sm:gap-16 sm:px-12 sm:py-24">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <ScrollReveal
          direction="left"
          className="aspect-[3/4] w-full overflow-hidden rounded"
        >
          <ParallaxImage src={sketchDesk} strength={22} className="h-full" />
        </ScrollReveal>
        <ScrollReveal
          direction="right"
          delay={120}
          className="mt-8 aspect-[3/4] w-full overflow-hidden rounded"
        >
          <ParallaxImage src={sketchHand} strength={22} className="h-full" />
        </ScrollReveal>
        <ScrollReveal
          direction="up"
          delay={240}
          className="col-span-2 aspect-[16/10] w-full overflow-hidden rounded"
        >
          <ParallaxImage src={render3d} strength={30} className="h-full" />
        </ScrollReveal>
      </div>
      <div className="flex flex-col justify-center">
        <ScrollReveal direction="up">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold">
            Da dove nasce tutto
          </p>
          <h2 className="font-display text-3xl uppercase leading-tight tracking-[0.02em] text-nero sm:text-4xl">
            Dalla ribellione all&rsquo;identità
          </h2>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={100}>
          <p className="mt-6 text-sm leading-relaxed text-nero/80">
            Il nostro progetto ha mosso i primi passi con un nome che parlava
            di rottura: Mad Beauty. Volevamo ribellarci, scuotere le
            fondamenta di un settore diventato improvvisamente troppo
            rigido, noioso e privo di gioia. Ma durante questo viaggio di
            analisi e scoperta, abbiamo compreso che la vera rivoluzione non
            sta nella follia.
          </p>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={150}>
          <p className="font-display mt-6 text-2xl uppercase leading-snug tracking-[0.01em] text-nero">
            La vera rivoluzione è la verità.
            <br />È l&rsquo;identità.
          </p>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={200}>
          <p className="mt-6 text-sm leading-relaxed text-nero/80">
            Non si tratta di essere insoliti a tutti i costi. Si tratta di
            essere incredibilmente sé stesse. Da questa consapevolezza è
            nata ANYMA BEAUTY: il primo ecosistema italiano in cui estetica,
            identità e crescita si incontrano per darti lo spazio e gli
            strumenti per esprimerti. Senza scuse.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

function StorySectionVoid() {
  return (
    <section className="bg-nero px-6 py-16 text-paper sm:px-12 sm:py-24">
      <ScrollReveal direction="up" className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold">
          Il vuoto che abbiamo visto
        </p>
        <h2 className="font-display text-3xl uppercase leading-tight tracking-[0.02em] text-white sm:text-4xl">
          Un mercato di pack identici
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-white/75">
          Ci siamo guardati intorno. Abbiamo analizzato il mercato del trucco
          e la sua comunicazione. La verità? Tutto appariva spaventosamente
          omologato. Nero, oro, trasparente, rosa: i packaging dei grandi
          marchi si somigliano tutti, scatole di plastica fredde che
          finiscono dentro confezioni di cartone destinate a essere gettate
          via in pochi secondi.
        </p>
        <p className="mt-6 text-sm leading-relaxed text-white/75">
          Ma il vuoto più grande non era visivo, era emotivo. Il beauty
          tradizionale parla continuamente del tubetto, mai di te. Leggiamo
          formule chimiche, pigmenti ad altissima tenuta e promesse di
          volume immediato. Ma non una sola parola su come ti senti davvero
          davanti allo specchio alle 7:30 del mattino, o sull&rsquo;energia
          che cerchi quando apri la tua trousse.
        </p>
        <p className="mt-6 text-sm leading-relaxed text-white/75">
          Il momento del trucco è stato rubato alle persone, ridotto a una
          routine meccanica ed estetica per nascondersi, eseguita in fretta
          per rispettare una norma sociale.
        </p>
        <p className="font-display mt-8 text-2xl uppercase leading-snug tracking-[0.01em] text-gold">
          Noi abbiamo visto questo vuoto.
          <br />E abbiamo deciso di restituirti il tuo momento.
        </p>
      </ScrollReveal>
    </section>
  );
}

function StorySectionTruth() {
  return (
    <section className="grid grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2 sm:gap-16 sm:px-12 sm:py-24">
      <ScrollReveal
        direction="left"
        className="order-2 flex flex-col justify-center sm:order-1"
      >
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold">
          La verità fondamentale
        </p>
        <h2 className="font-display text-3xl uppercase leading-tight tracking-[0.02em] text-nero sm:text-4xl">
          Non esiste una sola te
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-nero/80">
          Lo sai benissimo ogni mattina quando apri l&rsquo;armadio: la
          versione di te del lunedì mattina non è la stessa del venerdì sera
          o della domenica pomeriggio. Cambiamo mood, energia, linguaggio,
          estetica. Un giorno ci sentiamo audaci, decise e regali; un altro
          più leggere, giocose, sensibili; un altro ancora effortless e
          libere.
        </p>
        <p className="font-display mt-6 text-2xl uppercase leading-snug tracking-[0.01em] text-nero">
          La bellezza non è coerenza.
          <br />È verità.
        </p>
        <p className="mt-6 text-sm leading-relaxed text-nero/80">
          Siamo creature molteplici, e la molteplicità è la nostra spina
          dorsale. Per questo non ti chiediamo di trovare te stessa o di
          accettarti in una gabbia statica. Ti diamo la libertà e gli
          strumenti per diventare la versione di te che scegli di essere
          oggi.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-nero/80">
          <li>
            <span className="text-gold">Leopard</span> per i giorni di
            energia feroce e presenza assoluta.
          </li>
          <li>
            <span className="text-gold">Candy Rosa</span> per i momenti in
            cui decidi che la leggerezza è il tuo atto di coraggio più
            grande.
          </li>
          <li>
            <span className="text-gold">Street</span> per muoverti nel mondo
            a tuo agio ovunque, senza filtri.
          </li>
        </ul>
      </ScrollReveal>
      <ScrollReveal
        direction="right"
        className="order-1 relative aspect-[4/3] overflow-hidden sm:order-2 sm:aspect-auto"
      >
        <ParallaxImage src={diversity} strength={26} className="h-full" />
      </ScrollReveal>
    </section>
  );
}

function StorySectionCraft() {
  return (
    <section className="px-6 py-16 sm:px-12 sm:py-24">
      <ScrollReveal direction="up" className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold">
          La nostra unicità
        </p>
        <h2 className="font-display text-3xl uppercase leading-tight tracking-[0.02em] text-nero sm:text-4xl">
          Tecnologia emotiva made in Italy
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-nero/80">
          I nostri prodotti non sono semplici cosmetici: sono oggetti
          d&rsquo;arte e di status che parlano di te prima ancora che tu apra
          bocca.
        </p>
        <p className="mt-6 text-sm leading-relaxed text-nero/80">
          Grazie a una tecnologia di decorazione proprietaria ed esclusiva,
          applichiamo grafiche ad altissimo impatto visivo direttamente sul
          metallo del prodotto, non sulla scatola esterna. Ogni tubetto è
          realizzato in alluminio premium con la nostra iconica finitura
          goldrose custom. Inoltre, calibriamo con precisione i contrappesi
          tecnici interni: in questo modo, quando prendi in mano un prodotto
          ANYMA, il tuo corpo ne percepisce la solidità e il valore reale
          prima ancora che la mente lo razionalizzi.
        </p>
        <p className="mt-6 text-sm leading-relaxed text-nero/80">
          Le nostre formule, create e certificate in Italia, sono
          all&rsquo;avanguardia ed eccellenti. Ma nel nostro e-commerce, la
          formula va in secondo piano: la qualità è il prerequisito non
          negoziabile che rende sicura e magnifica la tua scelta.
        </p>
      </ScrollReveal>
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <ScrollReveal
          direction="up"
          className="aspect-[3/4] w-full overflow-hidden rounded"
        >
          <ParallaxImage src={productMacro} strength={24} className="h-full" />
        </ScrollReveal>
        <ScrollReveal
          direction="down"
          delay={120}
          className="aspect-[3/4] w-full overflow-hidden rounded"
        >
          <ParallaxImage src={flatlay} strength={24} className="h-full" />
        </ScrollReveal>
        <ScrollReveal
          direction="up"
          delay={240}
          className="col-span-2 aspect-[16/9] w-full overflow-hidden rounded sm:col-span-1 sm:aspect-[3/4]"
        >
          <ParallaxImage src={lineup} strength={24} className="h-full" />
        </ScrollReveal>
      </div>
    </section>
  );
}

function StorySectionClosing() {
  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden sm:min-h-[86vh]">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <ParallaxImage src={lifestyleMilano} strength={60} className="h-full" />
      </div>
      <div className="absolute inset-0 bg-[rgba(35,31,32,0.45)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-nero/90 via-nero/40 to-transparent" />
      <ScrollReveal
        direction="up"
        className="relative z-10 px-6 pb-16 sm:px-12 sm:pb-24"
      >
        <h2 className="font-display text-4xl uppercase leading-[1.05] tracking-[0.02em] text-white sm:text-6xl">
          Benvenuta tra le Anyme
        </h2>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-white">
          Chi entra nell&rsquo;universo di ANYMA BEAUTY non diventa cliente:
          entra a far parte di un sistema narrativo. Non ti chiameremo mai
          &ldquo;cara cliente&rdquo; o &ldquo;consumatrice&rdquo;. Tu sei
          un&rsquo;Anyma della nostra crew. E le anyme non si contano.
          Crescono.
        </p>
        <h3 className="font-display mt-6 text-2xl uppercase leading-tight tracking-[0.02em] text-gold sm:text-3xl">
          Scegli la tua anyma.
          <br />
          Rivela chi sei.
        </h3>
        <a
          href="/#anime"
          className="mt-8 inline-block border border-white bg-[rgba(35,31,32,0.7)] px-8 py-3 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-nero"
        >
          Scopri le tue Anyme
        </a>
      </ScrollReveal>
    </section>
  );
}
