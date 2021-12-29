import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { IPlace } from '../models/place.model';

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  constructor(private _http: HttpClient) {}

  addNewPlace(placeData: IPlace): Observable<IPlace> {
    return this._http.post<IPlace>(
      'http://localhost:3000/restaurants',
      placeData
    );
  }

  getAllPlaces(): Observable<IPlace[]> {
    return this._http.get<IPlace[]>('http://localhost:3000/restaurants');
  }
}
