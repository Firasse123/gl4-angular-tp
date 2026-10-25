import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError, Subject } from 'rxjs';
import { CvComponent } from './cv.component';
import { CvService } from '../services/cv.service';
import { LoggerService } from '../../services/logger.service';
import { ToastrService } from 'ngx-toastr';
import { Cv } from '../model/cv';

describe('CvComponent', () => {
  let component: CvComponent;
  let fixture: ComponentFixture<CvComponent>;
  let cvServiceMock: jasmine.SpyObj<CvService>;
  let toastrMock: jasmine.SpyObj<ToastrService>;
  let loggerMock: jasmine.SpyObj<LoggerService>;
  let selectCvSubject: Subject<Cv>;

  const mockCvs: Cv[] = [
    new Cv(1, 'John', 'Doe', 'Dev', 'photo.jpg', '123', 30),
  ];
  const fakeCvs: Cv[] = [
    new Cv(99, 'Fake', 'User', 'Tester', 'fake.jpg', '999', 25),
  ];

  beforeEach(async () => {
    selectCvSubject = new Subject<Cv>();
    cvServiceMock = jasmine.createSpyObj<CvService>('CvService', ['getCvs', 'getFakeCvs'], {
      selectCv$: selectCvSubject.asObservable(),
    });
    cvServiceMock.getCvs.and.returnValue(of(mockCvs));
    cvServiceMock.getFakeCvs.and.returnValue(fakeCvs);

    toastrMock = jasmine.createSpyObj<ToastrService>('ToastrService', ['info', 'error']);
    loggerMock = jasmine.createSpyObj<LoggerService>('LoggerService', ['logger']);

    await TestBed.configureTestingModule({
      declarations: [CvComponent],
      providers: [
        { provide: CvService, useValue: cvServiceMock },
        { provide: ToastrService, useValue: toastrMock },
        { provide: LoggerService, useValue: loggerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose cvs$ observable with data from getCvs()', (done) => {
    component.cvs$.subscribe((cvs) => {
      expect(cvs).toEqual(mockCvs);
      done();
    });
  });

  it('should catch error in cvs$ and fallback to fake cvs with toastr alert', (done) => {
    cvServiceMock.getCvs.and.returnValue(throwError(() => new Error('Server error')));
    const errorComponent = new CvComponent(loggerMock, toastrMock, cvServiceMock);

    errorComponent.cvs$.subscribe((cvs) => {
      expect(cvs).toEqual(fakeCvs);
      expect(toastrMock.error).toHaveBeenCalled();
      done();
    });
  });

  it('should update selectedCv$ when selectCv$ emits', (done) => {
    const selected = new Cv(1, 'Jane', 'Doe', 'Designer', 'jane.jpg', '456', 28);
    component.selectedCv$.subscribe((cv) => {
      expect(cv).toEqual(selected);
      done();
    });
    selectCvSubject.next(selected);
  });
});
