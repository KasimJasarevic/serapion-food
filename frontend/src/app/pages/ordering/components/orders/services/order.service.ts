import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { IPlace } from '../../places/models/place.model';
import { OrderType } from '../models/order-type-types';
import { IOrder } from '../models/order.model';
import { IMessage } from '../order-list/order-chat/models/order-chat.model';
import {
  AddOrderItem,
  IAddItem,
  IAddItemEx,
  IDeleteItem,
  IDeleteOrderItem,
  IItem,
  IOrderItemUser,
  IRemoveOrderItemUser,
} from '../order-list/order-items/models/order-item.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private _http: HttpClient) {}

  getAllOrders(): Observable<IOrder[]> {
    return this._http.get<IOrder[]>(environment.api_url + '/orders');
  }

  getOrderById(id: number): Observable<IOrder> {
    return this._http.get<IOrder>(environment.api_url + `/orders/${id}`);
  }

  addNewOrder(orderData: any): Observable<IOrder> {
    return this._http.post<any>(environment.api_url + '/orders', orderData);
  }

  deleteOrderById(id: number) {
    return this._http.delete<number>(
      environment.api_url + `/orders/order/${id}`
    );
  }

  // This has to be order id ...
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

  getComments(orderId: number): Observable<IItem[]> {
    return this._http.get<IMessage[]>(
      environment.api_url + `/comments/order/${orderId}`
    );
  }

  addNewComment(comment: IMessage): Observable<IMessage> {
    return this._http.post<any>(environment.api_url + '/comments', comment);
  }

  addNewOrderItem(orderItemData: any): Observable<AddOrderItem> {
    return this._http.post<any>(
      environment.api_url + '/order-items',
      orderItemData
    );
  }

  // deleteOrderItem({ name, order, user }: IDeleteItem) {
  //   // order-item?order=id&user=id&_name=name
  //   const opts = {
  //     params: new HttpParams({
  //       fromString: `_order=${order}&_user=${user}&_name=${name}`,
  //     }),
  //   };

  //   this._http
  //     .delete<any>(environment.api_url + '/order-items', opts)
  //     .subscribe();
  // }

  addOrderItem(item: IAddItem) {
    this._http.put<any>(environment.api_url + '/order-items', item).subscribe();
  }

  addOrderItemUser({ id, ...payload }: IAddItemEx) {
    return this._http.post<any>(
      environment.api_url + `/order-items/${id}`,
      payload
    );
  }

  removeOrderItemUser({ itemId, userId }: IRemoveOrderItemUser) {
    // order-item?_user=id&_item=id
    const opts = {
      params: new HttpParams({
        fromString: `_user=${userId}&_item=${itemId}`,
      }),
    };

    this._http
      .delete<any>(environment.api_url + '/order-items', opts)
      .subscribe();
  }

  deleteOrderItem(itemId: IDeleteOrderItem) {
    this._http
      .delete<any>(environment.api_url + `/order-items/${itemId}`)
      .subscribe();
  }

  getOrderOrderer(orderId: number) {
    return this._http.get<any>(
      environment.api_url + `/order-items/orders/${orderId}`
    );
  }

  completeOrder(id: number, order: IOrder) {
    return this._http.put<any>(environment.api_url + `/orders/${id}`, order);
  }

  updateTypeById(id: number, type: any) {
    // console.log(id, type);
    return this._http
      .put<any>(environment.api_url + `/orders/type/${id}`, { type: type })
      .subscribe();
  }

  deleteMessageWithId(id: number) {
    return this._http.delete<number>(environment.api_url + `/comments/${id}`);
  }
}
