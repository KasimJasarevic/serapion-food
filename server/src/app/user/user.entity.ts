import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentEntity } from '../comment/comment.entity';
import { OrderItemEntity } from '../order-item/order-item.entity';
import { OrderEntity } from '../order/order.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({
    name: 'photo',
    nullable: true,
  })
  photo: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'google_id' })
  googleId: string;

  @Column({ name: 'subscription_id' })
  subscriptionId: string;

  @Column({
    name: 'last_order',
    nullable: true,
    type: 'timestamp',
  })
  lastOrder: Date;

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @ManyToMany(() => OrderItemEntity, (orderItems) => orderItems.users)
  @JoinTable({
    name: 'order_item_user',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'order_item_id',
      referencedColumnName: 'id',
    },
  })
  orderedItems: OrderItemEntity[];
}
