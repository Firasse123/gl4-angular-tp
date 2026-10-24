import { Injectable,signal } from '@angular/core';
import { Cv } from '../model/cv';

@Injectable({
  providedIn: 'root',
})
export class EmbaucheService {
  private embauchees: Cv[] = [];
  readonly #embauchees = signal<Cv[]>([]);
  readonly embaucheesSignal = this.#embauchees.asReadonly();

  constructor() {}

  /**
   *
   * Retourne la liste des embauchees
   *
   * @returns CV[]
   *
   */
  getEmbauchees(): Cv[] {
    return this.embauchees;
  }

  /**
   *
   * Embauche une personne si elle ne l'est pas encore
   * Sinon il retourne false
   *
   * @param cv : Cv
   * @returns boolean
   */
  embauche(cv: Cv): boolean {
    if (this.embauchees.indexOf(cv) == -1) {
      this.embauchees.push(cv);
      this.#embauchees.update(list => [...list, cv]);
      return true;
    }
    return false;
  }
}
