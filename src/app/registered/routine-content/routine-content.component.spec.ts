import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutineContentComponent } from './routine-content.component';

describe('RoutineContentComponent', () => {
  let component: RoutineContentComponent;
  let fixture: ComponentFixture<RoutineContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutineContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutineContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
