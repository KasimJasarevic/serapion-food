import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(data: any, filterString: string): any {
    if (data.length === 0 || filterString.length === 0) {
      return data;
    }
  }
}
