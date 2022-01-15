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
import { OneSignalService } from 'onesignal-ngx';
import { NotificationService } from '../../core/services/notification.service';
import { FilterPipe } from './components/places/place-list/pipes/filter.pipe';
import { SharedModule } from 'src/app/shared/shared.module';
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
    FilterPipe,
  ],
  imports: [CommonModule, OrderingRoutingModule, FormsModule, SharedModule],
})
export class OrderingModule {
  constructor(private _notificationService: NotificationService) {
    this._notificationService.init();
  }
}
