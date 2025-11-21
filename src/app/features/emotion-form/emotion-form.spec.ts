import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmotionForm } from './emotion-form';

describe('EmotionForm', () => {
  let component: EmotionForm;
  let fixture: ComponentFixture<EmotionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmotionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmotionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
