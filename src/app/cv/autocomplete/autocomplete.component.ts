import { Component, inject, ChangeDetectionStrategy, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged, map } from "rxjs";
import { Cv } from "../model/cv";
import { CvService } from "../services/cv.service";
import { ItemComponent } from "../item/item.component";
import { CvCardComponent } from "../cv-card/cv-card.component";

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ItemComponent, CvCardComponent],
})
export class AutocompleteComponent {
  private cvService = inject(CvService);

  /** Ce que l'utilisateur tape (lié à l'input avec [(ngModel)]). */
  protected readonly search = signal("");

  /**
   * Les signaux n'ont pas de debounce natif : on passe par un Observable
   * le temps d'appliquer les opérateurs RxJS, puis on revient en signal.
   */
  private readonly debouncedSearch = toSignal(
    toObservable(this.search).pipe(
      debounceTime(300),
      map((value) => value.trim()),
      distinctUntilChanged()
    ),
    { initialValue: "" }
  );

  /** Les cvs correspondants : value(), isLoading(), error() sont utilisés dans le template. */
  protected readonly cvs = this.cvService.searchByName(this.debouncedSearch);

  /** Le cv cliqué : déjà présent dans la liste, donc aucun appel HTTP en plus. */
  protected readonly selectedCv = signal<Cv | null>(null);
}
