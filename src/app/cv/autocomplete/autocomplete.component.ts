import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Observable, catchError, debounceTime, distinctUntilChanged, map, of, switchMap } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Cv } from "../model/cv";
import { CvService } from "../services/cv.service";
import { ItemComponent } from "../item/item.component";

/** Temps de silence (ms) après la dernière frappe avant de lancer la recherche */
const SEARCH_DEBOUNCE_MS = 300;
/** En dessous de ce nombre de caractères, aucune requête n'est envoyée */
const SEARCH_MIN_LENGTH = 2;

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AsyncPipe, ItemComponent],
})
export class AutocompleteComponent {
  private readonly cvService = inject(CvService);
  private readonly toastr = inject(ToastrService);

  /** Le champ de recherche */
  protected readonly search = new FormControl("", { nonNullable: true });

  /**
   * Les cvs dont le nom contient la saisie
   * null : pas de recherche (saisie trop courte ou erreur serveur), rien n'est affiché
   * [] : recherche faite, aucun cv trouvé
   */
  protected readonly cvs$: Observable<Cv[] | null> = this.search.valueChanges.pipe(
    debounceTime(SEARCH_DEBOUNCE_MS),
    map((value) => value.trim()),
    distinctUntilChanged(),
    switchMap((name) =>
      name.length < SEARCH_MIN_LENGTH
        ? of(null)
        : this.cvService.selectByName(name).pipe(
            catchError(() => {
              this.toastr.error("Problème avec le serveur, veuillez réessayer.");
              return of(null);
            })
          )
    )
  );
}
