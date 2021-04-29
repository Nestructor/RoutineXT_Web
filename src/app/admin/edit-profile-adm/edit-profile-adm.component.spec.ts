import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileAdmComponent } from './edit-profile-adm.component';

describe('EditProfileAdmComponent', () => {
  let component: EditProfileAdmComponent;
  let fixture: ComponentFixture<EditProfileAdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProfileAdmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
