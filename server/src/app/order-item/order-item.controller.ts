import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { WebsocketGatewayService } from '../events/websocket-gateway.service';
import { OrderItemUserService } from '../order-item-user/order-item-user.service';
import { UserService } from '../user/user.service';
import { OrderItemPayload, OrderItemPostRequest } from './order-item.dto';
import { OrderItemService } from './order-item.service';

@Controller('order-items')
export class OrderItemController {
  constructor(
    private _orderItemService: OrderItemService,
    private _userService: UserService,
    private _orderItemUserService: OrderItemUserService,
    private _websocketGatewayService: WebsocketGatewayService,
  ) {}

  @Get('orders/:id')
  gerOrderOrdererId(@Param('id') id: number) {
    return this._orderItemService.getOrderOrdererId(id);
  }

  @Post()
  addNewOrderItem(
    @Body(new ValidationPipe({ transform: true }))
    payload: OrderItemPostRequest,
    @Res() res,
  ) {
    // Here I need a validation pipe

    this._orderItemService.addNewOrderItem(payload).subscribe((orderItem) => {
      this._websocketGatewayService.sendNewOrderItemMessage(orderItem);
      res.json(orderItem);
    });
  }

  @Post(':id')
  appendNewOrderItem(
    @Param('id') id: number,
    @Body() payload: any,
    @Res() res,
  ) {
    this._orderItemService.getOrderItemById(id).subscribe((orderItem) => {
      this._orderItemService
        .appendOrderItemUser(orderItem, payload.user)
        .subscribe((next) => {
          this._websocketGatewayService.sendNewOrderItemUserMessage(next);
          res.json(next);
        });
    });
  }

  @Get('order/:id')
  getOrderItemsByOrderId(@Param('id') id: number) {
    return this._orderItemService.getOrderItemsByOrderIds(id);
  }

  @Delete()
  removeOrderItemUser(
    @Query('_item') itemId: number,
    @Query('_user') userId: number,
  ) {
    this._orderItemUserService
      .getOrderItemUserByItemAndUserId(itemId, userId)
      .subscribe((next) => {
        this._orderItemUserService.removeOrderItemUserById(next.id);
        this._websocketGatewayService.sendDeleteOrderItemUserMessage(next);
      });
  }

  @Put()
  updateOrderItem(@Body() payload: OrderItemPayload) {
    this._userService.getOneById(payload.userId).subscribe((user) => {
      this._orderItemService.updateOrderItem({
        ...payload,
        user,
      });
    });
  }

  @Delete(':id')
  deleteOrderItemById(@Param('id') itemId: number) {
    this._orderItemService.deleteOrderItemById(itemId);
    this._websocketGatewayService.sendDeleteOrderItemMessage(itemId);
  }
}
