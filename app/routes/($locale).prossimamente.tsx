import {useState} from 'react';
import {Link} from 'react-router';
import type {Route} from './+types/($locale).prossimamente';
import {getLocaleFromParam} from '~/lib/locale';
import {useLocale, useT} from '~/lib/i18n';
import {TRANSLATIONS} from '~/lib/translations';

export const meta: Route.MetaFunction = ({params}) => {
  const code = getLocaleFromParam(params.locale);
  return [{title: TRANSLATIONS[code].prossimamente.metaTitle}];
};

export default function Prossimamente() {
  const t = useT();
  const {href} = useLocale();

  return (
    <div className="bg-nero text-paper">
      <section
        data-header-theme="dark"
        className="bleed-under-header mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-28 text-center"
      >
        <h1
          className="text-[28px] uppercase leading-[1.1] tracking-[0.06em] text-fuchsia sm:text-[44px] md:text-[56px]"
          style={{fontFamily: 'var(--font-display)'}}
        >
          {t('prossimamente.heroTitle')}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-paper/70 sm:text-base">
          {t('prossimamente.heroSubtitle')}
        </p>
        <p className="mx-auto mt-8 max-w-lg text-sm leading-[1.8] text-paper/80 sm:text-base">
          {t('prossimamente.body')}
        </p>

        <div className="mt-10 w-full max-w-md">
          <EmailCapture />
        </div>

        <Link
          to={href('/')}
          className="mt-12 text-sm text-paper/50 transition-colors hover:text-fuchsia"
        >
          ← {t('prossimamente.backToAnime')}
        </Link>
      </section>
    </div>
  );
}

function EmailCapture() {
  const t = useT();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="text-sm text-fuchsia">{t('prossimamente.thanks')}</p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email) return;
        setSubmitted(true);
      }}
      className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('prossimamente.emailPlaceholder')}
        className="flex-1 border border-paper/30 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-paper/40 focus:border-fuchsia focus:outline-none"
      />
      <button
        type="submit"
        className="bg-fuchsia px-6 py-3 text-xs uppercase tracking-[0.15em] text-paper transition-opacity hover:opacity-80"
      >
        {t('prossimamente.subscribe')}
      </button>
    </form>
  );
}
