import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { IOrder } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private _http: HttpClient) {}

  getAllOrders(): Observable<IOrder[]> {
    return this._http.get<IOrder[]>(environment.api_url + '/orders');
  }
}
