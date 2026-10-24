import { Directive,HostBinding,HostListener   } from '@angular/core';

@Directive({
  selector: 'input[appRainbow]',
  standalone:false
})
export class RainbowDirective {
  @HostBinding('style.color')
  @HostBinding('style.borderColor')
  color = 'black';

   private randomColor(): string {
    const channel = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return `#${channel()}${channel()}${channel()}`;
  }

  @HostListener('keyup')
  changeColor(){
    this.color = this.randomColor();
  }


}
