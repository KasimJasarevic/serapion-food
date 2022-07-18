import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IPlace } from '../models/place.model';
import { PlaceService } from '../services/place.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SubSink } from '../../../../../core/helpers/sub-sink';
import { WebsocketMessagesService } from '../../../../../core/services/websocket-messages.service';
import { OrderService } from '../../orders/services/order.service';
import { LocalStorageTypes } from '@core/enums/local-storage-types';
import { OrderType } from '../../orders/models/order-type-types';
import { OrderStatus } from '../../orders/models/order-status-types';
import { ModalService } from '../services/modal.service';
import { switchMap } from 'rxjs';
import { UserService } from '@core/services/user.service';
import { IUser } from '@core/models/user.model';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.scss'],
})
export class PlaceListComponent implements OnInit, OnDestroy {
  @Input() filterStr: string = '';
  collapsedPlaces$ = this._placeService.collapsedPlaces$;
  updated: Date = new Date();
  @ViewChild('deleteDialog') deleteDialog!: ModalComponent;
  places: IPlace[] = [];
  private subs = new SubSink();

  constructor(
    private _placeService: PlaceService,
    private _websocketService: WebsocketMessagesService,
    private _notificationService: NotificationService,
    private _orderService: OrderService,
    private _userService: UserService,
    private _modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.subs.sink = this._placeService.getAllPlaces().subscribe((places) => {
      this.places = places;
    });

    this.subs.sink = this._websocketService
      .onRestaurantAdded()
      .subscribe((data: any) => {
        this.places.push(data);
        this.updated = new Date();
      });

    this.subs.sink = this._websocketService
      .onOrderOpened()
      .pipe(switchMap(() => this._placeService.getAllPlaces()))
      .subscribe((data: any) => {
        this.places = data;
        this.updated = new Date();
      });

    this.subs.sink = this._websocketService
      .onOrderClosed()
      .pipe(switchMap(() => this._placeService.getAllPlaces()))
      .subscribe((data: any) => {
        this.places = data;
        this.updated = new Date();
      });

    this.subs.sink = this._websocketService
      .onOrderCompleted()
      .pipe(switchMap(() => this._placeService.getAllPlaces()))
      .subscribe((data: any) => {
        this.places = data;
        this.updated = new Date();
      });

    // this.subs.sink = this._websocketService
    //   .onOrderStatusUpdated()
    //   .pipe(switchMap(() => this._placeService.getAllPlaces()))
    //   .subscribe((data: any) => {
    //     this.places = data;
    //     this.updated = new Date();
    //   });

    this.subs.sink = this._websocketService
      .onRestaurantDeleted()
      .subscribe((data: any) => {
        const index = this.places.findIndex((place) => place.id === data.id);
        this.places.splice(index, 1);
        this.updated = new Date();
      });

    this.subs.sink = this._websocketService
      .onRestaurantUpdated()
      .subscribe((data: any) => {
        this.places = this.places.map((place) => {
          if (place.id == data.id) {
            place = data;
          }
          return place;
        });

        this.updated = new Date();
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openRestaurant(place: IPlace) {
    const user = JSON.parse(
      <string>localStorage.getItem(LocalStorageTypes.FOOD_ORDERING_CURRENT_USER)
    );

    if (!user) {
      return;
    }

    const orderData = {
      restaurant: place.id,
      user: user.id,
      type: OrderType.DELIVERY,
      status: OrderStatus.ACTIVE,
    };

    this.subs.sink = this._orderService.addNewOrder(orderData).subscribe(() => {
      const str = `Restaurant ${place.name} opened!`;
      this._notificationService.sendNotificationToSubscribedUsers(str);
    });
  }

  editRestaurant(id: number) {
    this._modalService.modalOpen(id);
  }

  deletePlace(name: string) {
    // if (confirm(`Are you sure you want to delete this restaurant?`)) {
    this.subs.sink = this.deleteDialog
      .toggleModal(`delete-${name}`)
      .subscribe((confirmation) => {
        if (confirmation) {
          this._placeService.deletePlace(name).subscribe();
        }
      });
  }

  hasActiveOrders = ({ orders }: IPlace) => {
    if (orders && !!orders.length) {
      const activeOrders = orders
        .filter(
          (order) =>
            order.status === OrderStatus.ACTIVE ||
            order.status === OrderStatus.LOCKED
        )
        .map((order) => order.status);

      if (!!activeOrders.length) {
        return true;
      }
    }

    return false;
  };

  togglePlace = (id?: number) => {
    if (id) {
      this._placeService.togglePlace(id);
    }
  };

  isExpanded = (ids: number[], placeId: number | undefined) => {
    if (placeId) {
      const index = ids.findIndex((id) => id === placeId);
      if (index !== -1) {
        return true;
      }
    }

    return false;
  };
}
