import { OrderItemDTO } from '../order-item/order-item.dto';
import { OrderDTO } from '../order/order.dto';
import { UserDTO } from '../user/user.dto';

export class OrdemItemToUserGetRequest {
  id: number;
  user: UserDTO;
  order: OrderDTO;
}

export class OrderItemUserDTO {
  user?: UserDTO;
  order_item?: OrderItemDTO;
}
