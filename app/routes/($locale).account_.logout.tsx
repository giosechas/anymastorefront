import {redirect} from 'react-router';
import type {Route} from './+types/($locale).account_.logout';
import {localizePath, getLocaleFromParam} from '~/lib/locale';

// if we don't implement this, /account/logout will get caught by account.$.tsx to do login
export async function loader({params}: Route.LoaderArgs) {
  return redirect(localizePath('/', getLocaleFromParam(params.locale)));
}

export async function action({context}: Route.ActionArgs) {
  return context.customerAccount.logout();
}
