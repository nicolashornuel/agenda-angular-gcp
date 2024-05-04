import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateFreq'
})
export class TruncateFreqPipe implements PipeTransform {

  transform(value: number): string {
    if (value >= 1e3) return (value / 1e3).toFixed(0) + 'k'
    return value.toString()
  }

}
