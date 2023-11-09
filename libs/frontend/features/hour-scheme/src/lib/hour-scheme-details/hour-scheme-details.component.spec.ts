import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HourSchemeDetailsComponent } from './hour-scheme-details.component';

describe('HourSchemeDetailsComponent', () => {
  let component: HourSchemeDetailsComponent;
  let fixture: ComponentFixture<HourSchemeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HourSchemeDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HourSchemeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
