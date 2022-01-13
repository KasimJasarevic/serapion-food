import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { WebsocketGatewayService } from '../events/websocket-gateway.service';
import { OrderItemDTO } from './order-item.dto';
import { OrderItemService } from './order-item.service';

@Controller('order-items')
export class OrderItemController {
  constructor(
    private _orderItemService: OrderItemService,
    private _websocketGatewayService: WebsocketGatewayService,
  ) {}

  @Post()
  addNewOrderItem(@Body() payload: OrderItemDTO, @Res() res) {
    // this._restaurantService.addNewPlace(payload).subscribe((place) => {
    //   this._websocketGatewayService.sendNewRestaurantMessage(place);
    //   res.json(place);
    // });

    this._orderItemService.addNewOrderItem(payload).subscribe((orderItem) => {
      this._websocketGatewayService.sendNewOrderItemMessage({
        usersCount: orderItem.users.length,
        ...orderItem,
      });
      res.json(orderItem);
    });
  }

  @Get('order/:id')
  getOrderItemsByOrderId(@Param('id') id: number) {
    return this._orderItemService.getOrderItemsByOrderId(id);
  }
}
