import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IPlace } from '../models/place.model';
import { PlaceService } from '../services/place.service';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.scss'],
})
export class PlaceListComponent implements OnInit {
  places$: Observable<IPlace[]>;

  constructor(private _placeService: PlaceService) {
    this.places$ = this._placeService.getAllPlaces();
  }

  ngOnInit(): void {}
}
