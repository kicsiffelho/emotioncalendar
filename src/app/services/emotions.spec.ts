import { TestBed } from '@angular/core/testing';

import { Emotions } from './emotions';

describe('Emotions', () => {
  let service: Emotions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Emotions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
