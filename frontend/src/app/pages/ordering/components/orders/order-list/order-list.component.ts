import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocalStorageTypes } from '@core/enums/local-storage-types';
import { SubSink } from '@core/helpers/sub-sink';
import { IUser } from '@core/models/user.model';
import { NotificationService } from '@core/services/notification.service';
import { UserService } from '@core/services/user.service';
import { WebsocketMessagesService } from '@core/services/websocket-messages.service';
import { timeStamp } from 'console';
import { switchMap, tap } from 'rxjs';
import { OrderStatus } from '../models/order-status-types';
import { OrderType } from '../models/order-type-types';
import { IOrder } from '../models/order.model';
import { OrderService } from '../services/order.service';
import { IItem } from './order-items/models/order-item.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit, OnDestroy, AfterViewChecked {
  orders: IOrder[] = [];
  orderStatus = OrderStatus;
  orderType = OrderType;
  ordersForm: FormGroup | undefined;
  private subs = new SubSink();

  // orderForms = new FormArray([]);
  // orderTypeForm = new FormGroup({
  //   orderType: new FormControl(),
  // });

  constructor(
    private _orderService: OrderService,
    private _userService: UserService,
    private _websocketService: WebsocketMessagesService,
    private _notificationService: NotificationService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.ordersForm = this._formBuilder.group({
      orders: this._formBuilder.array([
        // this._formBuilder.group({
        //   orderType: '',
        // }),
      ]),
    });

    this.subs.sink = this._orderService
      .getAllOrders()
      .subscribe((orders: IOrder[]) => {
        this.orders = orders;

        this.orders.forEach((order: IOrder) => {
          (<FormArray>this.ordersForm?.get('orders')).push(
            this._formBuilder.group({
              orderType: [
                {
                  value: order.type,
                  disabled: order.status === this.orderStatus.INACTIVE,
                },
              ],
            })
          );
        });

        this._setOrderers();
      });

    this.subs.sink = this._websocketService
      .onOrderOpened()
      .subscribe((data: any) => {
        this.orders.push(data);
        (<FormArray>this.ordersForm?.get('orders')).push(
          this._formBuilder.group({
            orderType: [
              {
                value: data.type,
                disabled: data.status === this.orderStatus.INACTIVE,
              },
            ],
          })
        );
      });

    this.subs.sink = this._websocketService.onOrderItemAdded().subscribe(() => {
      this._setOrderers();
    });

    this.subs.sink = this._websocketService
      .onRestaurantAdded()
      .subscribe((next: any) => {
        console.log();

        const index = this.orders.findIndex(
          (order) => order.restaurant.id === next.id
        );

        if (index !== -1) {
          // console.log('Close');
          this.orders.splice(index, 1);
          (<FormArray>this.ordersForm?.get('orders')).removeAt(index);
        }
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

    this.subs.sink = this._websocketService
      .onOrderCompleted()
      .pipe(
        switchMap((order: any) => {
          this.orders[
            this.orders.findIndex((el) => el.id === order.id)
          ].status = order.status;
          (<FormArray>this.ordersForm?.get('orders')).controls[
            this.orders.findIndex((el) => el.id === order.id)
          ]
            .get('orderType')
            ?.disable();

          const orderer: IUser = order.orderer;
          return this._userService.getById(orderer.id).pipe(
            switchMap((user: IUser) => {
              user.lastOrder = new Date();
              return this._userService.updateOne(user);
            })
          );
        })
      )
      .subscribe((updatedUser: IUser) => {
        this.orders.forEach((order: IOrder) => {
          if (order.status === this.orderStatus.ACTIVE) {
            order.orderItems.forEach((data) => {
              data.orderedItems?.forEach((item) => {
                item.user =
                  item.user!.id === updatedUser.id ? updatedUser : item.user;
              });
            });
          }
        });

        this._setOrderers();
      });

    this.subs.sink = this._websocketService
      .onOrderTypeUpdate()
      .subscribe((orderId: number) => {
        this.orders = this.orders.map((order: IOrder) => {
          if (order.id == orderId) {
            order.type =
              order.type === this.orderType.DELIVERY
                ? this.orderType.TAKEAWAY
                : this.orderType.DELIVERY;
          }
          return order;
        });
      });

    this.subs.sink = this._websocketService.onCleanUp().subscribe(() => {
      // console.log('Clean');
      // this.orders = [];
      // (<FormArray>this.ordersForm?.get('orders')).clear();
    });
  }

  ngAfterViewChecked(): void {
    // console.log(this.drb?.nativeElement);
  }

  closeRestaurant(id: number | undefined) {
    if (id) {
      this.subs.sink = this._orderService
        .deleteOrder(id)
        .subscribe((data: any) => {
          // this._notificationService.sendCloseRestaurantMessage(
          //   data.restaurant.name
          // );
        });
    }
  }

  confirmOrder(order: IOrder) {
    order.status = OrderStatus.INACTIVE;
    this._orderService
      .completeOrder(order.id, order)
      .pipe(
        switchMap((_) => {
          return this._orderService.getOrderItems(order.id);
        })
      )
      .subscribe((item: IItem[]) => {
        let ids: string[] = [];

        item.forEach((data) => {
          data.orderedItems?.forEach((oi) => {
            if (oi.user?.subscriptionId) {
              ids.push(oi.user.subscriptionId);
            }
          });
        });

        ids = [...new Set(ids)];
        // console.log(ids);

        const str = `Order ${order?.restaurant.name} completed!`;
        this._notificationService.sendNotificationToUsers(ids, str);
      });
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
      if (order.status === OrderStatus.ACTIVE) {
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
      }
    });
  }

  doSomething(order: IOrder) {
    // this.orderTypeForm.get('orderType')?.setValue(order.type);

    return true;
  }

  onOrderTypeChange(order: IOrder) {
    // Order id and order
    const id = order.id;

    const ind = this.orders.findIndex((order) => order.id == id);
    // console.log(ind);

    const formArr: FormGroup[] = <FormGroup[]>(
      (<FormArray>this.ordersForm?.get('orders')).controls
    );

    const type = formArr[ind].get('orderType')?.value;

    console.log(formArr.length);
    console.log(this.orders.length);

    console.log(id, ind, formArr[ind].get('orderType')?.value);
    this._orderService.updateTypeById(id, type);
  }
}
