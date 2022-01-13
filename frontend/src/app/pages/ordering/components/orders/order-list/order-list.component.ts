import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from '@core/helpers/sub-sink';
import { NotificationService } from '@core/services/notification.service';
import { WebsocketMessagesService } from '@core/services/websocket-messages.service';
import { Observable } from 'rxjs';
import { IPlace } from '../../places/models/place.model';
import { IOrder } from '../models/order.model';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: IOrder[] = [];
  private subs = new SubSink();

  constructor(
    private _orderService: OrderService,
    private _websocketService: WebsocketMessagesService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.subs.sink = this._orderService
      .getAllOrders()
      .subscribe((orders: IOrder[]) => {
        this.orders = orders;
      });

    this.subs.sink = this._websocketService
      .onOrderOpened()
      .subscribe((data: any) => {
        this.orders.push(data);
      });
  }

  closeRestaurant(id: number | undefined) {
    if (id) {
      this.subs.sink = this._orderService
        .deleteOrder(id)
        .subscribe((data: any) => {
          this._notificationService.sendCloseRestaurantMessage(
            data.restaurant.name
          );
        });

      const index = this.orders.findIndex(
        (order) => order.restaurant.id === id
      );
      this.orders.splice(index, 1);
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
