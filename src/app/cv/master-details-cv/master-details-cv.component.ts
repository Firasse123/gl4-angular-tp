import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
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
  imports: [AsyncPipe, RouterLink, RouterLinkActive, RouterOutlet, ItemComponent],
})
export class MasterDetailsCvComponent {
  private cvService = inject(CvService);
  private toastr = inject(ToastrService);

  cvs$: Observable<Cv[]> = this.cvService.getCvs().pipe(
    catchError(() => {
      this.toastr.error(`Problème avec le serveur veuillez contacter l'admin`);
      return of([]);
    })
  );
}
