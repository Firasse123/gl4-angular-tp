import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ItemComponent } from '../item/item.component';

/**
 * Master : affiche la liste des cvs.
 * Detail : affiché par la route fille (:id) dans le router-outlet.
 * La liste est chargée une seule fois ici, seul le détail change avec la route.
 */
@Component({
  selector: 'app-master-details-cv',
  templateUrl: './master-details-cv.component.html',
  styleUrls: ['./master-details-cv.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ItemComponent],
})
export class MasterDetailsCvComponent {
  private cvService = inject(CvService);

  /**
   * rxResource car l'appel http est déjà un Observable dans le service.
   * Pas de params : la liste n'est chargée qu'une seule fois.
   */
  protected readonly cvsResource = rxResource<Cv[], void>({
    stream: () => this.cvService.getCvs(),
    defaultValue: [],
  });
}
