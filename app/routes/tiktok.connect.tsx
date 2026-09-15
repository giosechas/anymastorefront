import {redirect} from 'react-router';
import type {Route} from './+types/tiktok.connect';
import {getTikTokAuthorizeUrl} from '~/lib/tiktok';

/** One-time setup step: visit /tiktok/connect while logged into the
 * @anyma.beauty TikTok account to grant this app access. Requires
 * TIKTOK_CLIENT_KEY to already be set in the shop's environment variables. */
export async function loader({request, context}: Route.LoaderArgs) {
  const redirectUri = new URL('/tiktok/callback', request.url).toString();
  if (!context.env.TIKTOK_CLIENT_KEY) {
    return new Response(
      'TIKTOK_CLIENT_KEY non è ancora configurato nelle variabili d’ambiente.',
      {status: 500},
    );
  }
  return redirect(getTikTokAuthorizeUrl(context.env, redirectUri));
}
