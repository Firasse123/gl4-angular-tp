import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/services/auth.service';
import { DefaultImagePipe } from '../pipes/default-image.pipe';
import { EMPTY, Observable, catchError, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-details-cv',
  templateUrl: './details-cv.component.html',
  styleUrls: ['./details-cv.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DefaultImagePipe, AsyncPipe],
})
export class DetailsCvComponent {
  private cvService = inject(CvService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);

  /**
   * On écoute le paramMap (et non le snapshot) : dans le master-detail le
   * composant n'est pas recréé quand seul l'id change, le snapshot resterait figé.
   * switchMap annule la requête précédente si on change de cv rapidement.
   */
  cv$: Observable<Cv> = this.activatedRoute.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) =>
      this.cvService.getCvById(id).pipe(
        catchError(() => {
          this.toastr.error(`Le cv d'id ${id} n'existe pas`);
          this.goBack();
          return EMPTY;
        })
      )
    )
  );

  deleteCv(cv: Cv) {
    this.cvService
      .deleteCvById(cv.id)
      .pipe(
        catchError(() => {
          this.toastr.error(`Problème avec le serveur veuillez contacter l'admin`);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.toastr.success(`${cv.name} supprimé avec succès`);
        this.goBack();
      });
  }

  /**
   * Remonte d'un niveau par rapport à la route active :
   * /cv/:id -> /cv et /cv/list/:id -> /cv/list
   */
  private goBack() {
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }
}
