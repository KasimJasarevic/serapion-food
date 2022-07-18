import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalStorageTypes } from '@core/enums/local-storage-types';
import { SubSink } from '@core/helpers/sub-sink';
import { WebsocketMessagesService } from '@core/services/websocket-messages.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { OrderStatus } from '../../models/order-status-types';
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
    item: new FormControl(null, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(140),
    ]),
  });

  constructor(
    private _orderService: OrderService,
    private _websocketService: WebsocketMessagesService,
    private _toastr: ToastrService
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

    this.subs.sink = this._websocketService
      .onOrderStatusUpdated()
      .subscribe((order: IOrder) => {
        if (order.id === this.order?.id) {
          this.order = order;
          // this.items = order.orderItems;
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
      .pipe(
        catchError((err) => {
          this._toastr.error('Something went wrong.', 'Hmmm...');
          return of(undefined);
        })
      )
      .subscribe((item) => {
        if (item) {
          const orderItemUser: any = {
            ...item,
            user: JSON.parse(
              <string>(
                localStorage.getItem(
                  LocalStorageTypes.FOOD_ORDERING_CURRENT_USER
                )
              )
            ),
          };
          this._orderService.addOrderItemUser(orderItemUser);
        }
      });

    this.itemForm.reset();
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
    if (item) {
      const currentUser = JSON.parse(
        <string>(
          localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
        )
      );

      if (item.orderedItems) {
        const idx = item.orderedItems.findIndex(
          (oi) => oi.user?.id == currentUser.id
        );

        return idx !== -1;
      }
    }

    return false;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
