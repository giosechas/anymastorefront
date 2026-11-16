import type {Route} from './+types/($locale).blogs.$blogHandle.$articleHandle';

export function loader(_args: Route.LoaderArgs) {
  throw new Response('Not found', {status: 404});
}

export default function Article() {
  return null;
}
