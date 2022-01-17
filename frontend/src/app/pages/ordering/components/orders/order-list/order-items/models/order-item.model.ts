import { IUser } from '@core/models/user.model';
import { IOrder } from '../../../models/order.model';

export interface IOrderItemUser {
  id?: number;
  user?: IUser;
  orderItem?: IItem;
}

export interface AddOrderItem {
  name: string;
  order: IOrder;
  orderedItems: IOrderItemUser[];
}

export interface IItem {
  id?: number;
  name?: string;
  order?: IOrder;
  users?: IUser[];
  usersCount?: number;
  orderedItems?: IOrderItemUser[];
}

export interface IDeleteItem {
  name: string;
  order: number;
  user: number;
}

export interface IAddItem {
  id: number;
  name: string;
  order: IOrder;
  users: IUser[];
  userId: number;
}

export interface IAddItemEx {
  id: number;
  order: IOrder;
  user: IUser;
}

export interface IRemoveOrderItemUser {
  itemId: number;
  userId: number;
}

export interface IDeleteOrderItem {
  itemId: number;
}
