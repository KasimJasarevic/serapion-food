import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
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
  //   client.broadcast.emit(WebsocketMessageTypes.RESTAURANT_NEW_EVENT, message);
  // }

  sendNewRestaurantMessage(restaurant: RestaurantDTO) {
    this.server.emit('newRestaurantEvent', restaurant);
  }
}