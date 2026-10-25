import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DetailsCvComponent } from './details-cv.component';
import { CvService } from '../services/cv.service';
import { AuthService } from '../../auth/services/auth.service';
import { APP_ROUTES } from '../../../config/routes.config';
import { Cv } from '../model/cv';
import { DefaultImagePipe } from '../pipes/default-image.pipe';

describe('DetailsCvComponent', () => {
  let component: DetailsCvComponent;
  let fixture: ComponentFixture<DetailsCvComponent>;
  let cvServiceMock: jasmine.SpyObj<CvService>;
  let routerMock: jasmine.SpyObj<Router>;
  let toastrMock: jasmine.SpyObj<ToastrService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  const mockCv = new Cv(1, 'Jane', 'Doe', 'Developer', 'jane.jpg', '12345', 30);

  beforeEach(async () => {
    cvServiceMock = jasmine.createSpyObj<CvService>('CvService', [
      'getCvById',
      'deleteCvById',
    ]);
    routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);
    toastrMock = jasmine.createSpyObj<ToastrService>('ToastrService', [
      'success',
      'error',
    ]);
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', [
      'isAuthenticated',
    ]);

    cvServiceMock.getCvById.and.returnValue(of(mockCv));
    cvServiceMock.deleteCvById.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [DetailsCvComponent, DefaultImagePipe],
      providers: [
        { provide: CvService, useValue: cvServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ToastrService, useValue: toastrMock },
        { provide: AuthService, useValue: authServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cv by id using switchMap on route params', (done) => {
    component.cv$.subscribe((cv) => {
      expect(cv).toEqual(mockCv);
      expect(cvServiceMock.getCvById).toHaveBeenCalledWith(1);
      done();
    });
  });

  it('should catch error when getCvById fails and navigate to cv list', (done) => {
    cvServiceMock.getCvById.and.returnValue(
      throwError(() => new Error('Not found'))
    );
    component.ngOnInit();

    component.cv$.subscribe({
      complete: () => {
        expect(toastrMock.error).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith([APP_ROUTES.cv]);
        done();
      },
    });
  });

  it('should delete cv successfully and navigate to cv list', () => {
    component.deleteCv(mockCv);
    expect(cvServiceMock.deleteCvById).toHaveBeenCalledWith(mockCv.id);
    expect(toastrMock.success).toHaveBeenCalledWith(
      `${mockCv.name} supprimé avec succès`
    );
    expect(routerMock.navigate).toHaveBeenCalledWith([APP_ROUTES.cv]);
  });

  it('should catch error when deleteCvById fails with toastr error', () => {
    cvServiceMock.deleteCvById.and.returnValue(
      throwError(() => new Error('Delete failed'))
    );
    component.deleteCv(mockCv);
    expect(cvServiceMock.deleteCvById).toHaveBeenCalledWith(mockCv.id);
    expect(toastrMock.error).toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});

