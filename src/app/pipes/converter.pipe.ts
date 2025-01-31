import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'millivoltsToInches',
  standalone: true
})

export class MillivoltsToInchesPipe implements PipeTransform {
  transform(millivolts: number): number {
    const slope = -50;
    const intercept = 1750;
    // Solve the linear equation for inches using millivolts
    return (millivolts - intercept) / slope;
  }
}
