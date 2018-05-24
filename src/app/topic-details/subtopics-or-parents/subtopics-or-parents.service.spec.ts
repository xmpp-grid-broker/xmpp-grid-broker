import { TestBed, inject } from '@angular/core/testing';

import { SubtopicsOrParentsService } from './subtopics-or-parents.service';

describe('SubtopicsOrParentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubtopicsOrParentsService]
    });
  });

  it('should be created', inject([SubtopicsOrParentsService], (service: SubtopicsOrParentsService) => {
    expect(service).toBeTruthy();
  }));
});
