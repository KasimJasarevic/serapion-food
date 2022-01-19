import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IPlaceSub } from '../models/place.model';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  showModal$ = new Subject<number | undefined>();

  constructor() {}

  modalOpen(placeId?: number) {
    this.showModal$.next(placeId);
  }
}
