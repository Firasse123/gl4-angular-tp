import { ChangeDetectionStrategy, Component, computed, linkedSignal, signal } from '@angular/core';
import { countries } from '../data/countries';
import { Country } from '../model/country.interface';

@Component({
  selector: 'app-country-currency-selector',
  imports: [],
  standalone: true,
  templateUrl: './country-currency-selector.component.html',
  styleUrl: './country-currency-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryCurrencySelectorComponent {
  protected readonly countries = signal<Country[]>(countries);
  protected readonly country = signal<Country>(countries[0]);
  protected readonly currencies = computed(() => this.country().acceptedCurrencies);
    protected readonly currency = linkedSignal<Country, string>({
    source: this.country,
    computation: (newCountry, previous) => {
      if (previous && newCountry.acceptedCurrencies.includes(previous.value)) {
        return previous.value;
      }
      return newCountry.acceptedCurrencies[0];
    },
  });
   protected selectCountry(name: string): void {
    const selected = this.countries().find((c) => c.name === name);
    if (selected) {
      this.country.set(selected);
    }
  }
  protected selectCurrency(currency: string): void {
    this.currency.set(currency);
  }
  
}
