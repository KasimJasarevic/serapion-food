import { OrderEntity } from '../order/order.entity';
import { UserEntity } from '../user/user.entity';
import { OrderItemEntity } from './order-item.entity';

export class OrderItemDTO {
  id?: number;
  name?: string;
  order?: OrderEntity;
  users?: UserEntity[];
  count?: number;
  usersCount?: number;
  orderedItems?: OrderItemDTO[];
}

export class OrderItemGetRequest {
  id?: number;
  name: string;
  order: OrderEntity;
  orderedItems: OrderItemDTO[];
}

export class OrderItemPostRequest {
  name: string;
  order: OrderEntity;
  orderedItems: OrderItemDTO[];
}

export class OrderItemPayload {
  id: number;
  name: string;
  order: OrderEntity;
  users: UserEntity[];
  userId: number;
}

export class OrderItemPutRequest {
  id: number;
  name: string;
  order: OrderEntity;
  users: UserEntity[];
  user: UserEntity;
}

export class OrderItemDeleteRequest {
  name: string;
  order: number;
  user: number;
}

export class OrderItemAppendRequest {
  id: number;
  user: UserEntity;
  order: OrderEntity;
}

export class OrderItemByIdGetRequest {
  id: number;
  name: string;
  order: OrderEntity;
  orderedItems: OrderItemUserDTO[];
}

export class OrderItemUserDTO {
  orderItem: OrderItemByIdGetRequest;
  user: UserEntity;
}

export class OrderItemUserDeleteResponse {
  orderItem: OrderItemEntity;
  user: UserEntity;
}
