import {TopicCreationErrors, TopicCreationService} from './topic-creation.service';


describe('TopicCreationService', () => {

  let service: TopicCreationService;
  let client, xmppService;
  beforeEach(() => {
    client = {
      createNode: (jid, title, config, cb) => {
        if (title !== true) {
          cb(undefined, {});
        } else {
          cb(undefined, {pubsub: {create: 'generatedNodeID'}});
        }
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
    service.createTopic('testing', null)
      .then((generatedTopicTitle) => {
        expect(generatedTopicTitle).toBe('testing');
        expect(client.createNode).toHaveBeenCalledTimes(1);
        const args = client.createNode.calls.mostRecent().args;
        expect(args[1]).toBe('testing');
        console.log(args[2]);
        expect(Object.keys(args[2]).length).toBe(0);
        done();
      }).catch((error) => {
      fail(`Got Error instead of successful result: ${error}`);
    });
  });

  it('should call `createTopic` with `true` if the given value is falsy', (done) => {
    spyOn(client, 'createNode').and.callThrough();
    service.createTopic(null, null)
      .then((generatedTopicTitle) => {
        expect(generatedTopicTitle).toBe('generatedNodeID');
        expect(client.createNode).toHaveBeenCalledTimes(1);
        const args = client.createNode.calls.mostRecent().args;
        expect(args[1]).toBe(true);
        expect(Object.keys(args[2]).length).toBe(0);
        done();
      }).catch((error) => {
      fail(`Got Error instead of successful result: ${error}`);
    });
  });

  it('should return an error object if it fails', (done) => {
    spyOn(client, 'createNode').and.callFake((jid, title, config, cb) => {
      cb({error: {condition: 'conflict'}});
    });
    service.createTopic(null, null)
      .then(() => {
        fail(`Expected an error instead of a successful result!`);
      })
      .catch((error) => {
        expect(error.condition).toBe(TopicCreationErrors.Conflict);
        done();
      });
  });

});
