import {XmppService} from './xmpp.service';

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
}

class FakeXmppClientFactory {
  public client = new FakeClient();

  public createClient(): any {
    return this.client;
  }
}

describe('XmppService', () => {
  let xmppClientFactory, service: XmppService;

  beforeEach(() => {
    xmppClientFactory = new FakeXmppClientFactory();
    spyOn(xmppClientFactory, 'createClient').and.callThrough();
    spyOn(xmppClientFactory.client, 'connect').and.callThrough();

    service = new XmppService(xmppClientFactory);

  });

  it('should create a client instance', () => {
    expect(xmppClientFactory.createClient).toHaveBeenCalled();
  });

  it('should return the jid domain when calling getServerTitle', (done) => {
    service.getServerTitle().then((title) => {
      expect(title).toBe('openfire');
      done();
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

  it('should throw an error if authentication fails or session errors', () => {
    expect(() => xmppClientFactory.client.emit('auth:failed')).toThrow();
    expect(() => xmppClientFactory.client.emit('session:error')).toThrow();
    expect(() => xmppClientFactory.client.emit('session:end')).not.toThrow();
  });
});
