import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarItemDropdownItemComponent } from './navbar-item-dropdown-item.component';

describe('NavbarItemDropdownItemComponent', () => {
  let component: NavbarItemDropdownItemComponent;
  let fixture: ComponentFixture<NavbarItemDropdownItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarItemDropdownItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarItemDropdownItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
