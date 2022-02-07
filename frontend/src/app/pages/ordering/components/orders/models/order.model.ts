import { IUser } from '@core/models/user.model';
import { IPlace } from '../../places/models/place.model';
import { IMessage } from '../order-list/order-chat/models/order-chat.model';
import { IItem } from '../order-list/order-items/models/order-item.model';
import { OrderStatus } from './order-status-types';
import { OrderType } from './order-type-types';

export interface IOrder {
  id: number;
  type?: OrderType;
  status?: OrderStatus;
  openedAt?: Date;
  arrivalTime?: Date;
  comments?: IMessage[];
  restaurant: IPlace;
  user: IUser;
  orderItems: IItem[];
  orderer: IUser | undefined;
}
