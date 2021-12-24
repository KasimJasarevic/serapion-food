import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrderItemEntity } from '../order-item/order-item.entity';
import { UserEntity } from '../user/user.entity';

@Entity({
  name: 'user_order_item',
})
export class UserOrderItemEntity {
  @PrimaryColumn()
  userId: number;
  @PrimaryColumn()
  orderItemId: number;

  @ManyToOne(() => UserEntity, (userItems) => userItems.orderedItems)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => OrderItemEntity, (orderItem) => orderItem.orderedItems)
  @JoinColumn({ name: 'orderItemId' })
  orderItem: OrderItemEntity;

  @Column({
    name: 'ordered_at',
    type: 'timestamp',
  })
  orderedAt: Date;
}
