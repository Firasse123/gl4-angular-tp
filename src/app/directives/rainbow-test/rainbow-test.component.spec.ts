import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RainbowTestComponent } from './rainbow-test.component';

describe('RainbowTestComponent', () => {
  let component: RainbowTestComponent;
  let fixture: ComponentFixture<RainbowTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RainbowTestComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RainbowTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
