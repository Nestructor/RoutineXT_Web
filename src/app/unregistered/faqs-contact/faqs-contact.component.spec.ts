import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqsContactComponent } from './faqs-contact.component';

describe('FaqsContactComponent', () => {
  let component: FaqsContactComponent;
  let fixture: ComponentFixture<FaqsContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqsContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqsContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
