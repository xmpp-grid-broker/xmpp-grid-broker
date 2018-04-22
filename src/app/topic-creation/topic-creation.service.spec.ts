import {TopicCreationService} from './topic-creation.service';


describe('TopicCreationService', () => {

  let service: TopicCreationService;
  let client, xmppService;
  beforeEach(() => {
    client = {
      createNode: (jid, title, config, cb) => {
        cb();
      }
    };
    xmppService = jasmine.createSpyObj('XmppService', {
      'getClient': Promise.resolve(client),
    });
    service = new TopicCreationService(xmppService);
  });

  it('should be created', () => {
      expect(service).toBeTruthy();
    }
  );


  it('should call `createTopic` on the client', (done) => {
    spyOn(client, 'createNode').and.callThrough();
    service.createTopic('testing').then(() => {
      expect(client.createNode).toHaveBeenCalledTimes(1);
      const args = client.createNode.calls.mostRecent().args;
      expect(args[1]).toBe('testing');
      expect(Object.keys(args[2]).length).toBe(0);
      done();
    });
  });
});
