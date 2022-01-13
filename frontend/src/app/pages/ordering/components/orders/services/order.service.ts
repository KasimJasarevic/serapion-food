import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { IPlace } from '../../places/models/place.model';
import { IOrder } from '../models/order.model';
import { IItem } from '../order-list/order-items/models/order-item.model';

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

  getOrderItems(orderId: number): Observable<IItem[]> {
    return this._http.get<IItem[]>(
      environment.api_url + `/order-items/order/${orderId}`
    );
  }

  addNewOrderItem(orderItemData: any): Observable<IItem> {
    return this._http.post<any>(
      environment.api_url + '/order-items',
      orderItemData
    );
  }
}
