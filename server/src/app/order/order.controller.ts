import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { OrderDTO } from './order.dto';
import { OrderService } from './order.service';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private _orderService: OrderService) {}

  @Get()
  getAllOrders(): Observable<OrderDTO[]> {
    return this._orderService.getAllOrders();
  }
}
