import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedModalService {
  private _showModalSub$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  private _resultSub$: Subject<boolean> = new Subject<boolean>();

  get showModal$() {
    return this._showModalSub$.asObservable();
  }

  get result$() {
    return this._resultSub$.asObservable();
  }

  constructor() {}

  yesModal = (id: string) => {
    if (this._showModalSub$.value === id) {
      this._resultSub$.next(true);
    }
  };

  noModal = (id: string) => {
    if (this._showModalSub$.value === id) {
      this._resultSub$.next(false);
    }
  };

  toggleModal = (id: string) => {
    if (this._showModalSub$.value === '') {
      this._showModalSub$.next(id);
    } else {
      this._showModalSub$.next('');
    }
  };
}
