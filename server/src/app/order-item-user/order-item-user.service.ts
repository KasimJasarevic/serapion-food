import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { Repository } from 'typeorm';
import { OrderItemToUserEntity } from './order-item-user.entity';

@Injectable()
export class OrderItemUserService {
  constructor(
    @InjectRepository(OrderItemToUserEntity)
    private _orderItemUserRepo: Repository<OrderItemToUserEntity>,
  ) {}

  getOrderItemUserByItemAndUserId(itemId: number, userId: number) {
    return from(
      this._orderItemUserRepo
        .createQueryBuilder('order_item_user')
        .innerJoinAndSelect('order_item_user.orderItem', 'orderItem')
        .innerJoinAndSelect('order_item_user.user', 'user')
        .where('orderItem.id = :itemId', { itemId: itemId })
        .andWhere('user.id = :userId', { userId: userId })
        .getOne(),
    );
  }

  removeOrderItemUserById(id: number) {
    this._orderItemUserRepo
      .createQueryBuilder('order_item_user')
      .innerJoinAndSelect('order_item_user.orderItem', 'orderItem')
      .innerJoinAndSelect('order_item_user.user', 'user')
      .where('order_item_user.id = :id', { id: id })
      .delete()
      .execute();
  }
}

// const sq = await this._orderItemUserRepo
//   .createQueryBuilder('order_item_user')
//   .innerJoinAndSelect('order_item_user.orderItem', 'orderItem')
//   .innerJoinAndSelect('order_item_user.user', 'user')
//   .where('orderItem.id = :itemId', { itemId: itemId })
//   .andWhere('user.id = :userId', { userId: userId })
//   .getOne();

// this._orderItemUserRepo
//   .createQueryBuilder('order_item_user')
//   .where((qb) => {
//     const sq = qb
//       .subQuery()
//       .select('order_item_user.id')
//       .from(OrderItemToUserEntity, 'order_item_user')
//       .distinct(true)
//       .limit(1)
//       .getQuery();

//     return 'order_item_user.id' + sq;
//   })
//   .delete()
//   .execute();
