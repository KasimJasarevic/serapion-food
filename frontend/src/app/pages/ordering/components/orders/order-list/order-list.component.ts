import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageTypes } from '@core/enums/local-storage-types';
import { SubSink } from '@core/helpers/sub-sink';
import { IUser } from '@core/models/user.model';
import { NotificationService } from '@core/services/notification.service';
import { UserService } from '@core/services/user.service';
import { WebsocketMessagesService } from '@core/services/websocket-messages.service';
import { deflateSync } from 'zlib';
import { IOrder } from '../models/order.model';
import { OrderService } from '../services/order.service';
import { OrderItemsComponent } from './order-items/order-items.component';

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
    private _userService: UserService,
    private _websocketService: WebsocketMessagesService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.subs.sink = this._orderService
      .getAllOrders()
      .subscribe((orders: IOrder[]) => {
        this.orders = orders;
        this._setOrderers();
      });

    this.subs.sink = this._websocketService
      .onOrderOpened()
      .subscribe((data: any) => {
        this.orders.push(data);
      });

    this.subs.sink = this._websocketService.onOrderItemAdded().subscribe(() => {
      this._setOrderers();
    });

    this.subs.sink = this._websocketService
      .onOrderItemUserAdded()
      .subscribe(() => {
        this._setOrderers();
      });

    this.subs.sink = this._websocketService
      .onOrderItemUserDeleted()
      .subscribe(() => {
        this._setOrderers();
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

  confirmOrder() {
    console.log('Confirm order...');
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // ngAfterViewInit(): void {
  //   this.subs.sink = this.children?.changes.subscribe(() => {
  //     this.children?.toArray().map((next) => console.log(next));
  //   })!;
  // }

  // A lifecycle hook that is called after the default change detector has completed checking a component's view for changes.
  // ngAfterViewChecked(): void {
  //   if (this.children) {
  //     console.log(this.children);
  //     this._cdr.detectChanges();
  //   }
  // }

  public getOwnerFullName(order: IOrder) {
    return `${order.user.firstName} ${order.user.lastName}`;
  }

  private getOwnerId(order: IOrder) {
    return order.user.id;
  }

  public isOrderOwner(order: IOrder) {
    const currentUser = JSON.parse(
      <string>localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
    );

    if (currentUser) {
      return currentUser.id === this.getOwnerId(order);
    }

    return undefined;
  }

  public isOrderOrderer(order: IOrder) {
    const currentUser = JSON.parse(
      <string>localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
    );

    // const order = this.orders.find((o) => o.id == next.order.id);
    // this.subs.sink = this._orderService
    //   .getOrderOrderer(order!.id)
    //   .subscribe((data) => {
    //     if (data) {
    //       this.subs.sink = this._userService
    //         .getById(data.user_id)
    //         .subscribe((user) => (order!.orderer = user));
    //     }
    //   });

    if (currentUser) {
      const orderer = this.orders.find((ord) => ord.id == order.id)?.orderer;
      if (orderer) {
        return orderer.id === currentUser.id;
      }
    }

    return undefined;
  }

  private _setOrderers() {
    this.orders.forEach((order) => {
      this.subs.sink = this._orderService
        .getOrderOrderer(order.id)
        .subscribe((next) => {
          if (next) {
            this.subs.sink = this._userService
              .getById(next.user_id)
              .subscribe((user) => {
                order.orderer = user;
              });
          } else {
            order.orderer = undefined;
          }
        });
    });
  }
}
