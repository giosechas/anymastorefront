import {Link} from 'react-router';
import type {Route} from './+types/legale.$slug';
import {getLegalPolicy, LEGAL_POLICIES} from '~/lib/legalContent';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Anyma Beauty | ${data?.policy.title ?? 'Area Legale'}`}];
};

export async function loader({params}: Route.LoaderArgs) {
  const policy = params.slug ? getLegalPolicy(params.slug) : undefined;
  if (!policy) {
    throw new Response('Documento non trovato', {status: 404});
  }
  return {policy};
}

export default function LegalPolicyPage({loaderData}: Route.ComponentProps) {
  const {policy} = loaderData;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">
        Area Legale
      </p>
      <h1 className="font-display text-3xl uppercase tracking-[0.03em] text-nero sm:text-4xl">
        {policy.title}
      </h1>
      <p className="mt-3 text-xs text-nero/50">
        Ultimo aggiornamento: {policy.lastUpdated}
      </p>

      <div className="mt-10 space-y-8">
        {policy.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-display text-base uppercase tracking-[0.05em] text-nero">
              {section.heading}
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-nero/80">
              {section.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 border-t border-nero/10 pt-8">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-nero/50">
          Altri documenti
        </p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {LEGAL_POLICIES.filter((p) => p.slug !== policy.slug).map((p) => (
            <li key={p.slug}>
              <Link
                to={`/legale/${p.slug}`}
                className="text-nero/70 underline underline-offset-2 hover:text-gold"
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
