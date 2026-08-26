import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense, useEffect, useRef, useState} from 'react';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {MockShopNotice} from '~/components/MockShopNotice';
import {ScrollReveal} from '~/components/ScrollReveal';
import {useParallaxOffset} from '~/hooks/useParallaxOffset';
import {
  ANIME,
  getAnimaGalleryImages,
  getPackPath,
  type AnimaDefinition,
} from '~/lib/animas';
import heroImage1 from '~/assets/images/hero/hero-1.webp';
import heroImage3 from '~/assets/images/hero/hero-3.webp';
import heroImage5 from '~/assets/images/hero/hero-5.webp';
import heroImage6 from '~/assets/images/hero/hero-6.webp';
import heroImage8 from '~/assets/images/hero/hero-8.webp';
import heroImage9 from '~/assets/images/hero/hero-9.webp';
import heroImage10 from '~/assets/images/hero/hero-10.webp';
import heroImage11 from '~/assets/images/hero/hero-11.webp';
import heroImage12 from '~/assets/images/hero/hero-12.webp';
import sealPositive from '~/assets/images/seal-y-positive.png';
import sealNegative from '~/assets/images/seal-y-negative.png';
import philosophyTruth1 from '~/assets/images/philosophy/pool/truth1.webp';
import philosophyTruth2 from '~/assets/images/philosophy/pool/truth2.webp';
import philosophyTruth3 from '~/assets/images/philosophy/pool/truth3.webp';
import philosophyTruth4 from '~/assets/images/philosophy/pool/truth4.webp';
import philosophyIdentity1 from '~/assets/images/philosophy/pool/identity1.webp';
import philosophyIdentity2 from '~/assets/images/philosophy/pool/identity2.webp';
import philosophyIdentity3 from '~/assets/images/philosophy/pool/identity3.webp';
import founderImage1 from '~/assets/images/founders/founder-1.webp';
import logoWhite from '~/assets/anyma-logo-wordmark-white.png';

const PHILOSOPHY_TRUTH_IMAGES = [
  philosophyTruth1,
  philosophyTruth2,
  philosophyTruth3,
  philosophyTruth4,
];
const PHILOSOPHY_IDENTITY_IMAGES = [
  philosophyIdentity1,
  philosophyIdentity2,
  philosophyIdentity3,
];
const PHILOSOPHY_ROTATE_MS = 4000;

// More founder-campaign photos will land here over time — the section
// crossfades through whatever is in this array.
const FOUNDERS_IMAGES = [founderImage1];
const FOUNDERS_ROTATE_MS = 6000;
// Placeholder until real signups are wired in.
const FOUNDERS_REGISTERED = 247;
const FOUNDERS_TOTAL = 800;

const HERO_IMAGES = [
  heroImage1,
  heroImage3,
  heroImage5,
  heroImage6,
  heroImage8,
  heroImage9,
  heroImage10,
  heroImage11,
  heroImage12,
];
const HERO_ROTATE_MS = 5000;

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Anyma Beauty | Rivela chi sei'},
    {
      name: 'description',
      content:
        'Anyma Beauty — il make-up con personalità. Scegli la tua Anyma, poi il colore.',
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .then((data) => {
      if (!data?.products?.nodes) return data;
      return {
        ...data,
        products: {
          ...data.products,
          nodes: diversifyProducts(data.products.nodes),
        },
      };
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

const RECOMMENDED_DISPLAY_COUNT = 20;

/** "ANYMA LEOPARD · LIPSTICK ROSSO" -> {anima: "LEOPARD", category: "LIPSTICK"} */
function parseProductMeta(title: string) {
  const [animaPart, rest] = title.split('·').map((s) => s.trim());
  return {
    anima: animaPart?.replace(/^ANYMA\s+/i, '') ?? '',
    category: rest?.split(' ')[0] ?? '',
  };
}

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Randomizes product order and greedily avoids back-to-back picks from the
 * same anima or category, so the featured row doesn't clump on one soul or
 * one product type.
 */
function diversifyProducts<T extends {title: string}>(nodes: T[]): T[] {
  const pool = shuffle(nodes).map((node) => ({
    node,
    meta: parseProductMeta(node.title),
  }));
  const result: typeof pool = [];

  while (pool.length && result.length < RECOMMENDED_DISPLAY_COUNT) {
    const last = result[result.length - 1];
    let index = pool.findIndex(
      (item) =>
        !last ||
        (item.meta.anima !== last.meta.anima &&
          item.meta.category !== last.meta.category),
    );
    if (index === -1) index = 0;
    result.push(pool.splice(index, 1)[0]);
  }

  return result.map((item) => item.node);
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      {data.isShopLinked ? null : <MockShopNotice />}
      <Hero />
      <RecommendedProducts products={data.recommendedProducts} />
      <SealDivider bg="light" />
      <AnimeGrid />
      <PhilosophySection />
      <BrandStoryTeaser />
      <SealDivider bg="light" />
      <SocialSection />
      <FoundersSection />
    </div>
  );
}

function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const {ref: parallaxRef, offset} = useParallaxOffset<HTMLDivElement>(100);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => {
        if (HERO_IMAGES.length < 3) return (i + 1) % HERO_IMAGES.length;
        let next = i;
        while (next === i) next = Math.floor(Math.random() * HERO_IMAGES.length);
        return next;
      });
    }, HERO_ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      data-header-theme="dark"
      className="bleed-under-header relative isolate flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-nero px-6 py-20 text-center text-paper sm:min-h-[86vh] sm:py-6"
    >
      <div ref={parallaxRef} className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
        <div
          className="absolute inset-0 h-[160%] w-full will-change-transform"
          style={{top: '-30%', transform: `translateY(${offset}px)`}}
        >
          {HERO_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Le Anyme di Anyma Beauty"
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${
                i === activeIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-nero/15" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-nero/10 via-nero/55 to-nero/25" />
      <img
        src={logoWhite}
        alt="Anyma Beauty"
        className="mb-6 h-14 w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:h-16"
      />
      <h1 className="font-display max-w-4xl text-balance text-5xl italic leading-[1.05] tracking-[0.04em] text-fuchsia [text-shadow:0_2px_16px_rgba(0,0,0,0.55)] sm:text-6xl md:text-7xl">
        Reveal your Soul!
      </h1>
      <p className="mt-8 max-w-md text-sm leading-relaxed text-paper [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
        Non esiste una sola te. Sei sportiva e sensuale, delicata e dominante,
        minimal e audace — a volte tutto questo nella stessa settimana. Il
        pack che scegli oggi è il simbolo di chi sei oggi.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          href="#anime"
          className="border border-gold px-8 py-3 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold hover:text-nero"
        >
          Scopri le tue Anyme
        </a>
        <Link
          to="/collections/all"
          className="border border-white bg-white px-8 py-3 text-xs uppercase tracking-[0.2em] text-nero transition-colors hover:bg-transparent hover:text-white"
        >
          Shop Now
        </Link>
      </div>
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {HERO_IMAGES.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Immagine ${i + 1}`}
            onClick={() => setActiveIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex ? 'w-6 bg-gold' : 'w-1.5 bg-paper/40 hover:bg-paper/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function SealDivider({bg}: {bg: 'light' | 'dark'}) {
  const seal = bg === 'light' ? sealPositive : sealNegative;
  const line = bg === 'light' ? 'bg-nero/15' : 'bg-paper/25';
  const container = bg === 'light' ? 'bg-paper' : 'bg-nero';
  return (
    <ScrollReveal
      direction="up"
      className={`flex items-center justify-center gap-6 px-6 py-6 sm:py-10 ${container}`}
    >
      <span className={`h-px w-16 sm:w-24 ${line}`} />
      <img src={seal} alt="" aria-hidden="true" className="h-8 w-auto sm:h-10" />
      <span className={`h-px w-16 sm:w-24 ${line}`} />
    </ScrollReveal>
  );
}

function AnimeGrid() {
  return (
    <section id="anime" className="mx-auto max-w-6xl px-6 py-12 sm:py-28">
      <div className="mb-8 text-center sm:mb-12">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold">
          Le 6 Anyme
        </p>
        <h2 className="font-display text-2xl uppercase tracking-[0.03em] text-nero sm:text-4xl">
          Scegli la tua Anyma
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-nero/70 sm:max-w-none sm:text-base sm:whitespace-nowrap">
          Ogni Anyma ha la sua estetica. Il pack che scegli non è un contenitore: è un simbolo.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {ANIME.map((anima) => (
          <AnimaTile key={anima.key} anima={anima} />
        ))}
      </div>
    </section>
  );
}

const ANIMA_TILE_ROTATE_MS = 5000;

function AnimaTile({anima}: {anima: AnimaDefinition}) {
  const images = getAnimaGalleryImages(anima);
  const [activeIndex, setActiveIndex] = useState(0);
  // Randomized per-tile so the 6 tiles don't all flip in sync.
  const [initialDelay] = useState(() => Math.random() * ANIMA_TILE_ROTATE_MS);

  useEffect(() => {
    if (images.length < 2) return;
    let intervalId: ReturnType<typeof setInterval>;
    const nextRandomIndex = (current: number) => {
      if (images.length < 3) return (current + 1) % images.length;
      let next = current;
      while (next === current) next = Math.floor(Math.random() * images.length);
      return next;
    };
    const timeoutId = setTimeout(() => {
      setActiveIndex((i) => nextRandomIndex(i));
      intervalId = setInterval(() => {
        setActiveIndex((i) => nextRandomIndex(i));
      }, ANIMA_TILE_ROTATE_MS);
    }, initialDelay);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [images.length, initialDelay]);

  return (
    <div
      className={`group relative aspect-[4/5] overflow-hidden ${anima.swatch}`}
    >
      <Link
        to={`/collections/${anima.handle}`}
        className="absolute inset-0 flex flex-col justify-end p-6"
      >
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-nero/70 via-nero/5 to-transparent" />
        <div className="relative">
          <h3 className="font-display text-2xl uppercase tracking-[0.05em] text-paper">
            {anima.name}
          </h3>
          <p className="mt-1 text-xs text-paper/80">{anima.tagline}</p>
        </div>
      </Link>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-nero/0 opacity-0 transition-all duration-200 group-hover:bg-nero/40 group-hover:opacity-100">
        <Link
          to={getPackPath(anima)}
          className="pointer-events-auto border border-white bg-nero/80 px-6 py-3 text-xs uppercase tracking-[0.15em] text-white transition-colors hover:bg-nero"
        >
          Compra il Pack
        </Link>
      </div>
    </div>
  );
}

type PhilosophySlide =
  | {kind: 'image'; src: string}
  | {kind: 'video'; src: string; poster: string};

function PhilosophySection() {
  return (
    <section className="bg-paper">
      <PhilosophyBlock
        slides={[
          ...PHILOSOPHY_TRUTH_IMAGES.map(
            (src): PhilosophySlide => ({kind: 'image', src}),
          ),
          {
            kind: 'video',
            src: '/videos/philosophy/truth-beach.mp4',
            poster: '/videos/philosophy/posters/truth-beach.jpg',
          },
          {
            kind: 'video',
            src: '/videos/philosophy/reveal-lipstick.mp4',
            poster: '/videos/philosophy/posters/reveal-lipstick.jpg',
          },
        ]}
        quote="La bellezza non è coerenza."
        subquote="È verità."
      />
      <PhilosophyBlock
        slides={[
          ...PHILOSOPHY_IDENTITY_IMAGES.map(
            (src): PhilosophySlide => ({kind: 'image', src}),
          ),
          {
            kind: 'video',
            src: '/videos/philosophy/identity-hand.mp4',
            poster: '/videos/philosophy/posters/identity-hand.jpg',
          },
        ]}
        quote="La personalità"
        subquote="non ha colore."
        accent="fuchsia"
        reverse
      />
    </section>
  );
}

function PhilosophyBlock({
  slides,
  quote,
  subquote,
  accent = 'gold',
  reverse,
}: {
  slides: PhilosophySlide[];
  quote: string;
  subquote: string;
  accent?: 'gold' | 'fuchsia';
  reverse?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [initialDelay] = useState(() => Math.random() * PHILOSOPHY_ROTATE_MS);
  const {ref: parallaxRef, offset} = useParallaxOffset<HTMLDivElement>(80);

  useEffect(() => {
    if (slides.length < 2) return;
    let intervalId: ReturnType<typeof setInterval>;
    const timeoutId = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
      intervalId = setInterval(() => {
        setActiveIndex((i) => (i + 1) % slides.length);
      }, PHILOSOPHY_ROTATE_MS);
    }, initialDelay);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [slides.length, initialDelay]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      <div
        ref={parallaxRef}
        className={`relative aspect-[3/4] overflow-hidden sm:aspect-auto ${reverse ? 'sm:order-2' : ''}`}
      >
        <div
          className="absolute inset-0 h-[160%] w-full will-change-transform"
          style={{top: '-30%', transform: `translateY(${offset}px)`}}
        >
          {slides.map((slide, i) =>
            slide.kind === 'video' ? (
              <video
                key={slide.src}
                src={slide.src}
                poster={slide.poster}
                autoPlay
                muted
                loop
                playsInline
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  i === activeIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : (
              <img
                key={slide.src}
                src={slide.src}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  i === activeIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ),
          )}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-8 py-10 text-center sm:px-12 sm:py-16">
        <p className="font-display max-w-xl text-balance text-3xl uppercase leading-[1.05] tracking-[0.02em] text-nero sm:text-7xl lg:text-8xl">
          {quote}
          <br />
          <span className={accent === 'fuchsia' ? 'text-fuchsia' : 'text-gold'}>
            {subquote}
          </span>
        </p>
      </div>
    </div>
  );
}

function BrandStoryTeaser() {
  return (
    <section className="bg-paper px-6 py-14 text-center sm:py-28">
      <ScrollReveal direction="up">
        <blockquote className="font-display mx-auto max-w-2xl text-2xl uppercase tracking-[0.03em] text-nero sm:text-3xl">
          <span className="text-fuchsia">&ldquo;</span>Non esiste una sola te.
          <span className="text-fuchsia">&rdquo;</span>
        </blockquote>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-nero/70">
          Riveliamo le anyme attraverso il make-up. Non vendiamo rossetti.
          Creiamo gli oggetti con cui le persone si raccontano ogni giorno.
        </p>
        <Link
          to="/about"
          className="mt-8 inline-block border-b border-nero pb-1 text-xs uppercase tracking-[0.2em] text-nero hover:text-gold hover:border-gold"
        >
          Scopri la nostra storia
        </Link>
      </ScrollReveal>
    </section>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section
      className="mx-auto max-w-6xl px-6 py-12 sm:py-16"
      aria-label="Prodotti in evidenza"
    >
      <Suspense fallback={<div className="text-center text-sm">Loading...</div>}>
        <Await resolve={products}>
          {(response) => {
            if (!response) return null;
            return <ProductRow products={response.products.nodes} />;
          }}
        </Await>
      </Suspense>
    </section>
  );
}

const PRODUCT_ROW_AUTOSCROLL_MS = 2000;
const PRODUCT_ROW_RESUME_DELAY_MS = 4000;

function ProductRow({
  products,
}: {
  products: RecommendedProductsQuery['products']['nodes'];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const canScrollDown =
        e.deltaY > 0 && el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
      const canScrollUp = e.deltaY < 0 && el.scrollLeft > 0;
      if (canScrollDown || canScrollUp) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', onWheel, {passive: false});
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      // The list is rendered twice back to back — once we've scrolled past
      // one full copy, snap back by exactly that width (instant, and
      // invisible since the content repeats) so it never visibly "resets".
      const setWidth = el.scrollWidth / 2;
      if (el.scrollLeft >= setWidth) {
        el.scrollLeft -= setWidth;
      }
      el.scrollBy({left: 220, behavior: 'smooth'});
    }, PRODUCT_ROW_AUTOSCROLL_MS);
    return () => clearInterval(id);
  }, [paused]);

  const pauseThenResume = () => {
    setPaused(true);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(
      () => setPaused(false),
      PRODUCT_ROW_RESUME_DELAY_MS,
    );
  };

  const scrollByPage = (direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({left: direction * el.clientWidth * 0.7, behavior: 'smooth'});
    pauseThenResume();
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        type="button"
        aria-label="Prodotti precedenti"
        onClick={() => scrollByPage(-1)}
        className="absolute left-0 top-1/2 z-10 -translate-x-2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-nero/15 bg-paper text-nero shadow-sm transition-colors hover:border-nero"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={ref}
        className="no-scrollbar -mx-6 flex gap-3 overflow-x-auto px-6 sm:mx-0 sm:gap-4 sm:px-0"
      >
        {[...products, ...products].map((product, i) => (
          <div
            key={`${product.id}-${i}`}
            className="w-[50%] shrink-0 sm:w-[28%] lg:w-[22%]"
          >
            <ProductItem product={product} />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Altri prodotti"
        onClick={() => scrollByPage(1)}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-2 flex h-9 w-9 items-center justify-center rounded-full border border-nero/15 bg-paper text-nero shadow-sm transition-colors hover:border-nero"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

const TIKTOK_HANDLE = '@anyma.beauty';
const TIKTOK_URL = 'https://www.tiktok.com/@anyma.beauty';

const TIKTOK_WALL_CLIPS = [
  {name: 'bedroom-alt', src: '/videos/tiktok-wall/bedroom-alt.mp4', poster: '/videos/tiktok-wall/posters/bedroom-alt.jpg'},
  {name: 'lip-closeup', src: '/videos/tiktok-wall/lip-closeup.mp4', poster: '/videos/tiktok-wall/posters/lip-closeup.jpg'},
  {name: 'paris-walk', src: '/videos/tiktok-wall/paris-walk.mp4', poster: '/videos/tiktok-wall/posters/paris-walk.jpg'},
  {name: 'street-bite', src: '/videos/tiktok-wall/street-bite.mp4', poster: '/videos/tiktok-wall/posters/street-bite.jpg'},
  {name: 'city-selfie', src: '/videos/tiktok-wall/city-selfie.mp4', poster: '/videos/tiktok-wall/posters/city-selfie.jpg'},
  {name: 'locker-room', src: '/videos/tiktok-wall/locker-room.mp4', poster: '/videos/tiktok-wall/posters/locker-room.jpg'},
];

function SocialSection() {
  const col1 = useParallaxOffset<HTMLDivElement>(-70);
  const col2 = useParallaxOffset<HTMLDivElement>(55);
  const col3 = useParallaxOffset<HTMLDivElement>(-40);

  const columns = [
    {...col1, clips: TIKTOK_WALL_CLIPS.slice(0, 2)},
    {...col2, clips: TIKTOK_WALL_CLIPS.slice(2, 4)},
    {...col3, clips: TIKTOK_WALL_CLIPS.slice(4, 6)},
  ];

  return (
    <section className="overflow-hidden bg-nero px-6 py-16 sm:py-24">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 sm:grid-cols-2 sm:gap-16">
        <ScrollReveal direction="left">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold">
            Seguici
          </p>
          <h2 className="font-display text-3xl uppercase tracking-[0.03em] text-paper sm:text-4xl">
            Guardaci su <span className="text-fuchsia">TikTok</span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/70">
            Backstage, texture, anyme in movimento — la parte più vera del
            brand vive sui social, prima ancora che sullo shop.
          </p>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 border border-paper px-6 py-3 text-xs uppercase tracking-[0.2em] text-paper transition-colors hover:bg-paper hover:text-nero"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M16.6 5.82c-.9-.86-1.47-2.03-1.6-3.32h-3.02v13.9c0 1.7-1.38 3.08-3.08 3.08a3.08 3.08 0 0 1-1.13-5.95 3.06 3.06 0 0 1 1.13-.21c.28 0 .55.03.81.09v-3.1a6.1 6.1 0 0 0-.81-.05A6.1 6.1 0 0 0 3.28 16.5 6.1 6.1 0 0 0 8.9 22.6a6.1 6.1 0 0 0 6.1-6.1V8.94a8.2 8.2 0 0 0 4.8 1.53V7.45c-1.13 0-2.19-.35-3.2-1.63Z" />
            </svg>
            Segui {TIKTOK_HANDLE}
          </a>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={100}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {columns.map((col, i) => (
              <div
                key={i}
                ref={col.ref}
                className={`flex flex-col gap-3 will-change-transform ${
                  i === 2 ? 'hidden sm:flex' : ''
                }`}
                style={{transform: `translateY(${col.offset}px)`}}
              >
                {col.clips.map((clip) => (
                  <div
                    key={clip.name}
                    className="aspect-[9/16] overflow-hidden rounded bg-paper/10"
                  >
                    <video
                      src={clip.src}
                      poster={clip.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function FoundersSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const {ref: parallaxRef, offset} = useParallaxOffset<HTMLDivElement>(90);

  useEffect(() => {
    if (FOUNDERS_IMAGES.length < 2) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % FOUNDERS_IMAGES.length);
    }, FOUNDERS_ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      data-header-theme="dark"
      className="relative isolate flex min-h-[75vh] items-end overflow-hidden bg-nero text-paper sm:min-h-[85vh]"
    >
      <div ref={parallaxRef} className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
        <div
          className="absolute inset-0 h-[160%] w-full will-change-transform"
          style={{top: '-30%', transform: `translateY(${offset}px)`}}
        >
          {FOUNDERS_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${
                i === activeIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-nero/20" />

      <ScrollReveal
        direction="up"
        className="w-full px-6 py-14 sm:px-12 sm:py-20"
      >
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-fuchsia">
          Posti limitati
        </p>
        <h2 className="font-display text-4xl uppercase tracking-[0.03em] sm:text-5xl">
          Diventa Anyma Prima
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/80">
          Spedizione a vita, tessera numerata, 15% di benvenuto — solo per le
          prime 800 anyme.
        </p>

        <div className="mt-8 max-w-sm">
          <FoundersCounter />
        </div>

        <FoundersEmailForm />
      </ScrollReveal>
    </section>
  );
}

function FoundersCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const pct = Math.round((FOUNDERS_REGISTERED / FOUNDERS_TOTAL) * 100);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setVisible(true);
        const duration = 1200;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          setCount(Math.round(progress * FOUNDERS_REGISTERED));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      {threshold: 0.4},
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <p className="flex items-baseline gap-2">
        <span className="font-display text-3xl text-fuchsia">{count}</span>
        <span className="text-xs uppercase tracking-[0.15em] text-paper/70">
          su {FOUNDERS_TOTAL} anyme già dentro
        </span>
      </p>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-paper/15">
        <div
          className="h-full rounded-full bg-fuchsia transition-all duration-1000 ease-out"
          style={{width: `${visible ? pct : 0}%`}}
        />
      </div>
    </div>
  );
}

function FoundersEmailForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="mt-8 text-sm uppercase tracking-[0.1em] text-gold">
        Grazie — ti faremo sapere quando si apre il tuo posto.
      </p>
    );
  }

  return (
    <form
      className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="La tua email"
        className="w-full border border-paper/30 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-paper/50 focus:border-gold focus:outline-none"
      />
      <button
        type="submit"
        className="whitespace-nowrap border border-gold px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold hover:text-nero"
      >
        Riservati il posto
      </button>
    </form>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 4) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 40, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
