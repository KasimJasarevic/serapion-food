import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItemEntity } from '../order-item/order-item.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'order_item_user' })
export class OrderItemToUserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // On delete set all order_id item of an order to null?
  @ManyToOne(() => OrderItemEntity, (orderItem) => orderItem.orderedItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_item_id' })
  orderItem: OrderItemEntity;

  @ManyToOne(() => UserEntity, (user) => user.orderedItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
