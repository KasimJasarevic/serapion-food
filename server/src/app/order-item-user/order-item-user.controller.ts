import { Controller } from '@nestjs/common';
import { OrderItemUserService } from './order-item-user.service';

@Controller('order-item-user')
export class OrderItemUserController {
  constructor(private _orderItemUserService: OrderItemUserService) {}
}
