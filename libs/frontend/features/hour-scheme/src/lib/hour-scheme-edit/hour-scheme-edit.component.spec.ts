import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HourSchemeEditComponent } from './hour-scheme-edit.component';

describe('HourSchemeEditComponent', () => {
  let component: HourSchemeEditComponent;
  let fixture: ComponentFixture<HourSchemeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HourSchemeEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HourSchemeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
