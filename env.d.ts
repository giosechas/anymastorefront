/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  interface Env {
    INSTAGRAM_ACCESS_TOKEN?: string;
    KLAVIYO_PRIVATE_API_KEY?: string;
    KLAVIYO_LIST_ID?: string;
    GOOGLE_CLIENT_ID?: string;
    PRELAUNCH_MODE?: string;
  }
}
