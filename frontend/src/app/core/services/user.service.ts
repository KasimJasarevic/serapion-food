import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {LocalStorageTypes} from '../enums/local-storage-types';
import {IUser} from '../models/user.model';
import {environment} from '@environments/environment';
import {of, Subject, tap} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user: IUser | null;
  private _userCache: Map<number, IUser> = new Map();

  private userSubject = new Subject<IUser | null>();
  public userSubjectChange = this.userSubject.asObservable();

  set user(user: IUser | null) {
    this._user = user;
    localStorage.setItem(
      LocalStorageTypes.FOOD_ORDERING_CURRENT_USER,
      JSON.stringify(this._user)
    );

    this.userSubject.next(this._user);
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

  getById(userId: number) {
    if (this._userCache.has(userId)) {
      return of(this._userCache.get(userId) as IUser);
    } else {
      return this._http.get<IUser>(environment.api_url + `/users/${userId}`).pipe(tap(user => {
        this._userCache.set(userId, user);
      }));
    }
  }

  getByEmail(email: string) {
    return this._http.get<IUser>(environment.api_url + `/users/${email}`);
  }

  updateOne(user: IUser) {
    return this._http.put<IUser>(environment.api_url + `/users/`, user);
  }

  updateSubscriptionId(id: number, subId: string) {
    return this._http.put<IUser>(environment.api_url + `/users/update-subscription-id/${id}/${subId}`, null);
  }
}
