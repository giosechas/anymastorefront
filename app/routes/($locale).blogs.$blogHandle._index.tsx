import type {Route} from './+types/($locale).blogs.$blogHandle._index';

export function loader(_args: Route.LoaderArgs) {
  throw new Response('Not found', {status: 404});
}

export default function Blog() {
  return null;
}
