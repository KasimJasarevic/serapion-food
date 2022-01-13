import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { WebsocketGatewayService } from '../events/websocket-gateway.service';
import { OrderDTO } from './order.dto';
import { OrderService } from './order.service';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(
    private _orderService: OrderService,
    private _websocketGatewayService: WebsocketGatewayService,
  ) {}

  @Get()
  getAllOrders(): Observable<OrderDTO[]> {
    return this._orderService.getAllOrders();
  }

  @Get(':id')
  getOrderById(@Param('id') id: number): Observable<OrderDTO> {
    return this._orderService.getOrderById(id);
  }

  @Post()
  addNewOrder(@Body() payload: OrderDTO, @Res() res) {
    this._orderService.addNewOrder(payload).subscribe((order) => {
      this._orderService.getOrderById(order.id).subscribe((order) => {
        this._websocketGatewayService.sendNewOrderMessage(order);
      });

      res.json(order);
    });
  }

  @Delete(':id')
  deleteOrderById(@Param('id') id: number, @Res() res) {
    this._orderService
      .getOrderByRestaurantId(id)
      .subscribe((order: OrderDTO) => {
        this._websocketGatewayService.sendNewRestaurantMessage(
          order.restaurant,
        );

        res.json(order);
      });

    this._orderService.deleteOrderById(id);
  }
}
