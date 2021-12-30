import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject, take, tap } from 'rxjs';
import { IPlace } from '../models/place.model';

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  private _places: IPlace[];

  private _placesSub$: BehaviorSubject<IPlace[]>;
  public placesObs$: Observable<IPlace[]>;

  constructor(private _http: HttpClient) {
    this._places = [];
    this._placesSub$ = new BehaviorSubject<IPlace[]>(this._places);
    this.placesObs$ = this._placesSub$.asObservable();
  }

  addNewPlace(placeData: IPlace): Observable<IPlace> {
    const obs = this._http
      .post<IPlace>('http://localhost:3000/restaurants', placeData)
      .pipe(
        tap((place: IPlace) => {
          this._places.push(place);
          this._placesSub$.next(this._places);
        })
      );

    return obs;
  }

  getAllPlaces(): Observable<IPlace[]> {
    return this._http.get<IPlace[]>('http://localhost:3000/restaurants').pipe(
      tap((places: IPlace[]) => {
        this._places = places;
        this._placesSub$.next(this._places);
      })
    );
  }
}
