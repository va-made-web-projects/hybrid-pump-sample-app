import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'millisecondsToTime'
})
export class MillisecondsToTimePipe implements PipeTransform {
  transform(value: number): string {
    const totalSeconds = Math.floor(value / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return this.formatTime(hours) + ':' + this.formatTime(minutes) + ':' + this.formatTime(seconds);
  }

  private formatTime(time: number): string {
    return (time < 10 ? '0' : '') + time;
  }
}
