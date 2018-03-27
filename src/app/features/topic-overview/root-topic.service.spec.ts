import { TestBed, inject } from '@angular/core/testing';

import { RootTopicService } from './root-topic.service';

describe('RootTopicService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RootTopicService]
    });
  });

  it('should be created', inject([RootTopicService], (service: RootTopicService) => {
    expect(service).toBeTruthy();
  }));
});
