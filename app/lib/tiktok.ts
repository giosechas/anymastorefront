/** Live "@anyma.beauty" TikTok feed via TikTok's official Display API (v2).
 *
 * One-time setup (done once by whoever owns the TikTok account, in their
 * own browser — this app never sees their TikTok password):
 *   1. Create an app at developers.tiktok.com, add the "Login Kit" +
 *      "Display API" products, and register a redirect URI
 *      (e.g. https://anyma-beauty.com/tiktok/callback).
 *   2. Put the app's Client Key/Secret into Shopify's "Environments and
 *      variables" as TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET.
 *   3. Visit the authorize URL built by `getTikTokAuthorizeUrl()` below,
 *      log in as @anyma.beauty, and approve access.
 *   4. TikTok redirects to /tiktok/callback with a `code` — that route
 *      exchanges it for a refresh token and shows it once so it can be
 *      saved into Shopify as TIKTOK_REFRESH_TOKEN. Refresh tokens are
 *      long-lived (~1 year) and this module renews the access token from
 *      it on every request, so nothing else needs to be repeated.
 */

const TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/';
const VIDEO_LIST_URL = 'https://open.tiktokapis.com/v2/video/list/';
const SCOPES = 'user.info.basic,video.list';

export function getTikTokAuthorizeUrl(env: Env, redirectUri: string) {
  const params = new URLSearchParams({
    client_key: env.TIKTOK_CLIENT_KEY ?? '',
    scope: SCOPES,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: 'anyma-setup',
  });
  return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
}

export async function exchangeTikTokCode(
  env: Env,
  code: string,
  redirectUri: string,
) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      client_key: env.TIKTOK_CLIENT_KEY ?? '',
      client_secret: env.TIKTOK_CLIENT_SECRET ?? '',
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  });
  return res.json() as Promise<{
    access_token?: string;
    refresh_token?: string;
    error?: string;
    error_description?: string;
  }>;
}

async function refreshAccessToken(env: Env): Promise<string | undefined> {
  if (!env.TIKTOK_REFRESH_TOKEN) return undefined;
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      client_key: env.TIKTOK_CLIENT_KEY ?? '',
      client_secret: env.TIKTOK_CLIENT_SECRET ?? '',
      grant_type: 'refresh_token',
      refresh_token: env.TIKTOK_REFRESH_TOKEN,
    }),
  });
  const data = (await res.json()) as {access_token?: string};
  return data.access_token;
}

export interface TikTokVideo {
  id: string;
  shareUrl: string;
  coverImageUrl: string;
  description: string;
}

/** Latest public videos from the connected account, newest first.
 * Returns an empty array (never throws) when the API isn't configured yet
 * or a call fails, so the site keeps working before/without the feed. */
export async function getTikTokVideos(
  env: Env,
  maxCount = 12,
): Promise<TikTokVideo[]> {
  try {
    const accessToken = await refreshAccessToken(env);
    if (!accessToken) return [];

    const res = await fetch(
      `${VIDEO_LIST_URL}?fields=id,cover_image_url,share_url,video_description`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({max_count: maxCount}),
      },
    );
    if (!res.ok) return [];

    const data = (await res.json()) as {
      data?: {
        videos?: Array<{
          id: string;
          cover_image_url: string;
          share_url: string;
          video_description: string;
        }>;
      };
    };

    return (data.data?.videos ?? []).map((v) => ({
      id: v.id,
      shareUrl: v.share_url,
      coverImageUrl: v.cover_image_url,
      description: v.video_description,
    }));
  } catch {
    return [];
  }
}
