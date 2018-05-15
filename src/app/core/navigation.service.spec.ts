import {NavigationService} from './navigation.service';
import {LeafTopic} from './models/topic';

describe('NavigationService', () => {

  let service: NavigationService;
  let mockRouter;

  beforeEach(() => {
    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };
    service = new NavigationService(mockRouter);
  });

  it('verify goToNewTopic', () => {
    service.goToNewTopic();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/topics/new/topic');
  });
  it('verify goToNewCollection', () => {
    service.goToNewCollection();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/topics/new/collection');
  });

  it('verify goToTopic by name works', () => {
    service.goToTopic('name');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/topics/details/name');
  });

  it('verify goToTopic by topic works', () => {
    service.goToTopic(new LeafTopic('leafTopic'));
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/topics/details/leafTopic');
  });
  it('verify goToTopic by topic works', () => {
    service.goToPersistedItems(new LeafTopic('leaf@?!Topic'));
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/topics/details/leaf%40%3F!Topic/items');
  });

});
