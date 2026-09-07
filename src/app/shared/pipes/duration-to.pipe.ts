import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationTo'
})
export class DurationToPipe implements PipeTransform {
  transform(seconds: number | null | undefined): string {
    if (seconds == null) return '';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
