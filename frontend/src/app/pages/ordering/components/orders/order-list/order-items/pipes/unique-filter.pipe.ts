import { Pipe, PipeTransform } from '@angular/core';
import { IUser } from '@core/models/user.model';
import { IOrderItemUser } from '../models/order-item.model';

@Pipe({
  name: 'uniqueFilter',
})
export class UniqueFilterPipe implements PipeTransform {
  transform(items: IOrderItemUser[], updated: Date): IOrderItemUser[] {
    if (!items) {
      return items;
    }

    return items.filter(
      (item, ind, self) =>
        self.findIndex((i) => i.user!.id === item.user!.id) === ind
    );
  }
}
