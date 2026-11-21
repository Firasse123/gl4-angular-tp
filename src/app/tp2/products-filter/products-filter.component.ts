import { ChangeDetectionStrategy, Component, computed, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRODUCTS, ProductCategory } from './product.data';
import {
  ALL_CATEGORIES,
  categoriesOf,
  matchesCategory,
  matchesSearch,
  normalize,
} from './products-filter.utils';

@Component({
  selector: 'app-products-filter',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './products-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './products-filter.component.css',
})
export class ProductsFilterComponent {
  protected readonly allCategories = ALL_CATEGORIES;

  protected readonly products = signal<ProductCategory[]>(PRODUCTS);
  protected readonly search = signal('');

  /** Produits dont le nom contient le texte saisi, toutes catégories confondues. */
  private readonly searchResults = computed(() => {
    const term = normalize(this.search());
    return this.products().filter((product) => matchesSearch(product, term));
  });

  /** Catégories qui ont encore au moins un produit correspondant à la recherche. */
  protected readonly categories = computed(() => categoriesOf(this.searchResults()));

  /**
   * Catégorie sélectionnée : modifiable par l'utilisateur (select),
   * mais recalculée quand la liste des catégories change :
   * on la garde si elle existe encore, sinon on revient à "All".
   */
  protected readonly category = linkedSignal<string[], string>({
    source: this.categories,
    computation: (categories, previous) =>
      previous && categories.includes(previous.value) ? previous.value : ALL_CATEGORIES,
  });

  /** Liste affichée : recherche + catégorie, recalculée dès que l'un des deux change. */
  protected readonly filteredProducts = computed(() =>
    this.searchResults().filter((product) => matchesCategory(product, this.category()))
  );

  protected reset(): void {
    this.search.set('');
    this.category.set(ALL_CATEGORIES);
  }
}
