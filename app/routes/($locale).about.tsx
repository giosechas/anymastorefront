import type {Route} from './+types/($locale).about';
import {ScrollReveal} from '~/components/ScrollReveal';
import {ParallaxImage} from '~/components/ParallaxImage';
import {getLocaleFromParam} from '~/lib/locale';
import {useLocale, useT} from '~/lib/i18n';
import {TRANSLATIONS} from '~/lib/translations';
import lipsHero from '~/assets/images/story/lips-hero.webp';
import sketchDesk from '~/assets/images/story/sketch-desk.webp';
import sketchHand from '~/assets/images/story/sketch-hand.webp';
import render3d from '~/assets/images/story/render-3d.webp';
import diversity from '~/assets/images/story/diversity.webp';
import productMacro from '~/assets/images/story/product-macro.webp';
import flatlay from '~/assets/images/story/flatlay.webp';
import lineup from '~/assets/images/story/lineup.webp';
import lifestyleMilano from '~/assets/images/story/lifestyle-milano.webp';

export const meta: Route.MetaFunction = ({params}) => {
  const code = getLocaleFromParam(params.locale);
  return [{title: TRANSLATIONS[code].about.metaTitle}];
};

export default function About() {
  return (
    <div className="bg-paper">
      <StoryHero />
      <StorySectionOrigin />
      <StorySectionVoid />
      <StorySectionTruth />
      <StorySectionCraft />
      <LabSection />
      <StorySectionClosing />
    </div>
  );
}

function StoryHero() {
  const t = useT();
  return (
    <header className="grid grid-cols-1 sm:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 sm:py-24">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-gold">
          Anyma Beauty
        </p>
        <h1 className="font-display text-5xl uppercase leading-[1.05] tracking-[0.02em] text-nero sm:text-6xl">
          {t('about.heroTitle')}
        </h1>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-nero/70">
          {t('about.heroSubtitle')}
        </p>
      </div>
      <ParallaxImage
        src={lipsHero}
        strength={100}
        objectPosition="top"
        className="aspect-[4/5] sm:aspect-auto sm:h-full"
      />
    </header>
  );
}

function StorySectionOrigin() {
  const t = useT();
  return (
    <section className="grid grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2 sm:gap-16 sm:px-12 sm:py-24">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <ScrollReveal
          direction="left"
          className="aspect-[3/4] w-full overflow-hidden rounded"
        >
          <ParallaxImage src={sketchDesk} strength={45} className="h-full" />
        </ScrollReveal>
        <ScrollReveal
          direction="right"
          delay={120}
          className="mt-8 aspect-[3/4] w-full overflow-hidden rounded"
        >
          <ParallaxImage src={sketchHand} strength={45} className="h-full" />
        </ScrollReveal>
        <ScrollReveal
          direction="up"
          delay={240}
          className="col-span-2 aspect-[16/10] w-full overflow-hidden rounded"
        >
          <ParallaxImage src={render3d} strength={65} className="h-full" />
        </ScrollReveal>
      </div>
      <div className="flex flex-col justify-center">
        <ScrollReveal direction="up">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold">
            {t('about.originEyebrow')}
          </p>
          <h2 className="font-display text-3xl uppercase leading-tight tracking-[0.02em] text-nero sm:text-4xl">
            {t('about.originTitle')}
          </h2>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={100}>
          <p className="mt-6 text-sm leading-relaxed text-nero/80">
            {t('about.originP1')}
          </p>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={150}>
          <p className="font-display mt-6 text-2xl uppercase leading-snug tracking-[0.01em] text-nero">
            {t('about.originQuote1')}
            <br />
            <span className="text-fuchsia">{t('about.originQuote2')}</span>
          </p>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={200}>
          <p className="mt-6 text-sm leading-relaxed text-nero/80">
            {t('about.originP2')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

function StorySectionVoid() {
  const t = useT();
  return (
    <section className="bg-nero px-6 py-16 text-paper sm:px-12 sm:py-24">
      <ScrollReveal direction="up" className="mx-auto max-w-2xl text-left">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold">
          {t('about.voidEyebrow')}
        </p>
        <h2 className="font-display text-3xl uppercase leading-tight tracking-[0.02em] text-white sm:text-4xl">
          {t('about.voidTitle')}
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-white/75">
          {t('about.voidP1')}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-white/75">
          {t('about.voidP2')}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-white/75">
          {t('about.voidP3')}
        </p>
        <p className="font-display mt-8 text-2xl uppercase leading-snug tracking-[0.01em] text-gold">
          {t('about.voidQuote1')}
          <br />
          <span className="text-fuchsia">{t('about.voidQuote2')}</span>
        </p>
      </ScrollReveal>
    </section>
  );
}

function StorySectionTruth() {
  const t = useT();
  return (
    <section className="grid grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2 sm:gap-16 sm:px-12 sm:py-24">
      <ScrollReveal
        direction="left"
        className="order-2 flex flex-col justify-center sm:order-1"
      >
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold">
          {t('about.truthEyebrow')}
        </p>
        <h2 className="font-display text-3xl uppercase leading-tight tracking-[0.02em] text-nero sm:text-4xl">
          {t('about.truthTitle')}
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-nero/80">
          {t('about.truthP1')}
        </p>
        <p className="font-display mt-6 text-2xl uppercase leading-snug tracking-[0.01em] text-nero">
          {t('about.truthQuote1')}
          <br />
          {t('about.truthQuote2')}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-nero/80">
          {t('about.truthP2')}
        </p>
        <ul className="mt-6 space-y-2 text-sm text-nero/80">
          <li>
            <span className="text-gold">Leopard</span> {t('about.truthListLeopard')}
          </li>
          <li>
            <span className="text-gold">Candy Rosa</span>{' '}
            {t('about.truthListCandyRosa')}
          </li>
          <li>
            <span className="text-gold">Street</span> {t('about.truthListStreet')}
          </li>
        </ul>
      </ScrollReveal>
      <ScrollReveal
        direction="right"
        className="order-1 relative aspect-[4/3] overflow-hidden sm:order-2 sm:aspect-auto"
      >
        <ParallaxImage src={diversity} strength={55} className="h-full" />
      </ScrollReveal>
    </section>
  );
}

function StorySectionCraft() {
  const t = useT();
  return (
    <section className="px-6 py-16 sm:px-12 sm:py-24">
      <ScrollReveal direction="up" className="mx-auto max-w-2xl text-left">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold">
          {t('about.craftEyebrow')}
        </p>
        <h2 className="font-display text-3xl uppercase leading-tight tracking-[0.02em] text-nero sm:text-4xl">
          {t('about.craftTitle')}
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-nero/80">
          {t('about.craftP1')}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-nero/80">
          {t('about.craftP2')}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-nero/80">
          {t('about.craftP3')}
        </p>
      </ScrollReveal>
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <ScrollReveal
          direction="up"
          className="aspect-[3/4] w-full overflow-hidden rounded"
        >
          <ParallaxImage src={productMacro} strength={50} className="h-full" />
        </ScrollReveal>
        <ScrollReveal
          direction="down"
          delay={120}
          className="aspect-[3/4] w-full overflow-hidden rounded"
        >
          <ParallaxImage src={flatlay} strength={50} className="h-full" />
        </ScrollReveal>
        <ScrollReveal
          direction="up"
          delay={240}
          className="col-span-2 aspect-[16/9] w-full overflow-hidden rounded sm:col-span-1 sm:aspect-[3/4]"
        >
          <ParallaxImage src={lineup} strength={50} className="h-full" />
        </ScrollReveal>
      </div>
    </section>
  );
}

function LabSection() {
  const t = useT();
  return (
    <section className="bg-paper px-6 py-16 sm:px-12 sm:py-24">
      <ScrollReveal direction="up" className="mx-auto max-w-2xl text-left">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold">
          {t('about.labEyebrow')}
        </p>
        <h2 className="font-display text-3xl uppercase leading-tight tracking-[0.02em] text-nero sm:text-4xl">
          {t('about.labTitle')}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-nero/70">
          {t('about.labP1')}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-nero/80">
          {t('about.labP2')}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-nero/80">
          {t('about.labP3')}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-nero/80">
          {t('about.labP4')}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-nero/80">
          {t('about.labP5')}
        </p>
        <p className="font-display mt-6 text-base uppercase tracking-[0.02em] text-nero">
          {t('about.labQuote')}
        </p>
      </ScrollReveal>

      <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:gap-4">
        <ScrollReveal
          direction="up"
          className="aspect-[9/16] w-full overflow-hidden rounded"
        >
          <video
            src="/videos/lab/lab-1.mp4"
            poster="/videos/lab/posters/lab-1.jpg"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        </ScrollReveal>
        <ScrollReveal
          direction="down"
          delay={120}
          className="aspect-[9/16] w-full overflow-hidden rounded"
        >
          <video
            src="/videos/lab/lab-2.mp4"
            poster="/videos/lab/posters/lab-2.jpg"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

function StorySectionClosing() {
  const t = useT();
  const {href} = useLocale();
  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden sm:min-h-[86vh]">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <ParallaxImage src={lifestyleMilano} strength={120} className="h-full" />
      </div>
      <div className="absolute inset-0 bg-[rgba(35,31,32,0.45)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-nero/90 via-nero/40 to-transparent" />
      <ScrollReveal
        direction="up"
        className="relative z-10 px-6 pb-16 sm:px-12 sm:pb-24"
      >
        <h2 className="font-display text-4xl uppercase leading-[1.05] tracking-[0.02em] text-white sm:text-6xl">
          {t('about.closingTitle')}
        </h2>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-white">
          {t('about.closingP')}
        </p>
        <h3 className="font-display mt-6 text-2xl uppercase leading-tight tracking-[0.02em] text-gold sm:text-3xl">
          {t('about.closingQuote1')}
          <br />
          {t('about.closingQuote2')}
        </h3>
        <a
          href={`${href('/')}#anime`}
          className="mt-8 inline-block border border-white bg-[rgba(35,31,32,0.7)] px-8 py-3 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-nero"
        >
          {t('hero.discoverAnyme')}
        </a>
      </ScrollReveal>
    </section>
  );
}
