# Instagram Access Token

The Instagram feed on the homepage uses a **long-lived token** that expires every **60 days**.

## How to regenerate

1. Go to https://developers.facebook.com → your app → **Instagram Basic Display** (or **Instagram Graph API**).
2. Under **User Token Generator**, click **Generate Token** for the @anymabeauty account.
3. Copy the short-lived token and exchange it for a long-lived one:

```bash
curl -s "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=YOUR_APP_SECRET&access_token=SHORT_LIVED_TOKEN"
```

4. Copy the `access_token` from the response.
5. In Shopify admin → **Settings → Custom data → Environment variables** (or Hydrogen's Oxygen dashboard), update `INSTAGRAM_ACCESS_TOKEN` with the new value.
6. Redeploy or wait for the next deploy — the new token takes effect immediately.

## Refresh an existing long-lived token

If the token hasn't expired yet, you can refresh it without going through the full flow:

```bash
curl -s "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=CURRENT_LONG_LIVED_TOKEN"
```

This returns a new 60-day token. Tokens that are more than 60 days old cannot be refreshed.

## Error handling

If the token expires, the homepage hides the Instagram section automatically and logs:
```
[Instagram] Token expired or invalid — regenerate it.
```
No other part of the site is affected.
