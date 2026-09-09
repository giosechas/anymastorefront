import type {Route} from './+types/lavora-con-noi';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Anyma Beauty | Lavora con noi'}];
};

export default function LavoraConNoi() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center sm:py-24">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">
        Lavora con noi
      </p>
      <h1 className="font-display text-3xl uppercase tracking-[0.03em] text-nero sm:text-4xl">
        Entra nel mondo Anyma
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-nero/70">
        Siamo sempre alla ricerca di persone che credono in ciò che facciamo:
        un make-up che non nasconde chi sei, ma lo rivela. Se pensi che il tuo
        talento possa aggiungere qualcosa ad Anyma Beauty, scrivici e
        raccontaci di te.
      </p>
      <a
        href="mailto:lavoraconnoi@anyma-beauty.com?subject=Candidatura%20spontanea"
        className="mt-8 inline-block border border-nero px-8 py-3 text-xs uppercase tracking-[0.2em] text-nero transition-colors hover:bg-nero hover:text-paper"
      >
        Invia la tua candidatura
      </a>
    </div>
  );
}
