import { IUser } from '@core/models/user.model';
import { IOrder } from '../../../models/order.model';

export interface IItem {
  id?: number;
  name?: string;
  order?: IOrder;
  users?: IUser[];
  usersCount?: number;
}
