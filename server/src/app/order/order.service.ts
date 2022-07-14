import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { OrderDTO } from './order.dto';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderService {
  private logger = new Logger(OrderService.name);
  constructor(
    @InjectRepository(OrderEntity) private _orderRepo: Repository<OrderEntity>,
  ) {}

  getAllOrders(): Observable<OrderDTO[]> {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    // order.openedAt error?
    return from(
      this._orderRepo
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.restaurant', 'restaurant')
        .leftJoinAndSelect('order.orderItems', 'orderItems')
        .leftJoinAndSelect('orderItems.orderedItems', 'orderedItems')
        .leftJoinAndSelect('orderedItems.user', 'users')
        .where('order.opened_at >= :date', { date: date })
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

  public updateOrderStatus = (
    id: number,
    order: OrderDTO,
  ): Observable<OrderDTO> => {
    return from(this._orderRepo.save(order));
  };

  @Cron('0 17 * * *')
  deleteAllOrders() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    this._orderRepo
      .createQueryBuilder('order')
      .delete()
      .where('order.openedAt <= :date', { date: yesterday })
      .execute();
  }

  deleteOrderByOrderId = (id: number): Observable<any> => {
    return from(this._orderRepo.delete(id));
  };

  cleanupOrders() {
    const today = new Date();
    this.logger.warn(`TIME[${today}]`, `CleanUpDatabaseService`);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 0);
    this._orderRepo
      .createQueryBuilder('order')
      .delete()
      .where('order.opened_at <= :date', { date: yesterday })
      .execute();
  }
}
