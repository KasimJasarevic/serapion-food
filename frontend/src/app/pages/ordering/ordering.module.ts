import {NgModule, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderingRoutingModule} from './ordering-routing.module';
import {LandingComponent} from './components/landing/landing.component';
import {PlacesComponent} from './components/places/places.component';
import {OrdersComponent} from './components/orders/orders.component';
import {OrderListComponent} from './components/orders/order-list/order-list.component';
import {PlaceListComponent} from './components/places/place-list/place-list.component';
import {OrderChatComponent} from './components/orders/order-list/order-chat/order-chat.component';
import {OrderItemsComponent} from './components/orders/order-list/order-items/order-items.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PlaceFormComponent} from './components/places/place-form/place-form.component';
import {NotificationService} from '../../core/services/notification.service';
import {FilterPipe} from './components/places/place-list/pipes/filter.pipe';
import {PlaceModalComponent} from './components/places/place-modal/place-modal.component';
import {UniqueFilterPipe} from './components/orders/order-list/order-items/pipes/unique-filter.pipe';
import {MentionModule} from 'angular-mentions';
import {SharedModule} from 'src/app/shared/shared.module';
import {UserService} from "@core/services/user.service";
import {Subscription} from "rxjs";

// import { FilterPipe } from './components/orders/order-list/order-chat/pipes/filter.pipe';

@NgModule({
  declarations: [
    LandingComponent,
    PlacesComponent,
    OrdersComponent,
    OrderListComponent,
    PlaceListComponent,
    OrderChatComponent,
    OrderItemsComponent,
    PlaceFormComponent,
    PlaceModalComponent,
    FilterPipe,
    PlaceModalComponent,
    UniqueFilterPipe,
  ],
  imports: [
    CommonModule,
    OrderingRoutingModule,
    FormsModule,
    MentionModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class OrderingModule implements OnDestroy {
  private subs: Subscription;

  constructor(private _notificationService: NotificationService,
              private _userService: UserService) {
    this._notificationService.init();
    this.subs = this._userService.userSubjectChange.subscribe(user => {
      if(user) {
        this._notificationService.getSubscriptionUserId();
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
