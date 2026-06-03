import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivacidadComponent } from './privacidad';

describe('PrivacidadComponent', () => {
  let component: PrivacidadComponent;
  let fixture: ComponentFixture<PrivacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacidadComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});