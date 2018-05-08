import { TestBed, inject } from '@angular/core/testing';

import { PersistedItemsService } from './persisted-items.service';

describe('PersistedItemsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersistedItemsService]
    });
  });

  it('should be created', inject([PersistedItemsService], (service: PersistedItemsService) => {
    expect(service).toBeTruthy();
  }));
});
