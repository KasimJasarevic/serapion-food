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
import { switchMap, tap } from 'rxjs';
import { OrderStatus } from '../models/order-status-types';
import { OrderType } from '../models/order-type-types';
import { IOrder } from '../models/order.model';
import { OrderService } from '../services/order.service';
import { IMessage } from './order-chat/models/order-chat.model';
import { IItem } from './order-items/models/order-item.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit, OnDestroy, AfterViewChecked {
  orders: IOrder[] = [];
  users: IUser[] = [];
  orderStatus = OrderStatus;
  orderType = OrderType;
  ordersForm: FormGroup | undefined;
  private subs = new SubSink();

  // orderForms = new FormArray([]);
  // orderTypeForm = new FormGroup({
  //   orderType: new FormControl(),
  // });

  orderArrivalArr!: FormArray;

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

    this.orderArrivalArr = this._formBuilder.array([]);

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

          const orderArrivalTime: FormControl = new FormControl(
            null,
            Validators.required
          );
          this.orderArrivalArr.push(orderArrivalTime);
        });

        this._setOrderers();
      });

    this.subs.sink = this._websocketService
      .onRestaurantUpdated()
      .pipe(switchMap(() => this._orderService.getAllOrders()))
      .subscribe((orders: IOrder[]) => this._populateOrders(orders));

    this.subs.sink = this._websocketService
      .onRestaurantDeleted()
      .pipe(switchMap(() => this._orderService.getAllOrders()))
      .subscribe((orders: IOrder[]) => this._populateOrders(orders));

    // Change this
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

        const orderArrivalTime: FormControl = new FormControl(
          null,
          Validators.required
        );
        this.orderArrivalArr.push(orderArrivalTime);
      });

    this.subs.sink = this._websocketService.onOrderItemAdded().subscribe(() => {
      this._setOrderers();
    });

    this.subs.sink = this._websocketService
      .onCommentReceived()
      .pipe(
        switchMap(({ order }: any) => {
          return this._orderService.getOrderById(order.id);
        })
      )
      .subscribe((updateOrder: IOrder) => {
        if (updateOrder) {
          this.orders.forEach((order: IOrder) => {
            if (order.id === updateOrder.id) {
              order = updateOrder;
            }
          });
        }
      });

    this.subs.sink = this._websocketService
      .onOrderClosed()
      .subscribe((next: IOrder) => {
        if (next) {
          const index = this.orders.findIndex((order) => order.id === next.id);

          if (index !== -1) {
            // console.log('Close');
            this.orders.splice(index, 1);
            (<FormArray>this.ordersForm?.get('orders')).removeAt(index);
            this.orderArrivalArr.removeAt(index);
          }
        }
      });

    // This should be different
    this.subs.sink = this._websocketService
      .onRestaurantAdded()
      .subscribe((next: any) => {
        const index = this.orders.findIndex(
          (order) => order.restaurant.id === next.id
        );

        if (index !== -1) {
          // console.log('Close');
          this.orders.splice(index, 1);
          (<FormArray>this.ordersForm?.get('orders')).removeAt(index);
          this.orderArrivalArr.removeAt(index);
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
      .onOrderItemDeleted()
      .subscribe((data) => {
        this._setOrderers();
      });

    this.subs.sink = this._websocketService
      .onOrderCompleted()
      .pipe(
        switchMap((order: any) => {
          // this.orders[
          //   this.orders.findIndex((el) => el.id === order.id)
          // ].status = order.status;

          this.orders[this.orders.findIndex((el) => el.id === order.id)] =
            order;

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
            if (order.orderItems) {
              order.orderItems.forEach((data) => {
                if (data.orderedItems) {
                  data.orderedItems?.forEach((item) => {
                    item.user =
                      item.user!.id === updatedUser.id
                        ? updatedUser
                        : item.user;
                  });
                }
              });
            }
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

  closeRestaurant({ id }: IOrder) {
    if (confirm(`Are you sure you want to close this order?`)) {
      if (id) {
        this.subs.sink = this._orderService
          .deleteOrderById(id)
          .subscribe((data: any) => {
            if (data && data.id) {
              // Returns deleted order
              this.orders = this.orders.filter(
                (order: IOrder) => order.id !== data.id
              );
            }

            // I don't have any data here, but I can search orders field
            // and get restaurant name...
            // const restaurant = this.orders.find(
            //   (order: IOrder) => order.id === id
            // );
            // console.log(restaurant);
            // this._notificationService.sendCloseRestaurantMessage(
            //   data.restaurant.name
            // );
          });
      }
    }
  }

  confirmOrder(order: IOrder) {
    if (confirm(`Are you sure you want to confirm this order?`)) {
      // Save it!
      order.status = OrderStatus.INACTIVE;
      const today = new Date();
      const ind = this.orders.findIndex((o) => o.id == order.id);
      order.arrivalTime = new Date(
        today.toDateString() + ' ' + this.orderArrivalArr.at(ind).value
      );

      this.subs.sink = this._orderService
        .getOrderItems(order.id)
        .pipe(
          switchMap((items) => {
            order.orderItems = items;
            return this._orderService.getComments(order.id);
          })
        )
        .pipe(
          switchMap((comments) => {
            order.comments = comments;
            return this._orderService.completeOrder(order.id, order);
          })
        )
        .pipe(
          switchMap(() => {
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

          // Filter ids
          const currentUser = JSON.parse(
            localStorage.getItem(
              LocalStorageTypes.FOOD_ORDERING_CURRENT_USER
            ) as string
          );
          ids = [...new Set(ids)];
          if (currentUser && currentUser.subscriptionId) {
            ids = ids.filter((id) => id != currentUser.subscriptionId);
          }

          if (!!ids.length && order.arrivalTime && order.type) {
            const formatTime = order.arrivalTime.toLocaleTimeString(
              navigator.language,
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            );

            const str = `Order ${order?.restaurant.name} completed, and ${
              order.type === this.orderType.DELIVERY
                ? 'it will arrive'
                : 'we depart'
            } @${formatTime}!`;
            this._notificationService.sendNotificationToUsers(ids, str);
          }
        });
    }
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

    const formArr: FormGroup[] = <FormGroup[]>(
      (<FormArray>this.ordersForm?.get('orders')).controls
    );

    const type = formArr[ind].get('orderType')?.value;

    this._orderService.updateTypeById(id, type);
  }

  sendLastCall(order: IOrder) {
    // console.log(`Last call for ${order.restaurant.name}!`);

    this.subs.sink = this._orderService
      .getOrderItems(order.id)
      .subscribe((item: IItem[]) => {
        let ids: string[] = [];

        item.forEach((data) => {
          data.orderedItems?.forEach((oi) => {
            if (oi.user?.subscriptionId) {
              ids.push(oi.user.subscriptionId);
            }
          });
        });

        const currentUser = JSON.parse(
          localStorage.getItem(
            LocalStorageTypes.FOOD_ORDERING_CURRENT_USER
          ) as string
        );
        ids = [...new Set(ids)];
        if (currentUser && currentUser.subscriptionId) {
          ids = ids.filter((id) => id != currentUser.subscriptionId);
        }

        if (!!ids.length) {
          const str = `Last call ${order?.restaurant.name}!`;
          this._notificationService.sendNotificationToUsers(ids, str);
        }
      });
  }

  isSidebarCollapsed() {
    const { sidebar } = JSON.parse(
      localStorage.getItem(
        LocalStorageTypes.FOOD_ORDERING_UI_PREFERENCES
      ) as string
    );

    return sidebar === 'collapsed';
  }

  sendArrivedCall(order: IOrder) {
    // console.log(`Last call for ${order.restaurant.name}!`);

    this.subs.sink = this._orderService
      .getOrderItems(order.id)
      .subscribe((item: IItem[]) => {
        let ids: string[] = [];

        item.forEach((data) => {
          data.orderedItems?.forEach((oi) => {
            if (oi.user?.subscriptionId) {
              ids.push(oi.user.subscriptionId);
            }
          });
        });

        const currentUser = JSON.parse(
          localStorage.getItem(
            LocalStorageTypes.FOOD_ORDERING_CURRENT_USER
          ) as string
        );
        ids = [...new Set(ids)];
        if (currentUser && currentUser.subscriptionId) {
          ids = ids.filter((id) => id != currentUser.subscriptionId);
        }

        if (!!ids.length) {
          const str = `Order arrived ${order?.restaurant.name}!`;
          this._notificationService.sendNotificationToUsers(ids, str);
        }
      });
  }

  private _populateOrders = (orders: IOrder[]) => {
    if (orders) {
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

        const orderArrivalTime: FormControl = new FormControl(
          null,
          Validators.required
        );
        this.orderArrivalArr.push(orderArrivalTime);
      });

      this._setOrderers();
    }
  };
}
