import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RadioUtilService {
  constructor() {}

  public setAnimation(string: string, element: Element): void {
    const stringWidth = this.mesureTxt(string);
    const animation = stringWidth > element.clientWidth ? `animation: defilement ${string.length / 2}s infinite linear;` : 'animation: none;';
    const width = `width: ${stringWidth}px;`;
    element.setAttribute('style', width + animation);
  }

  /**
   * Calculate lenght into pixel of string
   *
   * @private
   * @param {string} str
   * @return {*}  {number}
   * @memberof RadioUtilService
   */
  private mesureTxt(str: string): number {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx!.font = '16px "Helvetica Neue"';
    const strWidth = ctx!.measureText(str).width
    return Math.floor(strWidth);
  }

  /**
   * Get delay between end & now
   *
   * @param {number} end
   * @return {*}  {number}
   * @memberof RadioUtilService
   */
  public delay(end: number): number {
    const now: number = Math.floor(new Date().getTime());
    return Math.abs(end * 1000 - now);
  }
}
