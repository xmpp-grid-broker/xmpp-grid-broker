import {NavigationService} from './navigation.service';

describe('NavigationService', () => {

  let service: NavigationService;
  let mockRouter;

  beforeEach(() => {
    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };
    service = new NavigationService(mockRouter);
  });

  it('verify mappings', () => {
    service.goToNewTopic();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/topics/new');
  });
});
