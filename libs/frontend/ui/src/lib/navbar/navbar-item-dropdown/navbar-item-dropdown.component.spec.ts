import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarItemDropdownComponent } from './navbar-item-dropdown.component';

describe('NavbarItemDropdownComponent', () => {
  let component: NavbarItemDropdownComponent;
  let fixture: ComponentFixture<NavbarItemDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarItemDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarItemDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
