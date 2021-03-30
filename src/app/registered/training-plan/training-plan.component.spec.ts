import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingPlanComponent } from './training-plan.component';

describe('TrainingPlanComponent', () => {
  let component: TrainingPlanComponent;
  let fixture: ComponentFixture<TrainingPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
