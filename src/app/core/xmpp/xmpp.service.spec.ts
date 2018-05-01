import {JID} from 'xmpp-jid';
import {IqType, XmppService} from './xmpp.service';
import {Config, XmppConfig, XmppTransport} from '../models/config';

class FakeClient {
  private handlers: Map<string, Array<() => any>> = new Map();

  connect() {
    this.emit('session:started');
  }

  on(event: string, action: () => any) {
    let handlers: Array<() => any> = [];

    if (this.handlers.has(event)) {
      handlers = this.handlers.get(event);
    }

    handlers.push(action);
    this.handlers.set(event, handlers);
  }

  emit(event: string) {
    if (this.handlers.has(event)) {
      this.handlers.get(event).forEach((command) => command());
    }
  }

  sendIq(cmd, cb) {
    cb(undefined, {});
  }
}

class FakeConfigService {
  public getConfig(): Promise<Config> {
    const xmppConfig = new XmppConfig(new JID('admin@openfire'), 'openfire', XmppTransport.Bosh, 'localhost');
    const config = new Config(xmppConfig);
    return Promise.resolve(config);
  }
}

class FakeXmppClientFactory {
  public client = new FakeClient();

  public createClient(): any {
    return this.client;
  }
}

describe('XmppService', () => {
  let xmppClientFactory, service: XmppService, configService;

  beforeEach(() => {
    xmppClientFactory = new FakeXmppClientFactory();
    spyOn(xmppClientFactory, 'createClient').and.callThrough();
    spyOn(xmppClientFactory.client, 'connect').and.callThrough();

    configService = new FakeConfigService();

    service = new XmppService(xmppClientFactory, configService);

  });

  it('should return the jid domain when calling getServerTitle', (done) => {
    service.getServerTitle().then((title) => {
      expect(title).toBe('openfire');
      done();
    });
  });

  it('should return the pubSubJid', (done) => {
    service.pubSubJid.then(pubSubJid => {
      expect(pubSubJid.full).toBe('pubsub.openfire');
      done();
    });
  });

  describe('when calling executeIqToPubsub', () => {
    it('should load and add the pubSubJid', (done) => {
      const spy = spyOn(service, 'executeIq').and.callFake(() => Promise.resolve());
      service.executeIqToPubsub({}).then(() => {
        expect(spy).toHaveBeenCalledTimes(1);

        const args = spy.calls.mostRecent().args;
        expect(args[0].to.full).toBe('pubsub.openfire');
        done();
      });
    });
  });
  describe('when calling executeIq', () => {

    it('should call sendIq on the client', (done) => {
      const spy = spyOn(xmppClientFactory.client, 'sendIq').and.callThrough();
      const cmd = {type: IqType.Get};
      service.executeIq(cmd).then(() => {
        expect(spy).toHaveBeenCalledTimes(1);

        const args = spy.calls.mostRecent().args;
        expect(args[0]).toBe(cmd);
        done();
      });
    });

    it('should resolve with result', (done) => {
      const expectedResult = {result: 'any'};
      spyOn(xmppClientFactory.client, 'sendIq').and.callFake((command, cb) =>
        cb(undefined, expectedResult)
      );

      service.executeIq({type: IqType.Get}).then((actualResult) => {
        expect(actualResult).toBe(expectedResult);
        done();
      });
    });

    it('should reject with the error', (done) => {
      const expectedError = {error: 'any'};
      spyOn(xmppClientFactory.client, 'sendIq').and.callFake((command, cb) =>
        cb(expectedError, undefined)
      );

      service.executeIq({type: IqType.Get})
        .then(() => {
          fail('Expected Promise to reject');
        })
        .catch((actualError) => {
          expect(actualError).toBe(expectedError.error);
          done();
        });
    });
  });


  it('should call the client connection method on first query', (done) => {
    service.getClient().then(() => {
      expect(xmppClientFactory.client.connect).toHaveBeenCalled();
      service.getClient().then(() => {
        expect(xmppClientFactory.client.connect.calls.count()).toEqual(1);
        done();
      });
    });
  });

  it('should throw an error if authentication fails or session errors', (done) => {
    service.getClient().then(() => {
      expect(() => xmppClientFactory.client.emit('auth:failed')).toThrow();
      expect(() => xmppClientFactory.client.emit('session:error')).toThrow();
      expect(() => xmppClientFactory.client.emit('session:end')).not.toThrow();
      done();
    });
  });
});
