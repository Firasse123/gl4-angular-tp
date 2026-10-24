import { Component } from '@angular/core';
import { RainbowDirective } from '../rainbow.directive';

@Component({
  imports: [RainbowDirective],
  selector: 'app-rainbow-test',
  styleUrl: './rainbow-test.component.css',
  templateUrl: './rainbow-test.component.html',
})
export class RainbowTestComponent {
}
