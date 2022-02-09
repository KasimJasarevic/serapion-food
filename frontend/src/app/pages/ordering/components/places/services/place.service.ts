import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPlace } from '../models/place.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  private _collapsedPlacesSub$: BehaviorSubject<number[]> = new BehaviorSubject<
    number[]
  >([]);
  private _collapsedPlaces$: Observable<number[]> =
    this._collapsedPlacesSub$.asObservable();

  get collapsedPlaces$() {
    return this._collapsedPlaces$;
  }

  constructor(private _http: HttpClient) {}

  addNewPlace(placeData: IPlace): Observable<IPlace> {
    return this._http.post<IPlace>(
      environment.api_url + '/restaurants',
      placeData
    );
  }

  getAllPlaces(): Observable<IPlace[]> {
    return this._http.get<IPlace[]>(`${environment.api_url}/restaurants`);
  }

  updatePlace(id: number, placeData: IPlace): Observable<IPlace> {
    return this._http.put<IPlace>(
      environment.api_url + `/restaurants/${id}`,
      placeData
    );
  }

  getPlaceById(id: number): Observable<IPlace> {
    return this._http.get<IPlace>(`${environment.api_url}/restaurants/${id}`);
  }

  deletePlace(name: string) {
    return this._http.delete<IPlace>(
      `${environment.api_url}/restaurants/${name}`
    );
  }

  collapsePlace = (id: number) => {
    const placeIds: number[] = this._collapsedPlacesSub$.value;
    placeIds.push(id);
    this._collapsedPlacesSub$.next(placeIds);
  };

  expandPlace = (id: number) => {
    let placeIds: number[] = this._collapsedPlacesSub$.value;
    placeIds = placeIds.filter((placeId) => placeId !== id);

    this._collapsedPlacesSub$.next(placeIds);
  };

  togglePlace = (id: number) => {
    let placeIds: number[] = this._collapsedPlacesSub$.value;
    const index = placeIds.findIndex((placeId) => placeId === id);

    if (index !== -1) {
      // found
      placeIds = placeIds.filter((placeId) => placeId !== id);
    } else {
      // not found
      placeIds.push(id);
    }

    this._collapsedPlacesSub$.next(placeIds);
  };
}
