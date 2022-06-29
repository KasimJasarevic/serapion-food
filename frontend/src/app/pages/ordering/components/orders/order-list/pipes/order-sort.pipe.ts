import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus } from '../../models/order-status-types';
import { IOrder } from '../../models/order.model';

@Pipe({
  name: 'sortOrder',
})
export class SortOrderPipe implements PipeTransform {
  transform(value: IOrder[], args: any[]) {
    const sortDirection = args[0];
    const updated = args[1];
    let direction = sortDirection !== 'desc' ? 1 : -1;

    value.sort((a: IOrder, b: IOrder) => {
      const firstRestaurantName = a.restaurant.name;
      const secondRestaurantName = b.restaurant.name;

      if (firstRestaurantName < secondRestaurantName) {
        return -1 * direction;
      } else if (firstRestaurantName > secondRestaurantName) {
        return 1 * direction;
      } else {
        return 0;
      }
    });

    const sortedValue = [
      ...value.filter((order: IOrder) => order.status === OrderStatus.ACTIVE),
      ...value.filter((order: IOrder) => order.status === OrderStatus.INACTIVE),
    ];

    return sortedValue;
  }
}
