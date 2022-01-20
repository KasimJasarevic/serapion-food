import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
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
        .leftJoinAndSelect('order.orderItems', 'orderItems')
        .leftJoinAndSelect('orderItems.orderedItems', 'orderedItems')
        .leftJoinAndSelect('orderedItems.user', 'users')
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

  getOrderByRestaurantId(id: number): Observable<OrderDTO> {
    return from(
      this._orderRepo
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.restaurant', 'restaurant')
        .where('restaurant.id = :id', { id: id })
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

  deleteOrderById(restaurantId: number) {
    this._orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.restaurant', 'restaurant')
      .delete()
      .where('restaurant.id = :id', { id: restaurantId })
      .execute();
  }

  // @Cron('*/1 * * * *')
  // testCron() {
  //   console.log('1 min passed.');
  // }

  @Cron('0 17 * * *')
  deleteAllOrders() {
    console.log('Clear all orders!');
    this._orderRepo.createQueryBuilder('order').delete().execute();
  }
}
