import {TopicService} from './topic.service';
import {Topics} from '../../core/models/topic';

describe('RootTopicService', () => {
  it('should return a fake title', (done) => {
    const service = new TopicService();
    service.getServerTitle().then((name: string) => {
      expect(name).toBe('xmpp.hsr.ch');
      done();
    });
  });

  it('should return a fake set of all topics', (done) => {
    const service = new TopicService();
    service.allTopics().subscribe((topics: Topics) => {
      expect(topics.length).toBe(2);
      expect(topics[0].title).toBe('Child #1');
      expect(topics[1].title).toBe('SubChild #1');
      done();
    });
  });

  it('should return a fake set of root topics', (done) => {
    const service = new TopicService();
    service.rootTopics().subscribe((topics: Topics) => {
      expect(topics.length).toBe(2);
      expect(topics[0].title).toBe('Root #1');
      expect(topics[1].title).toBe('Root #2');
      done();
    });
  });

  it('should return a fake set of collections', (done) => {
    const service = new TopicService();
    service.allCollections().subscribe((topics: Topics) => {
      expect(topics.length).toBe(3);
      expect(topics[0].title).toBe('Root #1');
      expect(topics[1].title).toBe('Root #2');
      expect(topics[2].title).toBe('Child #2');
      done();
    });
  });
});

