import { TestBed } from '@angular/core/testing';

import { AddVolonteerService } from './addvolonteer.service';

describe('AddVolonteerService', () => {
  let service: AddVolonteerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddVolonteerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
