import { IOrder } from '../../orders/models/order.model';

export interface IPlace {
  id?: number;
  name: string;
  menu?: string;
  phoneNumber?: string;
  orders?: IOrder[];
}

export interface IPlaceSub {
  showModal: boolean;
  placeId: number | undefined;
}
