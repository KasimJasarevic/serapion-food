import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
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
    type: 'text',
    nullable: true,
  })
  menu: string;

  @Column({
    name: 'phone_number',
    nullable: true,
  })
  phoneNumber: string;

  @OneToMany(() => OrderEntity, (order) => order.restaurant)
  orders: OrderEntity[];
}
