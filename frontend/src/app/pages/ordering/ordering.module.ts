import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderingRoutingModule } from './ordering-routing.module';
import { LandingComponent } from './components/landing/landing.component';
import { PlacesComponent } from './components/places/places.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderListComponent } from './components/orders/order-list/order-list.component';
import { PlaceListComponent } from './components/places/place-list/place-list.component';
import { OrderChatComponent } from './components/orders/order-list/order-chat/order-chat.component';
import { OrderItemsComponent } from './components/orders/order-list/order-items/order-items.component';
import { FormsModule } from '@angular/forms';
import { PlaceFormComponent } from './components/places/place-form/place-form.component';
import {OneSignalService} from "onesignal-ngx";
import {NotificationService} from "../../core/services/notification.service";

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
  ],
  imports: [CommonModule, OrderingRoutingModule, FormsModule],
})
export class OrderingModule {
  constructor(private _notificationService: NotificationService) {
    this._notificationService.init();
  }
}
