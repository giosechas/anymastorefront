/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  interface Env {
    TIKTOK_CLIENT_KEY?: string;
    TIKTOK_CLIENT_SECRET?: string;
    TIKTOK_REFRESH_TOKEN?: string;
  }
}
