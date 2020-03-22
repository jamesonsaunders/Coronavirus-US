import { TestBed } from '@angular/core/testing';

import { UsMapService } from './us-map.service';

describe('UsMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsMapService = TestBed.get(UsMapService);
    expect(service).toBeTruthy();
  });
});
