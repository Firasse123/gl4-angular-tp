import { Component, ChangeDetectionStrategy, computed, inject, input, numberAttribute } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/services/auth.service';
import { DefaultImagePipe } from '../pipes/default-image.pipe';

@Component({
    selector: 'app-details-cv',
    templateUrl: './details-cv.component.html',
    styleUrls: ['./details-cv.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DefaultImagePipe]
})
export class DetailsCvComponent {
  private cvService = inject(CvService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  readonly isAuthenticated = inject(AuthService).isAuthenticated;

  /**
   * Le paramètre :id de la route, injecté grâce à withComponentInputBinding().
   * C'est un signal : il change quand on passe d'un cv à un autre dans le
   * master-detail, alors que le snapshot resterait figé sur le premier id.
   */
  readonly id = input.required({ transform: numberAttribute });

  /**
   * Relance l'appel à chaque changement de l'id et annule la requête
   * précédente (sémantique switchMap).
   */
  protected readonly cvResource = rxResource<Cv, { id: number }>({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.cvService.getCvById(params.id),
  });

  /** value() lève une erreur si la resource est en erreur, on passe donc par hasValue() */
  protected readonly cv = computed(() =>
    this.cvResource.hasValue() ? this.cvResource.value() : null
  );

  deleteCv(cv: Cv) {
    this.cvService.deleteCvById(cv.id).subscribe({
      next: () => {
        this.toastr.success(`${cv.name} supprimé avec succès`);
        this.goBack();
      },
      error: () => {
        this.toastr.error(
          `Problème avec le serveur veuillez contacter l'admin`
        );
      },
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
