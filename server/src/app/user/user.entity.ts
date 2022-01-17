import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentEntity } from '../comment/comment.entity';
import { OrderItemToUserEntity } from '../order-item-user/order-item-user.entity';
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

  @Column({
    name: 'subscription_id',
    nullable: true,
  })
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

  @OneToMany(() => OrderItemToUserEntity, (orderedItems) => orderedItems.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  orderedItems: OrderItemToUserEntity[];
}
