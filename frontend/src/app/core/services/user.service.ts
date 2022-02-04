import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageTypes } from '../enums/local-storage-types';
import { IUser } from '../models/user.model';
import { environment } from '@environments/environment';

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

  constructor(private _http: HttpClient) {
    this._user = null;
  }

  removeUser() {
    localStorage.removeItem(LocalStorageTypes.FOOD_ORDERING_AUTH_TOKEN);
    localStorage.removeItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER);
    this._user = null;
  }

  getAllUsers() {
    return this._http.get<IUser[]>(environment.api_url + '/users');
  }

  getUserById(id: number) {
    return this._http.get<IUser>(environment.api_url + '/orders');
  }

  getById(userId: number) {
    return this._http.get<IUser>(environment.api_url + `/users/${userId}`);
  }

  getByEmail(email: string) {
    return this._http.get<IUser>(environment.api_url + `/users/${email}`);
  }

  updateOne(user: IUser) {
    return this._http.put<IUser>(environment.api_url + `/users/`, user);
  }
}
