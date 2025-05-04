import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberSuffix'
})
export class NumberSuffixPipe implements PipeTransform {

  transform(value: any, ...args: any): unknown {

    let exp;
    const suffixes = [' k', ' M', ' B', ' T', ' P', ' E'];
    const isNagtiveValues = value < 0;
    if (Number.isNaN(value) || (value < 1000 && value >= 0) || !this.isNumeric(value) || (value < 0 && value > -1000)) {
      if (!!args && this.isNumeric(value) && !(value < 0) && value != 0) {
        return value.toFixed(args);
      } else {
        return value;
      }
  }

  if (!isNagtiveValues) {
    exp = Math.floor(Math.log(value) / Math.log(1000));

    return (value / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1];
  } else {
    value = value * -1;

    exp = Math.floor(Math.log(value) / Math.log(1000));

    return (value * -1 / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1];
  }
}

  isNumeric(value: any): boolean {
    if (value < 0) value = value * -1;
    if (/^-{0,1}\d+$/.test(value)) {
      return true;
    } else if (/^\d+\.\d+$/.test(value)) {
      return true;
    } else {
      return false;
    }
  }

}