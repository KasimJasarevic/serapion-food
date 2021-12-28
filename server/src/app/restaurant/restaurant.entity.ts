import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from '../order/order.entity';

@Entity({ name: 'restaurant' })
export class RestaurantEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({
    name: 'menu',
    nullable: true,
  })
  menu: string;

  @Column({
    name: 'phone_number',
    nullable: true,
  })
  phoneNumber: string;

  @OneToOne(() => OrderEntity, (order) => order.restaurant)
  order: OrderEntity;
}
