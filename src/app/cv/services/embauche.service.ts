import { Injectable, signal } from '@angular/core';
import { Cv } from '../model/cv';

@Injectable({
  providedIn: 'root',
})
export class EmbaucheService {
  readonly #embauchees = signal<Cv[]>([]);
  readonly embauchees = this.#embauchees.asReadonly();

  /**
   *
   * Embauche une personne si elle ne l'est pas encore
   * Sinon il retourne false
   *
   * @param cv : Cv
   * @returns boolean
   */
  embauche(cv: Cv): boolean {
    const existe = this.#embauchees().some(item => item.id === cv.id);
    if (existe) {
      return false;
    }
    this.#embauchees.update(items => [...items, cv]);
    return true;
  }
}
