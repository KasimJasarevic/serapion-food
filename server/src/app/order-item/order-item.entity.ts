import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from '../order/order.entity';
import { UserOrderItemEntity } from '../user-order-item/user-order-item.entity';

@Entity({ name: 'order_item' })
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => OrderEntity, (order) => order.orderItems)
  order: OrderEntity;

  // @ManyToMany(() => UserEntity, (user) => user.orderedItems)
  // users: UserEntity[];

  @OneToMany(
    () => UserOrderItemEntity,
    (orderedItems) => orderedItems.orderItem,
  )
  orderedItems: UserOrderItemEntity[];
}
