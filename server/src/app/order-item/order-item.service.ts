import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { OrderItemDTO, OrderItemPostRequest } from './order-item.dto';
import { OrderItemEntity } from './order-item.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItemEntity)
    private _orderitemRepo: Repository<OrderItemEntity>,
  ) {}

  getOrderItemsByOrderId(orderId: number): Observable<OrderItemDTO[]> {
    return from(
      this._orderitemRepo
        .createQueryBuilder('order_item')
        .innerJoinAndSelect('order_item.users', 'users')
        .innerJoinAndSelect('order_item.order', 'order')
        .where('order.id = :id', { id: orderId })
        .loadRelationCountAndMap('order_item.usersCount', 'order_item.users')
        .getMany(),
    );
  }

  addNewOrderItem(place: OrderItemPostRequest): Observable<OrderItemDTO> {
    return from(this._orderitemRepo.create(place).save());
  }
}
