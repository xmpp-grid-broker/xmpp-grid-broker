import {NavigationService} from './navigation.service';
import {before} from 'selenium-webdriver/testing';
import {assertArrayOfStrings} from '@angular/compiler/src/assertions';

describe('NavigationService', () => {

  let service: NavigationService;
  let mockRouter;

  beforeEach(() => {
    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };
    service = new NavigationService(mockRouter);
  });

  function urlAfterCalling() {
    return mockRouter.navigateByUrl.calls.mostRecent().args[0];
  }

  it('verify mappings', () => {
    service.goToNewTopic();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/topics/new');
  });
});
