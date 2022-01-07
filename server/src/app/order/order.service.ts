import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { OrderDTO } from './order.dto';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity) private _orderRepo: Repository<OrderEntity>,
  ) {}

  getAllOrders(): Observable<OrderDTO[]> {
    // This should be done with QueryBuilder!
    return from(this._orderRepo.find());
  }
}
