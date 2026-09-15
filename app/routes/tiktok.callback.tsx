import type {Route} from './+types/tiktok.callback';
import {exchangeTikTokCode} from '~/lib/tiktok';

/** Where TikTok redirects back to after /tiktok/connect. Shows the refresh
 * token once so it can be copied into TIKTOK_REFRESH_TOKEN in Shopify's
 * environment variables — it is never stored anywhere by this app. */
export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return new Response(`TikTok ha rifiutato l'autorizzazione: ${error}`, {
      status: 400,
    });
  }
  if (!code) {
    return new Response('Codice di autorizzazione mancante.', {status: 400});
  }

  const redirectUri = new URL('/tiktok/callback', request.url).toString();
  const result = await exchangeTikTokCode(context.env, code, redirectUri);

  if (!result.refresh_token) {
    return new Response(
      `Scambio del codice non riuscito: ${result.error_description ?? result.error ?? 'errore sconosciuto'}`,
      {status: 400},
    );
  }

  return new Response(
    `Connessione riuscita.\n\nCopia questo valore in Shopify → Hydrogen → anymastorefront → Environments and variables → TIKTOK_REFRESH_TOKEN (Production):\n\n${result.refresh_token}\n\nDopo averlo salvato, questa pagina non serve più.`,
    {headers: {'Content-Type': 'text/plain; charset=utf-8'}},
  );
}
