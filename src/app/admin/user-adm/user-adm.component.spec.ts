import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdmComponent } from './user-adm.component';

describe('UserAdmComponent', () => {
  let component: UserAdmComponent;
  let fixture: ComponentFixture<UserAdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAdmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
