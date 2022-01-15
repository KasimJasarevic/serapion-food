import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPlace } from '../models/place.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
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

  deletePlace(name: string) {
    return this._http.delete<IPlace>(
      `${environment.api_url}/restaurants/${name}`
    );
  }
}
