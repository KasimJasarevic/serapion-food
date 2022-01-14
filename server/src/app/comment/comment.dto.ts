import { OrderEntity } from '../order/order.entity';
import { UserEntity } from '../user/user.entity';

export class CommentDTO {
  id?: number;
  comment?: string;
  commentedOn?: Date;
  user?: UserEntity;
  order?: OrderEntity;
}

export class AddCommentDTO {
  comment: string;
  user: UserEntity;
  order: OrderEntity;
}
