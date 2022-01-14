import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from '../order/order.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'order_item' })
export class OrderItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // On delete set all order_id item of an order to null?
  @ManyToOne(() => OrderEntity, (order) => order.orderItems, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToMany(() => UserEntity, (user) => user.orderedItems, {
    cascade: ['insert'],
  })
  users: UserEntity[];
}
