import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { OrderItemToUserEntity } from '../order-item-user/order-item-user.entity';
import { UserEntity } from '../user/user.entity';
import {
  OrderItemDeleteRequest,
  OrderItemDTO,
  OrderItemGetRequest,
  OrderItemPostRequest,
  OrderItemPutRequest,
} from './order-item.dto';
import { OrderItemEntity } from './order-item.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItemEntity)
    private _orderitemRepo: Repository<OrderItemEntity>,
  ) {}

  test() {
    return this._orderitemRepo
      .createQueryBuilder('order_item')
      .innerJoinAndSelect('order_item.order', 'order')
      .innerJoinAndSelect('order_item.orderedItems', 'items')
      .innerJoinAndSelect('items.user', 'user')
      .getMany();

    // return this._orderitemRepo.find({
    //   join: {
    //     alias: 'items',
    //     leftJoinAndSelect: {
    //       order: 'items.order',
    //       orderItems: 'items.orderedItems',
    //     },
    //   },
    // });
  }

  // THIS IS THE QUERY I NEED
  getOrderItemsByOrderIds(orderId: number): Observable<OrderItemGetRequest[]> {
    return from(
      this._orderitemRepo
        .createQueryBuilder('order_item')
        .innerJoinAndSelect('order_item.order', 'order')
        .innerJoinAndSelect('order_item.orderedItems', 'items')
        .innerJoinAndSelect('items.user', 'user')
        .where('order.id = :id ', { id: orderId })
        .getMany(),
    );
  }

  getOrderItemById(id: number): Observable<OrderItemDTO> {
    return from(
      this._orderitemRepo
        .createQueryBuilder('order_item')
        .innerJoinAndSelect('order_item.orderedItems', 'items')
        .innerJoinAndSelect('items.user', 'user')
        .where('order_item.id = :id', { id: id })
        .getOne(),
    );
  }

  getOrderItemsByOrderId(orderId: number): Observable<OrderItemDTO[]> {
    return from(
      this._orderitemRepo
        .createQueryBuilder('order_item')
        .innerJoinAndSelect('order_item.order', 'order')
        .where('order.id = :id', { id: orderId })
        .getMany(),
    );
  }

  getOrderItemsByOrderIdAndName(
    orderId: number,
    name: string,
  ): Observable<OrderItemDTO> {
    return from(
      this._orderitemRepo
        .createQueryBuilder('order_item')
        .innerJoinAndSelect('order_item.users', 'users')
        .innerJoinAndSelect('order_item.order', 'order')
        .where('order.id = :id', { id: orderId })
        .andWhere('order_item.name = :name', { name: name })
        .loadRelationCountAndMap('order_item.usersCount', 'order_item.users')
        .getOne(),
    );
  }

  addNewOrderItem(place: OrderItemPostRequest): Observable<OrderItemDTO> {
    return from(this._orderitemRepo.create(place).save());
  }

  deleteOrderItem({ name, order, user }: OrderItemDeleteRequest) {
    this.getOrderItemsByOrderIdAndName(order, name).subscribe(
      (data: OrderItemDTO) => {
        const users = data.users.filter((_user) => _user.id != user);
        data.users = users;
        return from(this._orderitemRepo.save(data));
      },
    );
  }

  updateOrderItem(item: OrderItemPutRequest) {
    const data: OrderItemDTO = {
      ...item,
    };

    data.users.push(item.user);

    return from(this._orderitemRepo.save(data));
  }

  // This works!!!!
  // appendOrderItemUser({ id, ...payload }: OrderItemAppendRequest) {
  //   this.getOrderItemById(id).subscribe((data) => {
  //     const appendItem: OrderItemUserDTO = {
  //       orderItem: data,
  //       user: payload.user,
  //     };
  //     data.orderedItems.push(appendItem);

  //     this._orderitemRepo.save(data);
  //   });
  // }

  appendOrderItemUser(orderItem, user: UserEntity) {
    const appendItem = new OrderItemToUserEntity();
    appendItem.user = user;
    orderItem.orderedItems.push(appendItem);
    return from(this._orderitemRepo.save(orderItem));
  }

  removeOrderItemUser(orderItem, userId: number) {
    // console.log(orderItem);

    // orderItem.orderedItems.forEach((x) => console.log(x.user.id));
    // console.log(indx);
    const indx = orderItem.orderedItems.findIndex((x) => x.user.id == userId);
    console.log(orderItem.orderedItems.length);
    orderItem.orderedItems.splice(indx, 1);
    console.log(orderItem.orderedItems.length);

    return from(this._orderitemRepo.save(orderItem));
  }

  deleteOrderItemById(itemId: number) {
    this._orderitemRepo
      .createQueryBuilder('order_item')
      .where('order_item.id = :id', { id: itemId })
      .delete()
      .execute();
  }
}
