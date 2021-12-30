import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject, take, tap } from 'rxjs';
import { IPlace } from '../models/place.model';

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  private _placesSub$: BehaviorSubject<IPlace[]>;
  private _places$: Observable<IPlace[]>;

  private _placesS$: BehaviorSubject<IPlace[]>;

  get places$(): Observable<IPlace[]> {
    return this._places$;
  }

  getPlacesS$(): Observable<IPlace[]> {
    return this._placesS$.asObservable();
  }

  setPlacesS$(places: IPlace[]) {
    this._placesS$.next(places);
  }

  // TODO: Ovo nije idealno rjesenje!
  constructor(private _http: HttpClient) {
    this._placesSub$ = new BehaviorSubject<IPlace[]>([]);
    this._places$ = this._placesSub$.asObservable();

    this._placesS$ = new BehaviorSubject<IPlace[]>([]);
  }

  addNewPlace(placeData: IPlace): Observable<IPlace> {
    const obs = this._http
      .post<IPlace>('http://localhost:3000/restaurants', placeData)
      .pipe(
        tap((place: IPlace) => {
          this._placesS$.getValue().push(place);
        })
      );

    // obs.subscribe((place: IPlace) => {
    //   this._placesSub$.getValue().push(place);
    // });

    return obs;
  }

  // getAllPlaces(): Observable<IPlace[]> {
  //   const obs = this._http
  //     .get<IPlace[]>('/api/restaurants')
  //     .pipe(
  //       tap((places: IPlace[]) => {
  //         this._placesS$.next(places);
  //       })
  //     );
  //
  //   obs.subscribe((places: IPlace[]) => this._placesSub$.next(places));
  //
  //   return obs;
  // }

  getAllPlaces(): Observable<IPlace[]> {
    return this._http.get<IPlace[]>('api/restaurants');
  }
}
