import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { IOrder } from 'src/app/pages/ordering/components/orders/models/order.model';
import { WebsocketMessageTypes } from '../enums/websocket-message.types';

@Injectable({
  providedIn: 'root',
})
export class WebsocketMessagesService {
  constructor(private _socket: Socket) {}

  onCommentReceived() {
    return this._socket.fromEvent(WebsocketMessageTypes.COMMENT_EVENT);
  }

  onCommentDeleted() {
    return this._socket.fromEvent<number>(
      WebsocketMessageTypes.COMMENT_DELETED
    );
  }

  onOrderItemAdded() {
    return this._socket.fromEvent(WebsocketMessageTypes.ORDER_ITEM_EVENT);
  }

  onOrderItemDeleted() {
    return this._socket.fromEvent(
      WebsocketMessageTypes.ORDER_ITEM_DELETE_EVENT
    );
  }

  onOrderItemUserAdded() {
    return this._socket.fromEvent(WebsocketMessageTypes.ORDER_ITEM_USER_EVENT);
  }

  onOrderItemUserDeleted() {
    return this._socket.fromEvent(
      WebsocketMessageTypes.ORDER_ITEM_USER_DELETE_EVENT
    );
  }

  onOrderCompleted() {
    return this._socket.fromEvent<IOrder>(
      WebsocketMessageTypes.ORDER_COMPLETED_EVENT
    );
  }

  onOrderStatusUpdated() {
    return this._socket.fromEvent<IOrder>(
      WebsocketMessageTypes.ORDER_STATUS_UPDATED
    );
  }

  onOrderClosed() {
    return this._socket.fromEvent<IOrder>(
      WebsocketMessageTypes.ORDER_CLOSED_EVENT
    );
  }

  onRestaurantAdded() {
    return this._socket.fromEvent(WebsocketMessageTypes.RESTAURANT_NEW_EVENT);
  }

  onRestaurantUpdated() {
    return this._socket.fromEvent(
      WebsocketMessageTypes.RESTAURANT_NEW_UPDATE_EVENT
    );
  }

  onRestaurantDeleted() {
    return this._socket.fromEvent(
      WebsocketMessageTypes.RESTAURANT_DELETED_EVENT
    );
  }

  onOrderOpened() {
    return this._socket.fromEvent(WebsocketMessageTypes.ORDER_NEW_EVENT);
  }

  onOrderTypeUpdate() {
    return this._socket.fromEvent<number>(
      WebsocketMessageTypes.ORDER_TYPE_EVENT
    );
  }

  onCleanUp() {
    return this._socket.fromEvent(WebsocketMessageTypes.CLEAN_UP_EVENT);
  }
}
