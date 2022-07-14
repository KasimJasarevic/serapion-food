import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { debounceTime, Subject, switchMap } from 'rxjs';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
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
export class OrderListComponent implements OnInit, OnDestroy {
  orders: IOrder[] = [];
  users: IUser[] = [];
  orderStatus = OrderStatus;
  orderType = OrderType;
  ordersForm: FormGroup | undefined;
  private subs = new SubSink();
  orderArrivalArr!: FormArray;
  @ViewChild('cancelDialog') cancelDialog!: ModalComponent;
  @ViewChild('confirmDialog') confirmDialog!: ModalComponent;
  updated: Date = new Date();
  private lastCallButton = new Subject<IOrder>();
  private arrivedCallButton = new Subject<IOrder>();

  constructor(
    private _orderService: OrderService,
    private _userService: UserService,
    private _websocketService: WebsocketMessagesService,
    private _notificationService: NotificationService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.ordersForm = this._formBuilder.group({
      orders: this._formBuilder.array([]),
    });

    this.orderArrivalArr = this._formBuilder.array([]);

    const lastCallButtonDebounced = this.lastCallButton.pipe(
      debounceTime(2000)
    );

    this.subs.sink = lastCallButtonDebounced.subscribe((order: IOrder) => {
      // console.log('Sending last call...');
      this.sendLastCallToAll(order);
    });

    const arrivedCallButtonDebounced = this.arrivedCallButton.pipe(
      debounceTime(2000)
    );

    this.subs.sink = arrivedCallButtonDebounced.subscribe((order: IOrder) => {
      // console.log('Sending arrived call...');
      this.sendArrivedCall(order);
    });

    // // // This was changed !!!!!!!!
    // this.subs.sink = this._orderService
    //   .getAllOrders()
    //   .subscribe((orders: IOrder[]) => {
    //     this.orders = orders;

    //     this.orders.forEach((order: IOrder) => {
    //       (<FormArray>this.ordersForm?.get('orders')).push(
    //         this._formBuilder.group({
    //           orderType: [
    //             {
    //               value: order.type,
    //               disabled: order.status === this.orderStatus.INACTIVE,
    //             },
    //           ],
    //         })
    //       );

    //       const orderArrivalTime: FormControl = new FormControl(
    //         null,
    //         Validators.required
    //       );
    //       this.orderArrivalArr.push(orderArrivalTime);
    //     });

    //     this._setOrderers();
    //   });

    this.subs.sink = this._orderService
      .getAllOrders()
      .subscribe((orders: IOrder[]) => {
        this._populateOrders(orders);
        this.updated = new Date();
      });

    this.subs.sink = this._websocketService
      .onRestaurantUpdated()
      .pipe(switchMap(() => this._orderService.getAllOrders()))
      .subscribe((orders: IOrder[]) => {
        this._populateOrders(orders);
        this.updated = new Date();
      });

    this.subs.sink = this._websocketService
      .onRestaurantDeleted()
      .pipe(switchMap(() => this._orderService.getAllOrders()))
      .subscribe((orders: IOrder[]) => {
        this._populateOrders(orders);
        this.updated = new Date();
      });

    // // // This was changed !!!!!!!!
    // Change this
    // this.subs.sink = this._websocketService
    //   .onOrderOpened()
    //   .subscribe((data: any) => {
    //     this.orders.push(data);
    //     (<FormArray>this.ordersForm?.get('orders')).push(
    //       this._formBuilder.group({
    //         orderType: [
    //           {
    //             value: data.type,
    //             disabled: data.status === this.orderStatus.INACTIVE,
    //           },
    //         ],
    //       })
    //     );

    //     const orderArrivalTime: FormControl = new FormControl(
    //       null,
    //       Validators.required
    //     );
    //     this.orderArrivalArr.push(orderArrivalTime);
    //     this.updated = new Date();
    //   });

    this.subs.sink = this._websocketService
      .onOrderOpened()
      .pipe(switchMap(() => this._orderService.getAllOrders()))
      .subscribe((orders: IOrder[]) => {
        this._populateOrders(orders);
        this.updated = new Date();
      });

    // Fixed works fine now.
    this.subs.sink = this._websocketService
      .onOrderItemAdded()
      .subscribe((item: any) => {
        this.orders.forEach((order: IOrder) => {
          if (item.order.id && order.id === item.order.id) {
            if (order.orderItems) {
              order.orderItems.push(item);
            } else {
              order.orderItems = [item];
            }
          }
        });

        this._setNewOrderer(item.order);
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

    // // // This was changed!!!!
    // this.subs.sink = this._websocketService
    //   .onOrderClosed()
    //   .subscribe((next: IOrder) => {
    //     if (next) {
    //       const index = this.orders.findIndex((order) => order.id === next.id);

    //       if (index !== -1) {
    //         this.orders.splice(index, 1);
    //         (<FormArray>this.ordersForm?.get('orders')).removeAt(index);
    //         this.orderArrivalArr.removeAt(index);
    //       }
    //     }

    //     this.updated = new Date();
    //   });

    this.subs.sink = this._websocketService
      .onOrderClosed()
      .pipe(switchMap(() => this._orderService.getAllOrders()))
      .subscribe((orders: IOrder[]) => {
        this._populateOrders(orders);
        this.updated = new Date();
      });

    // // // This was changed
    // This should be different
    // this.subs.sink = this._websocketService
    //   .onRestaurantAdded()
    //   .subscribe((next: any) => {
    //     const index = this.orders.findIndex(
    //       (order) => order.restaurant.id === next.id
    //     );

    //     if (index !== -1) {
    //       this.orders.splice(index, 1);
    //       (<FormArray>this.ordersForm?.get('orders')).removeAt(index);
    //       this.orderArrivalArr.removeAt(index);
    //     }
    //   });

    this.subs.sink = this._websocketService
      .onRestaurantAdded()
      .pipe(switchMap(() => this._orderService.getAllOrders()))
      .subscribe((orders: IOrder[]) => {
        this._populateOrders(orders);
        this.updated = new Date();
      });

    // Fixed works fine now.
    this.subs.sink = this._websocketService
      .onOrderItemUserAdded()
      .subscribe((item: any) => {
        this.orders.forEach((order: IOrder) => {
          order.orderItems &&
            order.orderItems.forEach((orderItem: IItem) => {
              if (orderItem.id === item.id) {
                this._setNewOrderer(order);
              }
            });
        });
      });

    // Fixed works well now.
    this.subs.sink = this._websocketService
      .onOrderItemUserDeleted()
      .subscribe((deletedData: any) => {
        this.orders.forEach((order: IOrder) => {
          order.orderItems &&
            order.orderItems.forEach((item: IItem) => {
              if (
                deletedData.orderItem &&
                deletedData.orderItem.id === item.id
              ) {
                this._setNewOrderer(order);
              }
            });
        });
      });

    // Order locking
    this.subs.sink = this._websocketService
      .onOrderStatusUpdated()
      .subscribe((order: IOrder) => {
        this.orders.forEach((_order: IOrder) => {
          if (order.id === _order.id) {
            _order = order;
          }
        });
      });

    // Fixed works fine now.
    this.subs.sink = this._websocketService
      .onOrderItemDeleted()
      .subscribe((itemId: any) => {
        this.orders.forEach((order: IOrder) => {
          order.orderItems &&
            order.orderItems.forEach((item: IItem) => {
              if (itemId && +itemId === item.id) {
                this._setNewOrderer(order);
              }
            });
        });
      });

    // // // This was changed!!!!!
    // this.subs.sink = this._websocketService
    //   .onOrderCompleted()
    //   .pipe(
    //     switchMap((order: any) => {
    //       this.orders[this.orders.findIndex((el) => el.id === order.id)] =
    //         order;

    //       (<FormArray>this.ordersForm?.get('orders')).controls[
    //         this.orders.findIndex((el) => el.id === order.id)
    //       ]
    //         .get('orderType')
    //         ?.disable();

    //       const orderer: IUser = order.orderer;
    //       return this._userService.getById(orderer.id).pipe(
    //         switchMap((user: IUser) => {
    //           user.lastOrder = new Date();
    //           return this._userService.updateOne(user);
    //         })
    //       );
    //     })
    //   )
    //   .subscribe((updatedUser: IUser) => {
    //     this.orders.forEach((order: IOrder) => {
    //       if (order.status === this.orderStatus.ACTIVE) {
    //         if (order.orderItems) {
    //           order.orderItems.forEach((data) => {
    //             if (data.orderedItems) {
    //               data.orderedItems?.forEach((item) => {
    //                 item.user =
    //                   item.user!.id === updatedUser.id
    //                     ? updatedUser
    //                     : item.user;
    //               });
    //             }
    //           });
    //         }
    //       }
    //     });

    //     this.updated = new Date();
    //     this._setOrderers();
    //   });

    this.subs.sink = this._websocketService
      .onOrderCompleted()
      .pipe(
        switchMap((order: any) => {
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
      .pipe(switchMap(() => this._orderService.getAllOrders()))
      .subscribe((orders: IOrder[]) => {
        this._populateOrders(orders);
        this.updated = new Date();
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

    // this.subs.sink = this._websocketService
    //   .onOrderTypeUpdate()
    //   .pipe(switchMap(() => this._orderService.getAllOrders()))
    //   .subscribe((orders: IOrder[]) => {
    //     this._populateOrders(orders);
    //     this.updated = new Date();
    //   });

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
    this.subs.sink = this.cancelDialog
      .toggleModal(`cancel-${id}`)
      .subscribe((confirmation) => {
        if (id && confirmation) {
          this.subs.sink = this._orderService
            .deleteOrderById(id)
            .subscribe((data: any) => {
              if (data && data.id) {
                this.orders = this.orders.filter(
                  (order: IOrder) => order.id !== data.id
                );
              }
            });
        }
      });
  }

  confirmOrder(order: IOrder) {
    this.subs.sink = this._orderService
      .getOrderItems(order.id)
      .pipe(
        switchMap((items) => {
          this.orders.forEach((o) => {
            if (o.id === order.id) {
              o.orderItems = items;
            }
          });
          return this.confirmDialog.toggleModal(`confirm-${order.id}`);
        })
      )
      .subscribe((confirmation) => {
        // Save it!
        if (order && confirmation) {
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
              if (order.arrivalTime && order.type) {
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
                this._notificationService.sendNotificationToSubscribedUsers(
                  str
                );
              }
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public getOwnerFullName(order: IOrder) {
    return `${order.user?.firstName} ${order.user?.lastName}`;
  }

  private getOwnerId(order: IOrder) {
    return order.user?.id;
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

  private _setNewOrderer(thisOrder: IOrder) {
    this.orders.forEach((order) => {
      if (order.status === OrderStatus.ACTIVE && order.id === thisOrder.id) {
        this.subs.sink = this._orderService
          .getOrderOrderer(order.id)
          .subscribe((next) => {
            if (next && order.id === thisOrder.id) {
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

  onOrderTypeChange(order: IOrder) {
    const id = order.id;

    const ind = this.orders.findIndex((order) => order.id == id);

    const formArr: FormGroup[] = <FormGroup[]>(
      (<FormArray>this.ordersForm?.get('orders')).controls
    );

    const type = formArr[ind].get('orderType')?.value;

    this._orderService.updateTypeById(id, type);
  }

  sendLastCallToAll(order: IOrder) {
    this._notificationService.sendLastCall(order?.restaurant.name);
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
    this.subs.sink = this._orderService
      .getOrderItems(order.id)
      .subscribe((item: IItem[]) => {
        // const str = `Order arrived ${order?.restaurant.name} ${
        //   order.type === this.orderType.DELIVERY
        //     ? 'it will arrive'
        //     : 'we depart'
        // }`;

        const str = `${
          order.type === this.orderType.DELIVERY
            ? 'Order arrived from'
            : 'We depart for'
        } ${order?.restaurant.name}`;

        this._notificationService.sendNotificationToSubscribedUsers(str);
        // const str = `Order arrived ${order?.restaurant.name}!`;
      });
  }

  private _populateOrders = (orders: IOrder[]) => {
    if (orders) {
      this.orders = orders;
      this._sortOrders('date', 'asc');

      this.ordersForm = this._formBuilder.group({
        orders: this._formBuilder.array([]),
      });

      this.orderArrivalArr = this._formBuilder.array([]);

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

  private _sortOrders = (
    fieldCriteria: string,
    sortDirection: string
  ): void => {
    let direction = sortDirection !== 'desc' ? 1 : -1;

    this.orders.sort((a: IOrder, b: IOrder) => {
      const firstRestaurantOpenedAt = a.openedAt!;
      const secondRestaurantOpenedAt = b.openedAt!;

      if (firstRestaurantOpenedAt < secondRestaurantOpenedAt) {
        return -1 * direction;
      } else if (firstRestaurantOpenedAt > secondRestaurantOpenedAt) {
        return 1 * direction;
      } else {
        return 0;
      }
    });

    this.orders = [
      ...this.orders.filter(
        (order: IOrder) => order.status === OrderStatus.ACTIVE
      ),
      ...this.orders.filter(
        (order: IOrder) => order.status === OrderStatus.INACTIVE
      ),
    ];
  };

  public sendLastCallToAllDebounced = (order: IOrder) => {
    this.lastCallButton.next(order);
  };

  public sendArrivedCallDebounced = (order: IOrder) => {
    this.arrivedCallButton.next(order);
  };

  public lockOrder = (order: IOrder) => {
    console.log('Current order status: ' + order.status);

    if (order.status === OrderStatus.LOCKED) {
      order.status = OrderStatus.ACTIVE;
    } else if (order.status === OrderStatus.ACTIVE) {
      order.status = OrderStatus.LOCKED;
    }

    this.subs.sink = this._orderService
      .updateOrderStatus(order.id, order)
      .subscribe();
  };
}
