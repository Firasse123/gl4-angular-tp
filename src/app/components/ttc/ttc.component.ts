import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getDiscountRate } from './discount.strategy';

/** Empty, NaN or negative values are treated as 0. */
const toPositive = (value: number | null): number => Math.max(0, Number(value) || 0);

@Component({
  selector: 'app-ttc',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './ttc.component.html',
  styleUrl: './ttc.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TtcComponent {
  // State (what the user edits)
  readonly priceHt = signal(0);
  readonly quantity = signal(1);
  readonly vat = signal(18);

  // Derived state
  readonly unitPriceTtc = computed(
    () => toPositive(this.priceHt()) * (1 + toPositive(this.vat()) / 100),
  );
  private readonly grossTotal = computed(
    () => this.unitPriceTtc() * toPositive(this.quantity()),
  );
  readonly discountRate = computed(() => getDiscountRate(toPositive(this.quantity())));
  readonly discount = computed(() => this.grossTotal() * this.discountRate());
  readonly totalTtc = computed(() => this.grossTotal() - this.discount());
}
