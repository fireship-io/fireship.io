import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usd'
})
export class UsdPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? (value / 100).toFixed(2) : 0;
  }

}
