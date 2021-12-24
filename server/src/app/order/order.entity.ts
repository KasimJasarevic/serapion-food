import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentEntity } from '../comment/comment.entity';
import { OrderItemEntity } from '../order-item/order-item.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { UserEntity } from '../user/user.entity';
import { OrderStatus, OrderType } from './order.interface';

@Entity({ name: 'order' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'type',
    type: 'enum',
    enum: OrderType,
  })
  type: OrderType;

  @Column({
    name: 'status',
    type: 'enum',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @Column({
    name: 'opened_at',
    type: 'timestamp',
  })
  openedAt: Date;

  @OneToMany(() => CommentEntity, (comment) => comment.order)
  comments: CommentEntity[];

  @OneToOne(() => RestaurantEntity, (restaurant) => restaurant.order)
  @JoinColumn()
  restaurant: RestaurantEntity;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems: OrderItemEntity[];
}
