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
import { Observable, tap } from 'rxjs';
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

  @Delete()
  deleteAllOrders() {
    this._orderService.deleteAllOrders();
  }

  @Put(':id')
  completeOrder(@Param('id') id: number, @Body() order: any) {
    // console.log(id);
    // console.log(order);
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
    // console.log(id);
    // console.log(payload);

    return this._orderService.updateTypeById(id, payload).pipe(
      tap(() => {
        // console.log('Event fired!');
        this._websocketGatewayService.sendOrderTypeUpdatedMessage(id);
      }),
    );
  }

  @Get('docs/:id')
  testQueryBuilder() {
    console.log('Testing TypeORMs QueryBuilder.');

    return this._orderService.testQueryBuilder();
  }
}
