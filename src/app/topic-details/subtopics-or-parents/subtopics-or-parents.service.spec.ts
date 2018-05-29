import {SubtopicsOrParentsService} from '..';
import {TopicIteratorHelperService} from '../../topic-widgets';
import createSpyObj = jasmine.createSpyObj;

describe(SubtopicsOrParentsService.name, () => {

  let iteratorHelper: jasmine.SpyObj<TopicIteratorHelperService>;
  let service: SubtopicsOrParentsService;
  beforeEach(() => {
    iteratorHelper = jasmine.createSpyObj(TopicIteratorHelperService.name,
      ['createChildTopicsIterator', 'createParentsTopicsIterator']);
    service = new SubtopicsOrParentsService(iteratorHelper);
  });

  describe('when calling subtopics', () => {
    it('should just return the result of the call to the helper service', () => {
      const fakeResult = createSpyObj('AsyncIterableIterator', ['next']);
      iteratorHelper.createChildTopicsIterator.and.returnValue(fakeResult);

      const result = service.subtopics('topicNane');

      expect(result).toBe(fakeResult);
    });

    it('should call the helper service with the topic name and recursive flag', () => {
      service.subtopics('topicNane');

      expect(iteratorHelper.createChildTopicsIterator).toHaveBeenCalledTimes(1);
      expect(iteratorHelper.createChildTopicsIterator).toHaveBeenCalledWith( 'topicNane', true);
    });
  });

  describe('when calling parents', () => {
    it('should just return the result of the call to the helper service', () => {
      const fakeResult = createSpyObj('AsyncIterableIterator', ['next']);
      iteratorHelper.createParentsTopicsIterator.and.returnValue(fakeResult);

      const result = service.parents('topicNane');

      expect(result).toBe(fakeResult);
    });

    it('should call the helper service with the topic name and recursive flag', () => {
      service.parents('topicNane');

      expect(iteratorHelper.createParentsTopicsIterator).toHaveBeenCalledTimes(1);
      expect(iteratorHelper.createParentsTopicsIterator).toHaveBeenCalledWith( 'topicNane', true);
    });
  });
});
