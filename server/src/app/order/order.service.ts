import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { OrderDTO } from './order.dto';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity) private _orderRepo: Repository<OrderEntity>,
  ) {}

  testQueryBuilder(): Observable<any> {
    // return from(
    //   this._orderRepo
    //     .createQueryBuilder('order')
    //     .leftJoin('order.user', 'user')
    //     .leftJoin('order.restaurant', 'restaurant')
    //     .leftJoin('order.orderItems', 'orderItems')
    //     .leftJoin('orderItems.orderedItems', 'orderedItems')
    //     .leftJoin('orderedItems.user', 'users')
    //     .select(['order.id'])
    //     .addSelect('user.firstName')
    //     .getMany(),
    // );
    // return from(
    //   this._orderRepo
    //     .createQueryBuilder('order')
    //     .leftJoin('order.user', 'user')
    //     .leftJoin('order.restaurant', 'restaurant')
    //     .leftJoin('order.orderItems', 'orderItems')
    //     .leftJoin('orderItems.orderedItems', 'orderedItems')
    //     .leftJoin('orderedItems.user', 'users')
    //     .select(['order.id'])
    //     .addSelect(['orderedItems.user'])
    //     .getMany(),
    // );

    return from(
      this._orderRepo
        .createQueryBuilder('o')
        .innerJoinAndSelect('o.user', 'u', 'u.firstName = :name', {
          name: 'Emir',
        })
        .where((querybuilder) => {
          const subquery = querybuilder
            .subQuery()
            .select('user.id')
            .from(UserEntity, 'user')
            .orderBy('user.last_order', 'DESC')
            .limit(1)
            .getQuery();
          console.log(subquery);

          return 'u.id = ' + subquery;
        })
        .getMany(),
    );
  }

  getAllOrders(): Observable<OrderDTO[]> {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return from(
      this._orderRepo
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.restaurant', 'restaurant')
        .leftJoinAndSelect('order.orderItems', 'orderItems')
        .leftJoinAndSelect('orderItems.orderedItems', 'orderedItems')
        .leftJoinAndSelect('orderedItems.user', 'users')
        .where('order.openedAt >= :date', { date: date })
        .getMany(),
    );
  }

  getOrderById(id: number): Observable<OrderDTO> {
    return from(
      this._orderRepo
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.restaurant', 'restaurant')
        .leftJoinAndSelect('order.comments', 'comments')
        .leftJoinAndSelect('comments.user', 'users')
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

  completeOrder(id: number, order: OrderDTO): Observable<OrderDTO> {
    return from(this._orderRepo.save(order));
  }

  updateTypeById(id: number, payload: any): Observable<any> {
    return from(this._orderRepo.update(id, payload));
  }

  // @Cron('*/1 * * * *')
  // testCron() {
  //   console.log('Each minute');
  // }

  // @Cron('*/30 * * * * *')
  @Cron('0 17 * * *')
  deleteAllOrders() {
    // console.log('Clear all orders!');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    this._orderRepo
      .createQueryBuilder('order')
      .delete()
      .where('order.openedAt <= :date', { date: yesterday })
      .execute();
  }
}
