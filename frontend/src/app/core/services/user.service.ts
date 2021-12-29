import { Injectable } from '@angular/core';
import { LocalStorageTypes } from '../enums/local-storage-types';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user: IUser | null;

  set user(user: IUser | null) {
    this._user = user;
    localStorage.setItem(
      LocalStorageTypes.FOOD_ORDERING_CURRENT_USER,
      JSON.stringify(this._user)
    );
  }

  get user(): IUser | null {
    if (!this._user) {
      this._user = JSON.parse(
        <string>(
          localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
        )
      );
    }

    return this._user;
  }

  constructor() {
    this._user = null;
  }

  removeUser() {
    localStorage.removeItem(LocalStorageTypes.FOOD_ORDERING_AUTH_TOKEN);
    localStorage.removeItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER);
    this._user = null;
  }
}
