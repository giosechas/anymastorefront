import {data} from 'react-router';
import {checkRateLimit} from '~/lib/rateLimit';
import {verifyGoogleIdToken} from '~/lib/googleAuth';
import {processPreorder, type CartItem} from '~/lib/klaviyo';

export async function action({request, context}: {request: Request; context: {env: Env}}) {
  if (request.method !== 'POST') {
    return data({success: false, error: 'method'}, {status: 405});
  }

  const ip =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  const {allowed, retryAfter} = checkRateLimit(ip);
  if (!allowed) {
    return data(
      {success: false, error: 'rate_limit'},
      {status: 429, headers: {'Retry-After': String(retryAfter)}},
    );
  }

  let body: {
    name?: string;
    email?: string;
    marketingConsent: boolean;
    googleIdToken?: string;
    honeypot: string;
    cart: CartItem[];
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return data({success: false, error: 'bad_request'}, {status: 400});
  }

  if (body.honeypot) {
    return data({success: true});
  }

  if (!body.marketingConsent) {
    return data({success: false, error: 'consent_required'}, {status: 400});
  }

  let email: string;
  let name: string | undefined = body.name;

  if (body.googleIdToken) {
    const clientId = context.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('[preorder] GOOGLE_CLIENT_ID not configured');
      return data({success: false, error: 'retry'}, {status: 500});
    }
    try {
      const verified = await verifyGoogleIdToken(body.googleIdToken, clientId);
      if (!verified.emailVerified) {
        return data({success: false, error: 'bad_request'}, {status: 400});
      }
      email = verified.email;
      name = name || verified.name;
    } catch (err) {
      console.error('[preorder] Google token verification failed');
      return data({success: false, error: 'retry'}, {status: 400});
    }
  } else {
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return data({success: false, error: 'bad_request'}, {status: 400});
    }
    email = body.email;
  }

  const apiKey = context.env.KLAVIYO_PRIVATE_API_KEY;
  const listId = context.env.KLAVIYO_LIST_ID;

  if (!apiKey || !listId) {
    console.error('[preorder] Klaviyo env vars not configured');
    return data({success: false, error: 'retry'}, {status: 500});
  }

  try {
    await processPreorder(apiKey, listId, email, name, true, body.cart);
  } catch (err) {
    console.error('[preorder] Klaviyo processing failed', {
      error: err instanceof Error ? err.message : err,
    });
    return data({success: false, error: 'retry'}, {status: 500});
  }

  return data({success: true});
}
