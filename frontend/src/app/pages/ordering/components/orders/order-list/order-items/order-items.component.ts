import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { LocalStorageTypes } from '@core/enums/local-storage-types';
import { SubSink } from '@core/helpers/sub-sink';
import { IUser } from '@core/models/user.model';
import { NotificationService } from '@core/services/notification.service';
import { UserService } from '@core/services/user.service';
import { WebsocketMessagesService } from '@core/services/websocket-messages.service';
import { take } from 'rxjs';
import { deflateSync } from 'zlib';
import { OrderStatus } from '../../models/order-status-types';
import { OrderType } from '../../models/order-type-types';
import { IOrder } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import {
  AddOrderItem,
  IAddItemEx,
  IItem,
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
  updated: Date = new Date();
  private subs = new SubSink();
  orderStatus = OrderStatus;

  itemForm = new FormGroup({
    item: new FormControl(null, Validators.required),
  });

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
          this.updated = new Date();
        }
      });

    this.subs.sink = this._websocketService
      .onOrderItemDeleted()
      .subscribe((data: any) => {
        this.items = this.items.filter((item) => item.id != data);
        this.updated = new Date();
      });

    this.subs.sink = this._websocketService
      .onOrderItemUserAdded()
      .subscribe((data: any) => {
        this.items.forEach((item) => {
          if (item.id === data.id) {
            item.orderedItems = data.orderedItems;
            this.updated = new Date();
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

          this.updated = new Date();
        });
      });

    this.subs.sink = this._websocketService
      .onOrderCompleted()
      .subscribe((next) => {
        if (next.id === this.order?.id) {
          this.order = next;
          this.items = next.orderItems;
        }
      });
  }

  onSubmit() {
    const orderItem: any = {
      name: <string>this.itemForm.get('item')?.value,
      order: this.order,
      users: JSON.parse(
        <string>(
          localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
        )
      ),
    };

    const newOrderItem: AddOrderItem = {
      name: <string>this.itemForm.get('item')?.value,
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

    this.itemForm.reset();

    // this._notificationService.sendOrderItemAddedMessage(
    //   `Item ${orderItem.name} added!`
    // );
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
    // console.log('clicked');
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

  haveThisItem(item: IItem) {
    const currentUser = JSON.parse(
      <string>localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
    );
    const idx = item.orderedItems!.findIndex(
      (oi) => oi.user?.id == currentUser.id
    );

    if (idx === -1) {
      return false;
    }

    return true;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
