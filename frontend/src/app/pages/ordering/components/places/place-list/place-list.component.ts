import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IPlace } from '../models/place.model';
import { PlaceService } from '../services/place.service';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.scss'],
})
export class PlaceListComponent implements OnInit, OnDestroy {
  places$: Observable<IPlace[]>;
  private _sub: Subscription;

  constructor(private _placeService: PlaceService) {
    this.places$ = this._placeService.placesObs$;
    this._sub = _placeService.getAllPlaces().subscribe();
  }

  ngOnInit(): void {}

  // Ruzno rjesenje!!!!
  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
