export enum OrderType {
  TAKEAWAY = 'TAKEAWAY',
  DELIVERY = 'DELIVERY',
}

export enum OrderStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
}

export interface Order {
  id?: number;
  type?: OrderType;
  status?: OrderStatus;
  openedAt?: Date;
  arrivalTime?: Date;
  restaurantId?: number;
  userId?: number;
}
