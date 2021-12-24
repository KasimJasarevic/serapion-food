import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from '../order/order.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'comment' })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'comment',
    type: 'text',
  })
  comment: string;

  @Column({
    name: 'commented_on',
    type: 'timestamp',
  })
  commentedOn: Date;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  user: UserEntity;

  @ManyToOne(() => OrderEntity, (order) => order.comments)
  order: OrderEntity;
}
