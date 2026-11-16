import type {Route} from './+types/($locale).blogs._index';

export function loader(_args: Route.LoaderArgs) {
  throw new Response('Not found', {status: 404});
}

export default function Blogs() {
  return null;
}
