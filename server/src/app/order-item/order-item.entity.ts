import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItemToUserEntity } from '../order-item-user/order-item-user.entity';
import { OrderEntity } from '../order/order.entity';

@Entity({ name: 'order_item' })
export class OrderItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // On delete set all order_id item of an order to null?
  @ManyToOne(() => OrderEntity, (order) => order.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @OneToMany(
    () => OrderItemToUserEntity,
    (orderedItems) => orderedItems.orderItem,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  orderedItems: OrderItemToUserEntity[];
}
