import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HourSchemeListComponent } from './hour-scheme-list.component';

describe('HourSchemeListComponent', () => {
  let component: HourSchemeListComponent;
  let fixture: ComponentFixture<HourSchemeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HourSchemeListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HourSchemeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
