import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageTypes } from '../enums/local-storage-types';

@Injectable({
  providedIn: 'root',
})
export class SignedInGuard implements CanActivate {
  constructor(private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = localStorage.getItem(
      LocalStorageTypes.FOOD_ORDERING_AUTH_TOKEN
    );

    if (token) {
      this._router.navigate(['']);
      return false;
    }

    return true;
  }
}
