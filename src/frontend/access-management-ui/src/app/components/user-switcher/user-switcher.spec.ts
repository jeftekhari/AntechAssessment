import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSwitcher } from './user-switcher';

describe('UserSwitcher', () => {
  let component: UserSwitcher;
  let fixture: ComponentFixture<UserSwitcher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSwitcher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSwitcher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
