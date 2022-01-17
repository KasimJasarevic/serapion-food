import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocalStorageTypes } from '@core/enums/local-storage-types';
import { SubSink } from '@core/helpers/sub-sink';
import { NotificationService } from '@core/services/notification.service';
import { WebsocketMessagesService } from '@core/services/websocket-messages.service';
import { IOrder } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import {
  AddOrderItem,
  IAddItem,
  IAddItemEx,
  IDeleteItem,
  IItem,
  IOrderItemUser,
  IRemoveOrderItemUser,
} from './models/order-item.model';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.scss'],
})
export class OrderItemsComponent implements OnInit, OnDestroy {
  @Input() order: IOrder | undefined;
  items: IItem[] = [];
  private subs = new SubSink();

  constructor(
    private _orderService: OrderService,
    private _websocketService: WebsocketMessagesService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.order!.id) {
      this.subs.sink = this._orderService
        .getOrderItems(this.order!.id)
        .subscribe((data: IItem[]) => {
          this.items = data;
        });
    }

    this.subs.sink = this._websocketService
      .onOrderItemAdded()
      .subscribe((data: any) => {
        if (data.order.id === this.order!.id) {
          this.items.push(data);
        }
      });

    this.subs.sink = this._websocketService
      .onOrderItemDeleted()
      .subscribe((data: any) => {
        this.items = this.items.filter((item) => item.id != data);
      });

    this.subs.sink = this._websocketService
      .onOrderItemUserAdded()
      .subscribe((data: any) => {
        this.items.forEach((item) => {
          if (item.id === data.id) {
            item.orderedItems = data.orderedItems;
          }
        });
      });

    this.subs.sink = this._websocketService
      .onOrderItemUserDeleted()
      .subscribe((data: any) => {
        this.items.forEach((item) => {
          if (item.id === data.orderItem.id) {
            const indx = item.orderedItems!.findIndex(
              (x) => x.user!.id == data.user.id
            );
            item.orderedItems!.splice(indx, 1);

            if (item.orderedItems?.length === 0) {
              this._orderService.deleteOrderItem(data.orderItem.id);
            }
          }
        });
      });
  }

  onSubmit(form: NgForm) {
    const orderItem: any = {
      name: form.value.item,
      order: this.order,
      users: JSON.parse(
        <string>(
          localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
        )
      ),
      amount: form.value.amount,
    };

    const newOrderItem: AddOrderItem = {
      name: <string>form.value.item,
      order: this.order!,
      orderedItems: [
        {
          user: JSON.parse(
            <string>(
              localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
            )
          ),
        },
      ],
    };

    this.subs.sink = this._orderService
      .addNewOrderItem(newOrderItem)
      .subscribe((item) => {
        const orderItemUser: any = {
          ...item,
          user: JSON.parse(
            <string>(
              localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
            )
          ),
        };
        this._orderService.addOrderItemUser(orderItemUser);
      });

    form.resetForm();

    this._notificationService.sendOrderItemAddedMessage(
      `Item ${orderItem.name} added!`
    );
  }

  addItem(item: IItem) {
    const newItem: IAddItemEx = {
      id: item.id!,
      order: item.order!,
      user: JSON.parse(
        <string>(
          localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
        )
      ),
    };

    this._orderService.addOrderItemUser(newItem).subscribe();
  }

  removeItem(item: IItem) {
    // const idx = members.findIndex(p => p.class=="two");
    // const removed = members.splice(idx,1);
    const currentUser = JSON.parse(
      <string>localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
    );

    const idx = item.orderedItems!.findIndex(
      (oi) => oi.user?.id == currentUser.id
    );

    if (idx === -1) {
      return;
    }

    const removeItem: IRemoveOrderItemUser = {
      itemId: item.id!,
      userId: currentUser.id,
    };

    this._orderService.removeOrderItemUser(removeItem);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
