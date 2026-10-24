import { Directive,signal } from '@angular/core';

@Directive({
  selector: 'input[appRainbow]',
  host: {
        '[style.color]': 'color()',
        '[style.borderColor]': 'color()',
        '(keyup)': 'changeColor()',

  }
})
export class RainbowDirective {
  protected color=signal("black");
    private randomColor(): string {
    const channel = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return `#${channel()}${channel()}${channel()}`;
  }
  protected changeColor(){
    this.color.set(this.randomColor());
  }
}
