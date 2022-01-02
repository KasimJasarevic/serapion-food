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
import {JwtHelperService} from "@auth0/angular-jwt";
import {UserService} from "@core/services/user.service";

@Injectable({
  providedIn: 'root',
})
export class SignedInGuard implements CanActivate {
  private _helperService = new JwtHelperService();
  constructor(private _router: Router,
              private _userService: UserService) {}

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

    if (!token) {
      return true;
    }

    const isExpired = this._helperService.isTokenExpired(token);

    if (isExpired) {
      this._userService.removeUser();
      return true;
    }

    this._router.navigate(['']);
    return false;
  }
}
