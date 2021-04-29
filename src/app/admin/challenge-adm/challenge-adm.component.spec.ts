import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeAdmComponent } from './challenge-adm.component';

describe('ChallengeAdmComponent', () => {
  let component: ChallengeAdmComponent;
  let fixture: ComponentFixture<ChallengeAdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengeAdmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
