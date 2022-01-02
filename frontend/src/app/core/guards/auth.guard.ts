import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageTypes } from '../enums/local-storage-types';
import {UserService} from "@core/services/user.service";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private _helperSerivce = new JwtHelperService();

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
      this._router.navigate(['login']);
      return false;
    }

    const isExpired = this._helperSerivce.isTokenExpired(token);

    if (isExpired) {
      this._userService.removeUser();
      this._router.navigate(['login']);
      return false;
    }

    return true;
  }
}
