import { OrderItemEntity } from '../order-item/order-item.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { UserEntity } from '../user/user.entity';
import { OrderStatus, OrderType } from './order.interface';

export class OrderDTO {
  id?: number;
  type?: OrderType;
  status?: OrderStatus;
  openedAt?: Date;
  restaurant?: RestaurantEntity;
  user?: UserEntity;
  orderItems?: OrderItemEntity[];
}
