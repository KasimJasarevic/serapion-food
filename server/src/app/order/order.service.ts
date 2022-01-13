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
    return from(
      this._orderRepo
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.restaurant', 'restaurant')
        .getMany(),
    );
  }

  getOrderById(id: number): Observable<OrderDTO> {
    return from(
      this._orderRepo
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.restaurant', 'restaurant')
        .where('order.id = :id', { id: id })
        .getOne(),
    );
  }

  addNewOrder(payload: OrderDTO): Observable<OrderDTO> {
    const order: OrderDTO = {
      user: payload.user,
      type: payload.type,
      status: payload.status,
      restaurant: payload.restaurant,
    };

    return from(this._orderRepo.create(order).save());
  }
}
