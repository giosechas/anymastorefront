import {redirect} from 'react-router';
import {isPrelaunchMode} from '~/lib/config';
import {getLocaleFromParam, localizePath} from '~/lib/locale';

export function loader({params, context}: {params: {locale?: string}; context: {env: Env}}) {
  if (isPrelaunchMode(context.env)) {
    return redirect(localizePath('/cart', getLocaleFromParam(params.locale)));
  }
  return redirect('/');
}

export default function Component() {
  return null;
}
