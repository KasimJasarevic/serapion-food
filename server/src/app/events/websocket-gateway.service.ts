import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { CommentDTO } from '../comment/comment.dto';
import {
  OrderItemByIdGetRequest,
  OrderItemDTO,
  OrderItemUserDeleteResponse,
} from '../order-item/order-item.dto';
import { OrderDTO } from '../order/order.dto';
import { RestaurantDTO } from '../restaurant/restaurant.dto';

@WebSocketGateway()
export class WebsocketGatewayService {
  @WebSocketServer() server;

  // @UseGuards(AuthGuard('jwt'))
  // @SubscribeMessage(WebsocketMessageTypes.COMMENT_EVENT)
  // async onComment(client, message) {
  //   client.broadcast.emit(WebsocketMessageTypes.COMMENT_EVENT, message);
  // }
  //
  // @UseGuards(AuthGuard('jwt'))
  // @SubscribeMessage(WebsocketMessageTypes.ORDER_ITEM_EVENT)
  // async onOrderItem(client, message) {
  //   client.broadcast.emit(WebsocketMessageTypes.ORDER_ITEM_EVENT, message);
  // }
  //
  // @UseGuards(AuthGuard('jwt'))
  // @SubscribeMessage(WebsocketMessageTypes.RESTAURANT_NEW_EVENT)
  // async onRestaurantAdded(client, message) {
  // client.broadcast.emit(WebsocketMessageTypes.RESTAURANT_NEW_EVENT, message);
  // }

  sendNewOrderItemMessage(item: OrderItemDTO) {
    this.server.emit('orderItemEvent', item);
  }

  sendNewOrderItemUserMessage(item: OrderItemByIdGetRequest) {
    this.server.emit('orderItemUserEvent', item);
  }

  sendDeleteOrderItemUserMessage(item: OrderItemUserDeleteResponse) {
    this.server.emit('deleteOrderItemUserEvent', item);
  }

  sendNewRestaurantMessage(restaurant: RestaurantDTO) {
    this.server.emit('newRestaurantEvent', restaurant);
  }

  sendNewRestaurantDeletedMessage(restaurant: RestaurantDTO) {
    this.server.emit('deleteRestaurantEvent', restaurant);
  }

  sendNewOrderMessage(order: OrderDTO) {
    this.server.emit('orderNewEvent', order);
  }

  sendNewCommentMessage(comment: CommentDTO) {
    this.server.emit('commentEvent', comment);
  }

  sendDeleteOrderItemMessage(itemId: number) {
    this.server.emit('orderItemDeleteEvent', itemId);
  }
}
