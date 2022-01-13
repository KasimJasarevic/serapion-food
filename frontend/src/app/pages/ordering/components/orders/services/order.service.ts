import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { IPlace } from '../../places/models/place.model';
import { IOrder } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private _http: HttpClient) {}

  getAllOrders(): Observable<IOrder[]> {
    return this._http.get<IOrder[]>(environment.api_url + '/orders');
  }

  addNewOrder(orderData: any): Observable<IOrder> {
    return this._http.post<any>(environment.api_url + '/orders', orderData);
  }

  deleteOrder(restaurantId: number) {
    return this._http.delete<number>(
      environment.api_url + `/orders/${restaurantId}`
    );
  }
}
