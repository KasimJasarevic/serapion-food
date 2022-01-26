import { Injectable } from '@angular/core';
import { LocalStorageTypes } from '@core/enums/local-storage-types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _darkTheme$: BehaviorSubject<boolean>;

  get darkTheme$() {
    return this._darkTheme$.asObservable();
  }

  toggleTheme() {
    const userTheme = <string>(
      localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_THEME)
    );

    if (userTheme === 'light') {
      this._darkTheme$.next(true);
      localStorage.setItem(LocalStorageTypes.FOOD_ORDERING_THEME, 'dark');
    } else {
      this._darkTheme$.next(false);
      localStorage.setItem(LocalStorageTypes.FOOD_ORDERING_THEME, 'light');
    }
  }

  constructor() {
    const userTheme = <string>(
      localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_THEME)
    );

    if (userTheme) {
      this._darkTheme$ =
        userTheme === 'dark'
          ? new BehaviorSubject<boolean>(true)
          : new BehaviorSubject<boolean>(false);
    } else {
      this._darkTheme$ = new BehaviorSubject<boolean>(false);
      localStorage.setItem(LocalStorageTypes.FOOD_ORDERING_THEME, 'light');
    }
  }
}
