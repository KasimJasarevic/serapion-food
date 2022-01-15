import { OrderEntity } from '../order/order.entity';
import { UserEntity } from '../user/user.entity';

export class OrderItemDTO {
  id?: number;
  name?: string;
  order?: OrderEntity;
  users?: UserEntity[];
  count?: number;
  usersCount?: number;
}

export class OrderItemPostRequest {
  name: string;
  order: OrderEntity;
  users: UserEntity[];
}
