import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseAdmComponent } from './exercise-adm.component';

describe('ExerciseAdmComponent', () => {
  let component: ExerciseAdmComponent;
  let fixture: ComponentFixture<ExerciseAdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseAdmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
