import type {Route} from './+types/($locale).lavora-con-noi';
import {getLocaleFromParam} from '~/lib/locale';
import {useT} from '~/lib/i18n';
import {TRANSLATIONS} from '~/lib/translations';

export const meta: Route.MetaFunction = ({params}) => {
  const code = getLocaleFromParam(params.locale);
  return [{title: TRANSLATIONS[code].careers.metaTitle}];
};

export default function LavoraConNoi() {
  const t = useT();
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center sm:py-24">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">
        {t('careers.eyebrow')}
      </p>
      <h1 className="font-display text-3xl uppercase tracking-[0.03em] text-nero sm:text-4xl">
        {t('careers.title')}
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-nero/70">
        {t('careers.body')}
      </p>
      <a
        href="mailto:lavoraconnoi@anyma-beauty.com?subject=Candidatura%20spontanea"
        className="mt-8 inline-block border border-nero px-8 py-3 text-xs uppercase tracking-[0.2em] text-nero transition-colors hover:bg-nero hover:text-paper"
      >
        {t('careers.cta')}
      </a>
    </div>
  );
}
