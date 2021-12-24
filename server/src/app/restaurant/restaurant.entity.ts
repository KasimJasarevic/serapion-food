import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from '../order/order.entity';

@Entity({ name: 'restaurant' })
export class RestaurantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'menu' })
  menu: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @OneToOne(() => OrderEntity, (order) => order.restaurant)
  order: OrderEntity;
}
