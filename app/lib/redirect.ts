import {redirect} from 'react-router';

export function redirectIfHandleIsLocalized(
  request: Request,
  ...localizedResources: Array<{
    handle: string;
    data: {handle: string} & unknown;
  }>
) {
  const url = new URL(request.url);
  let shouldRedirect = false;

  localizedResources.forEach(({handle, data}) => {
    if (handle !== data.handle) {
      url.pathname = url.pathname.replace(handle, data.handle);
      shouldRedirect = true;
    }
  });

  if (shouldRedirect) {
    throw redirect(url.toString());
  }
}

const OLD_HANDLE_SUFFIX: [string, string][] = [
  ['-rosso', '-red-metal'],
  ['-viola', '-violet'],
  ['-yellow', '-light-gold'],
  ['-lilla', '-pervinca'],
];

const OLD_BLACK_RE = /-(?:lipstick|gloss|mascara)-black$/;

export function redirectOldProductHandle(
  request: Request,
  handle: string,
): void {
  if (OLD_BLACK_RE.test(handle)) {
    const newHandle = handle.replace(/-black$/, '-super-black');
    const url = new URL(request.url);
    url.pathname = url.pathname.replace(handle, newHandle);
    throw redirect(url.toString(), 301);
  }
  for (const [oldSuffix, newSuffix] of OLD_HANDLE_SUFFIX) {
    if (handle.endsWith(oldSuffix)) {
      const newHandle = handle.slice(0, -oldSuffix.length) + newSuffix;
      const url = new URL(request.url);
      url.pathname = url.pathname.replace(handle, newHandle);
      throw redirect(url.toString(), 301);
    }
  }
}
