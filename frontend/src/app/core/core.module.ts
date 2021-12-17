import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlacesComponent } from './places/places.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderItemsComponent } from './orders/order-list/order-items/order-items.component';
import { OrderChatComponent } from './orders/order-list/order-chat/order-chat.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { PlaceListComponent } from './places/place-list/place-list.component';

@NgModule({
  declarations: [
    PlacesComponent,
    OrdersComponent,
    OrderItemsComponent,
    OrderChatComponent,
    OrderListComponent,
    PlaceListComponent,
  ],
  imports: [CommonModule],

  exports: [PlacesComponent, OrdersComponent],
})
export class CoreModule {}
