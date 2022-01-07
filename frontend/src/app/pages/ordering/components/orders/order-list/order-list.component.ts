import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from '@core/helpers/sub-sink';
import { NotificationService } from '@core/services/notification.service';
import { WebsocketMessagesService } from '@core/services/websocket-messages.service';
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
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
