import { Pipe, PipeTransform } from '@angular/core';
import { IPlace } from '../../models/place.model';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(places: IPlace[], filterString: string, updated: Date): IPlace[] {
    if (!filterString || !places) {
      return places;
    }

    return places.filter(
      (place) =>
        place.name.toLowerCase().indexOf(filterString.toLowerCase()) !== -1
    );
  }
}
