import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  concatMap,
  scan,
  takeWhile,
} from "rxjs";
import { Product } from "./dto/product.dto";
import { ProductApiResponse } from "./dto/product-api-response.dto";
import { Settings } from "./dto/product-settings.dto";
import { ProductService } from "./services/product.service";

/** Nombre de produits chargés à chaque appel */
const PAGE_SIZE = 12;

/** Ce que le template affiche : la liste accumulée et l'état de la pagination */
interface ProductsView {
  products: Product[];
  total: number;
  hasMore: boolean;
}

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
})
export class ProductsComponent {
  private readonly productService = inject(ProductService);
  private readonly toastr = inject(ToastrService);

  /** Les paramètres de la page à charger. Chaque clic en émet de nouveaux. */
  private readonly settings$ = new BehaviorSubject<Settings>({
    limit: PAGE_SIZE,
    skip: 0,
  });

  /**
   * Le flux des produits à afficher :
   * 1. concatMap : une page = un appel HTTP, les appels sont traités l'un après l'autre.
   * 2. catchError (dans le concatMap) : une erreur réseau n'arrête pas le flux principal.
   * 3. scan : accumule les pages sans jamais muter un tableau.
   * 4. takeWhile(..., true) : complète le flux après la dernière page (incluse),
   *    donc plus aucun appel n'est possible quand il n'y a plus de produits.
   */
  readonly view$: Observable<ProductsView> = this.settings$.pipe(
    concatMap((settings) =>
      this.productService.getProducts(settings).pipe(
        catchError(() => {
          this.toastr.error(
            "Impossible de charger les produits. Veuillez réessayer."
          );
          return EMPTY;
        })
      )
    ),
    scan<ProductApiResponse, ProductsView>(
      (view, response) => ({
        products: [...view.products, ...response.products],
        total: response.total,
        hasMore: response.skip + response.limit < response.total,
      }),
      { products: [], total: 0, hasMore: true }
    ),
    takeWhile((view) => view.hasMore, true)
  );

  /** Demande la page suivante : on avance skip de limit. */
  loadMore(): void {
    const { limit, skip } = this.settings$.value;
    this.settings$.next({ limit, skip: skip + limit });
  }
}