import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';
import {isPrelaunchMode} from '~/lib/config';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    imgSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://*.fbcdn.net',
      'https://*.cdninstagram.com',
    ],
    ...(isPrelaunchMode(context.env)
      ? {
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://cdn.shopify.com',
            'https://accounts.google.com/gsi/client',
            'https://connect.facebook.net',
            'https://www.googletagmanager.com',
          ],
          connectSrc: [
            "'self'",
            'https://accounts.google.com',
            'https://www.facebook.com',
            'https://www.google-analytics.com',
            'https://*.google-analytics.com',
            'https://www.googletagmanager.com',
            'https://*.analytics.google.com',
            'https://*.g.doubleclick.net',
          ],
          frameSrc: ['https://accounts.google.com'],
          imgSrc: [
            "'self'",
            'data:',
            'https://cdn.shopify.com',
            'https://*.fbcdn.net',
            'https://*.cdninstagram.com',
            'https://www.facebook.com',
            'https://www.googletagmanager.com',
          ],
        }
      : {}),
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
