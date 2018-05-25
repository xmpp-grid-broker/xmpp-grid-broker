import {IqType, XmppService} from './xmpp.service';
import {Config, XmppConfig, XmppTransport} from '../models/config';
import {NotificationService} from '../notifications/notification.service';

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

  off(event: string, action: () => any) {

    if (this.handlers.has(event)) {
      const handlers = this.handlers.get(event);
      const idx = handlers.indexOf(action);
      if (idx > -1) {
        handlers.splice(idx, 1);
      }
    }
  }



  emit(event: string) {
    if (this.handlers.has(event)) {
      this.handlers.get(event).forEach((command) => command());
    }
  }

  sendIq(cmd, cb) {
    cb(undefined, {});
  }

  use() {
  }
}

class FakeXmppClientFactory {
  public client = new FakeClient();

  public createClient(): any {
    return this.client;
  }
}

describe('XmppService', () => {
  let xmppClientFactory, service: XmppService, notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    xmppClientFactory = new FakeXmppClientFactory();
    spyOn(xmppClientFactory, 'createClient').and.callThrough();
    spyOn(xmppClientFactory.client, 'connect').and.callThrough();
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['alert']);

    const xmppConfig = new XmppConfig('openfire', XmppTransport.Bosh, undefined, 'localhost');
    const config = new Config(xmppConfig);

    service = new XmppService(xmppClientFactory, notificationServiceSpy);
    service.initialize(config);

  });

  it('should return the jid domain when calling getServerTitle', () => {
    expect(service.getServerTitle()).toBe('openfire');
  });

  it('should return the pubSubJid', () => {
    expect(service.pubSubJid.full).toBe('pubsub.openfire');
  });

  describe('when calling executeIqToPubsub', () => {
    it('should load and add the pubSubJid', (done) => {
      const spy = spyOn(service, 'executeIq').and.callFake(() => Promise.resolve());
      service.executeIqToPubsub({})
        .then(() => {
          expect(spy).toHaveBeenCalledTimes(1);

          const args = spy.calls.mostRecent().args;
          expect(args[0].to.full).toBe('pubsub.openfire');
          done();
        })
        .catch((err) => fail(err));
    });
  });
  describe('when calling executeIq', () => {

    it('should call sendIq on the client', (done) => {
      const spy = spyOn(xmppClientFactory.client, 'sendIq').and.callThrough();
      const cmd = {type: IqType.Get};
      service.executeIq(cmd)
        .then(() => {
          expect(spy).toHaveBeenCalledTimes(1);

          const args = spy.calls.mostRecent().args;
          expect(args[0]).toBe(cmd);
          done();
        })
        .catch((err) => fail(err));
    });

    it('should resolve with result', (done) => {
      const expectedResult = {result: 'any'};
      spyOn(xmppClientFactory.client, 'sendIq').and.callFake((command, cb) =>
        cb(undefined, expectedResult)
      );

      service.executeIq({type: IqType.Get})
        .then((actualResult) => {
          expect(actualResult).toBe(expectedResult);
          done();
        })
        .catch((err) => fail(err));
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
      }).catch((err) => fail(err));
    });
  });

  [{
    event: 'auth:failed',
    title: 'Authentication Failed',
    message: 'Failed to authenticate on the XMPP server. Are using the right credentials?',
    canHide: false
  }].forEach(({event, title, message, canHide}) => {
    it(`should show a notification when ${event} is emitted`, (done) => {
      service.getClient().then(() => {
        xmppClientFactory.client.emit(event);
        expect(notificationServiceSpy.alert).toHaveBeenCalledTimes(1);
        const args = notificationServiceSpy.alert.calls.mostRecent().args;
        expect(args[0]).toBe(title);
        expect(args[1]).toBe(message);
        expect(args[2]).toBe(canHide);
        done();
      }).catch((err) => fail(err));
    });
  });
});
