import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocalStorageTypes } from '@core/enums/local-storage-types';
import { SubSink } from '@core/helpers/sub-sink';
import { NotificationService } from '@core/services/notification.service';
import { WebsocketMessagesService } from '@core/services/websocket-messages.service';
import { OrderService } from '../../services/order.service';
import { IItem } from './models/order-item.model';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.scss'],
})
export class OrderItemsComponent implements OnInit, OnDestroy {
  @Input() orderId: number | undefined;
  items: IItem[] = [];
  private subs = new SubSink();

  constructor(
    private _orderService: OrderService,
    private _websocketService: WebsocketMessagesService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.orderId) {
      this.subs.sink = this._orderService
        .getOrderItems(this.orderId)
        .subscribe((data: IItem[]) => {
          this.items = data;
        });
    }

    this.subs.sink = this._websocketService
      .onOrderItemAdded()
      .subscribe((data: any) => {
        if (data.order === this.orderId) {
          this.items.push(data);
        }
      });
  }

  onSubmit(form: NgForm) {
    const orderItem: any = {
      order: this.orderId,
      users: [
        JSON.parse(
          <string>(
            localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
          )
        ),
      ],
      name: form.value.item,
      amount: form.value.amount,
    };

    this.subs.sink = this._orderService.addNewOrderItem(orderItem).subscribe();

    // let ids: number[] = [];
    // this.items.forEach((item) =>
    //   item.users?.forEach((user) => ids.push(user.id))
    // );
    // ids = ids.filter((value, index, array) => {
    //   return array.indexOf(value) === index;
    // });

    // let idsStr = ids.map((id) => id.toString());

    // this._notificationService.sendNotificationToUsers(['1']);
    // this._notificationService.sendOrderItemAddedMessage(idsStr, `Item added!`);

    this._notificationService.sendOrderItemAddedMessage(
      `Item ${orderItem.name} added!`
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
