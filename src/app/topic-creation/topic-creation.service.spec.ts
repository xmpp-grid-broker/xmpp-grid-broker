import {TopicCreationErrors, TopicCreationService} from '.';


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
      }, sendIq: () => {
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

  describe('when creating a new topic', () => {

    it('should call `createTopic` on the client', (done) => {
      spyOn(client, 'createNode').and.callThrough();
      service.createTopic('testing', null)
        .then((generatedTopicTitle) => {
          expect(generatedTopicTitle).toBe('testing');

          expect(client.createNode).toHaveBeenCalledTimes(1);
          const args = client.createNode.calls.mostRecent().args;

          expect(args[1]).toBe('testing');
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

  describe('when loading the default configuration', () => {
    it('should execute an IQ on the client', (done) => {
      spyOn(client, 'sendIq').and.callFake((cmd, cb) => {
        expect(cmd.type).toBe('get');
        expect(cmd.pubsubOwner.default).toBe(true);
        cb(undefined, {pubsubOwner: {default: {form: {fields: []}}}});
      });
      service.loadDefaultConfig()
        .then(() => {
          expect(client.sendIq).toHaveBeenCalledTimes(1);
          done();
        });
    });
    it('should reject the promise when sendIq fails', (done) => {
      spyOn(client, 'sendIq').and.callFake((cmd, cb) => {
        cb({error: {condition: 'not-implemented'}});
      });
      service.loadDefaultConfig()
        .then(() => {
          fail(`Expected an error instead of a successful result!`);
        })
        .catch((error) => {
          expect(error.condition).toBe('not-implemented');
          done();
        });
    });
  });
});
