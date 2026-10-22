interface GoogleJwk {
  kid: string;
  kty: string;
  alg: string;
  n: string;
  e: string;
  use: string;
}

let cachedKeys: GoogleJwk[] | null = null;
let cachedAt = 0;
const CACHE_TTL = 3_600_000;

function base64urlDecode(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function fetchGoogleKeys(): Promise<GoogleJwk[]> {
  if (cachedKeys && Date.now() - cachedAt < CACHE_TTL) {
    return cachedKeys;
  }
  const res = await fetch(
    'https://www.googleapis.com/oauth2/v3/certs',
  );
  if (!res.ok) throw new Error('Failed to fetch Google JWKS');
  const data = (await res.json()) as {keys: GoogleJwk[]};
  cachedKeys = data.keys;
  cachedAt = Date.now();
  return cachedKeys;
}

export async function verifyGoogleIdToken(
  idToken: string,
  clientId: string,
): Promise<{email: string; name?: string; emailVerified: boolean}> {
  const parts = idToken.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');

  const headerJson = new TextDecoder().decode(base64urlDecode(parts[0]));
  const header = JSON.parse(headerJson) as {kid: string; alg: string};

  if (header.alg !== 'RS256') throw new Error('Unsupported algorithm');

  const keys = await fetchGoogleKeys();
  const jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) throw new Error('Key not found in Google JWKS');

  const key = await crypto.subtle.importKey(
    'jwk',
    {kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256'},
    {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'},
    false,
    ['verify'],
  );

  const signedData = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const signature = base64urlDecode(parts[2]);

  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    signature.buffer as ArrayBuffer,
    signedData.buffer as ArrayBuffer,
  );
  if (!valid) throw new Error('Invalid signature');

  const payloadJson = new TextDecoder().decode(base64urlDecode(parts[1]));
  const payload = JSON.parse(payloadJson) as {
    iss: string;
    aud: string;
    exp: number;
    email: string;
    name?: string;
    email_verified?: boolean;
  };

  if (
    payload.iss !== 'accounts.google.com' &&
    payload.iss !== 'https://accounts.google.com'
  ) {
    throw new Error('Invalid issuer');
  }
  if (payload.aud !== clientId) throw new Error('Invalid audience');
  if (payload.exp * 1000 < Date.now()) throw new Error('Token expired');

  return {
    email: payload.email,
    name: payload.name,
    emailVerified: payload.email_verified ?? false,
  };
}
