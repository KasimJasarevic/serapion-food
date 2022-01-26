import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _isHidden$ = new BehaviorSubject<boolean>(false);

  get isHidden$() {
    return this._isHidden$;
  }

  constructor() {}
}
