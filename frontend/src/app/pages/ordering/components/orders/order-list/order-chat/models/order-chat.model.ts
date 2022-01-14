import { IUser } from '@core/models/user.model';
import { IOrder } from '../../../models/order.model';

export interface IMessage {
  id?: number;
  comment?: string;
  commentedOn?: Date;
  user?: IUser;
  order?: IOrder;
  orderId?: number;
}
