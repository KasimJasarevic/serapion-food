import { Injectable } from '@angular/core';
import { LocalStorageTypes } from '@core/enums/local-storage-types';
import { SidebarTypes, ThemeTypes } from '@core/enums/utility-types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _isHidden$: BehaviorSubject<boolean>;

  get isHidden$() {
    return this._isHidden$.asObservable();
  }

  constructor() {
    const uiPreferences = JSON.parse(
      <string>(
        localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_UI_PREFERENCES)
      )
    );

    if (uiPreferences) {
      const userSidebar = uiPreferences.sidebar;

      this._isHidden$ =
        userSidebar === SidebarTypes.COLLAPSED
          ? new BehaviorSubject<boolean>(true)
          : new BehaviorSubject<boolean>(false);
    } else {
      this._isHidden$ = new BehaviorSubject<boolean>(false);

      localStorage.setItem(
        LocalStorageTypes.FOOD_ORDERING_UI_PREFERENCES,
        JSON.stringify({
          theme: ThemeTypes.DARK,
          sidebar: SidebarTypes.EXPANDED,
        })
      );
    }
  }

  toggleSidebar() {
    const uiPreferences = JSON.parse(
      <string>(
        localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_UI_PREFERENCES)
      )
    );

    const userSidebar = uiPreferences.sidebar;

    if (userSidebar === SidebarTypes.COLLAPSED) {
      this._isHidden$.next(false);
      uiPreferences.sidebar = SidebarTypes.EXPANDED;
      localStorage.setItem(
        LocalStorageTypes.FOOD_ORDERING_UI_PREFERENCES,
        JSON.stringify(uiPreferences)
      );
    } else {
      this._isHidden$.next(true);
      uiPreferences.sidebar = SidebarTypes.COLLAPSED;
      localStorage.setItem(
        LocalStorageTypes.FOOD_ORDERING_UI_PREFERENCES,
        JSON.stringify(uiPreferences)
      );
    }
  }
}
