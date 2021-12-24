import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommentEntity } from '../comment/comment.entity';
import { OrderEntity } from '../order/order.entity';
import { UserOrderItemEntity } from '../user-order-item/user-order-item.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'photo' })
  photo: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'google_id' })
  googleId: string;

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  // @ManyToMany(() => OrderItemEntity, (orderItems) => orderItems.users)
  // @JoinTable({
  //   name: 'order_item_user',
  // })
  // orderedItems: OrderItemEntity[];

  @OneToMany(() => UserOrderItemEntity, (orderedItems) => orderedItems.user)
  orderedItems: UserOrderItemEntity[];
}
