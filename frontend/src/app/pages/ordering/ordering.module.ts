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

@NgModule({
  declarations: [
    LandingComponent,
    PlacesComponent,
    OrdersComponent,
    OrderListComponent,
    PlaceListComponent,
    OrderChatComponent,
    OrderItemsComponent,
  ],
  imports: [CommonModule, OrderingRoutingModule],
})
export class OrderingModule {}
