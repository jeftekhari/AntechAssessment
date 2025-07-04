import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRequestForm } from './user-request-form';

describe('UserRequestForm', () => {
  let component: UserRequestForm;
  let fixture: ComponentFixture<UserRequestForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRequestForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRequestForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
