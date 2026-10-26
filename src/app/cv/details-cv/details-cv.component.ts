import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';
import { DefaultImagePipe } from '../pipes/default-image.pipe';
import { EMPTY, Observable, catchError, switchMap } from 'rxjs';

@Component({
  selector: 'app-details-cv',
  templateUrl: './details-cv.component.html',
  styleUrls: ['./details-cv.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DefaultImagePipe, AsyncPipe],
})
export class DetailsCvComponent implements OnInit {
  private cvService = inject(CvService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);

  cv$!: Observable<Cv>;

  ngOnInit() {
    this.cv$ = this.activatedRoute.params.pipe(
      switchMap((params) =>
        this.cvService.getCvById(+params['id']).pipe(
          catchError(() => {
            this.toastr.error('Problème avec le serveur ou CV introuvable');
            this.router.navigate([APP_ROUTES.cv]);
            return EMPTY;
          })
        )
      )
    );
  }

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
        this.router.navigate([APP_ROUTES.cv]);
      });
  }
}
