import {redirect} from 'react-router';
import {PRELAUNCH_MODE} from '~/lib/config';
import {getLocaleFromParam, localizePath} from '~/lib/locale';

export function loader({params}: {params: {locale?: string}}) {
  if (PRELAUNCH_MODE) {
    return redirect(localizePath('/cart', getLocaleFromParam(params.locale)));
  }
  return redirect('/');
}

export default function Component() {
  return null;
}
