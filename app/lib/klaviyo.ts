function headers(apiKey: string) {
  return {
    Authorization: `Klaviyo-API-Key ${apiKey}`,
    'Content-Type': 'application/vnd.api+json',
    revision: '2024-10-15',
  };
}

async function upsertProfile(
  apiKey: string,
  email: string,
  name?: string,
): Promise<string> {
  const res = await fetch('https://a.klaviyo.com/api/profiles/', {
    method: 'POST',
    headers: headers(apiKey),
    body: JSON.stringify({
      data: {
        type: 'profile',
        attributes: {
          email,
          ...(name ? {first_name: name} : {}),
          properties: {
            preorder_source: 'website',
            preorder_date: new Date().toISOString(),
          },
        },
      },
    }),
  });

  if (res.status === 409) {
    const error = (await res.json()) as {
      errors?: Array<{meta?: {duplicate_profile_id?: string}}>;
    };
    const existingId = error.errors?.[0]?.meta?.duplicate_profile_id;
    if (existingId) return existingId;
    throw new Error('Klaviyo 409 without duplicate profile ID');
  }

  if (!res.ok) {
    throw new Error(`Klaviyo upsertProfile failed: ${res.status}`);
  }

  const data = (await res.json()) as {data: {id: string}};
  return data.data.id;
}

async function subscribeToList(
  apiKey: string,
  listId: string,
  email: string,
): Promise<void> {
  const res = await fetch(
    'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
    {
      method: 'POST',
      headers: headers(apiKey),
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            custom_source: 'website_prelaunch',
            profiles: {
              data: [
                {
                  type: 'profile',
                  attributes: {
                    email,
                    subscriptions: {
                      email: {
                        marketing: {
                          consent: 'SUBSCRIBED',
                          consented_at: new Date().toISOString(),
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
          relationships: {
            list: {
              data: {type: 'list', id: listId},
            },
          },
        },
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`Klaviyo subscribeToList failed: ${res.status}`);
  }
}

export interface CartItem {
  title: string;
  variantTitle: string;
  quantity: number;
  productHandle: string;
  color?: string;
  anima?: string;
  image: string;
  url: string;
}

async function createPreorderEvent(
  apiKey: string,
  email: string,
  items: CartItem[],
): Promise<void> {
  const res = await fetch('https://a.klaviyo.com/api/events/', {
    method: 'POST',
    headers: headers(apiKey),
    body: JSON.stringify({
      data: {
        type: 'event',
        attributes: {
          metric: {
            data: {
              type: 'metric',
              attributes: {name: 'Pre-order Requested'},
            },
          },
          profile: {
            data: {
              type: 'profile',
              attributes: {email},
            },
          },
          properties: {
            items: items.map((i) => ({
              title: i.title,
              variant: i.variantTitle,
              quantity: i.quantity,
              handle: i.productHandle,
              color: i.color,
              anima: i.anima,
              image: i.image,
              url: i.url,
            })),
            item_count: items.reduce((sum, i) => sum + i.quantity, 0),
            source: 'prelaunch_website',
          },
        },
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`Klaviyo createPreorderEvent failed: ${res.status}`);
  }
}

export async function processPreorder(
  apiKey: string,
  listId: string,
  email: string,
  name: string | undefined,
  marketingConsent: boolean,
  items: CartItem[],
): Promise<void> {
  await upsertProfile(apiKey, email, name);

  if (marketingConsent) {
    await subscribeToList(apiKey, listId, email);
  }

  await createPreorderEvent(apiKey, email, items);
}
