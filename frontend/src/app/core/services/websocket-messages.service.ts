import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { WebsocketMessageTypes } from '../enums/websocket-message.types';

@Injectable({
  providedIn: 'root',
})
export class WebsocketMessagesService {
  constructor(private _socket: Socket) {}

  onCommentReceived() {
    return this._socket.fromEvent(WebsocketMessageTypes.COMMENT_EVENT);
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

  onRestaurantAdded() {
    return this._socket.fromEvent(WebsocketMessageTypes.RESTAURANT_NEW_EVENT);
  }

  onRestaurantDeleted() {
    return this._socket.fromEvent(
      WebsocketMessageTypes.RESTAURANT_DELETED_EVENT
    );
  }

  onOrderOpened() {
    return this._socket.fromEvent(WebsocketMessageTypes.ORDER_NEW_EVENT);
  }
}
