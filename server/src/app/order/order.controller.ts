import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, switchMap, tap } from 'rxjs';
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
  deleteOrderById(@Param('id') id: number) {
    this._orderService.deleteOrderById(id);
  }

  @Delete('order/:id')
  deleteOrderByOrderId(@Param('id') id: number, @Res() res) {
    this.getOrderById(id)
      .pipe(
        switchMap((order: OrderDTO) => {
          if (order) {
            res.json(order);
            this._websocketGatewayService.sendOrderClosedMessage(order);
          }
          return this._orderService.deleteOrderByOrderId(id);
        }),
      )
      .subscribe();
  }

  @Delete()
  deleteAllOrders() {
    this._orderService.deleteAllOrders();
  }

  @Put(':id')
  completeOrder(@Param('id') id: number, @Body() order: any) {
    return this._orderService.completeOrder(id, order).pipe(
      tap((next: OrderDTO) => {
        this._websocketGatewayService.sendOrderCompletedMessage(next);
      }),
    );
  }

  @Put('type/:id')
  updateTypeById(
    @Param('id') id: number,
    @Body() payload: any,
  ): Observable<any> {
    return this._orderService.updateTypeById(id, payload).pipe(
      tap(() => {
        this._websocketGatewayService.sendOrderTypeUpdatedMessage(id);
      }),
    );
  }
}
