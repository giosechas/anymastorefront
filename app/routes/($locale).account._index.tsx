import {redirect} from 'react-router';
import type {Route} from './+types/($locale).account._index';
import {localizePath, getLocaleFromParam} from '~/lib/locale';

export async function loader({params}: Route.LoaderArgs) {
  return redirect(
    localizePath('/account/orders', getLocaleFromParam(params.locale)),
  );
}
