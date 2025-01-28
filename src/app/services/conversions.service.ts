import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConversionsService {

  public static inchesToMillivolts(inches: number): number {
    const slope = -50;
    const intercept = 1750;
    return slope * inches + intercept;
  }

  // Convert millivolts to inches of mercury
  public static millivoltsToInches(millivolts: number): number {
    const slope = -50;
    const intercept = 1750;
    // Solve the linear equation for inches using millivolts
    return (millivolts - intercept) / slope;
  }

  constructor() { }
}
