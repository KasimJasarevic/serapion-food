import { Injectable } from '@angular/core';
import { LocalStorageTypes } from '@core/enums/local-storage-types';
import { SidebarTypes, ThemeTypes } from '@core/enums/utility-types';
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
    const uiPreferences = JSON.parse(
      <string>(
        localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_UI_PREFERENCES)
      )
    );

    const userTheme = uiPreferences.theme;

    if (userTheme === ThemeTypes.LIGHT) {
      this._darkTheme$.next(true);
      uiPreferences.theme = ThemeTypes.DARK;
      localStorage.setItem(
        LocalStorageTypes.FOOD_ORDERING_UI_PREFERENCES,
        JSON.stringify(uiPreferences)
      );
    } else {
      this._darkTheme$.next(false);
      uiPreferences.theme = ThemeTypes.LIGHT;
      localStorage.setItem(
        LocalStorageTypes.FOOD_ORDERING_UI_PREFERENCES,
        JSON.stringify(uiPreferences)
      );
    }
  }

  constructor() {
    const uiPreferences = JSON.parse(
      <string>(
        localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_UI_PREFERENCES)
      )
    );

    if (uiPreferences) {
      const userTheme = uiPreferences.theme;

      this._darkTheme$ =
        userTheme === ThemeTypes.DARK
          ? new BehaviorSubject<boolean>(true)
          : new BehaviorSubject<boolean>(false);
    } else {
      this._darkTheme$ = new BehaviorSubject<boolean>(true);

      localStorage.setItem(
        LocalStorageTypes.FOOD_ORDERING_UI_PREFERENCES,
        JSON.stringify({
          theme: ThemeTypes.DARK,
          sidebar: SidebarTypes.EXPANDED,
        })
      );
    }
  }
}
