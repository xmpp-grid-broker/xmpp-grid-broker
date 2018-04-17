import { TestBed, inject } from '@angular/core/testing';

import { XmppService } from './xmpp.service';

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

  public createClient(config: any): any {
    return this.client;
  }
}

describe('XmppService', () => {
  let xmppClientFactory, service;

  beforeEach(() => {
    xmppClientFactory = new FakeXmppClientFactory();
    spyOn(xmppClientFactory, 'createClient').and.callThrough();
    spyOn(xmppClientFactory.client, 'connect').and.callThrough();

    service = new XmppService(xmppClientFactory);

  });

  it('should create a client instance', () => {
    expect(xmppClientFactory.createClient).toHaveBeenCalled();
  });

  it('should call the client connection method on first query', (done) => {
    service.query((client, observer) => {
      observer.next();
      observer.complete();
    }).subscribe(() => {
      expect(xmppClientFactory.client.connect).toHaveBeenCalled();
      service.query((client, observer) => {
        observer.next();
        observer.complete();
      }).subscribe(() => {
        expect(xmppClientFactory.client.connect.calls.count()).toEqual(1);
        done();
      });
    });
  });

  it('should execute queries if connected to an xmpp server', (done) => {
    service.query(
      (client, observer) => {
        expect(client).toEqual(xmppClientFactory.client);
        observer.next('result');
        observer.complete();
      }
    ).subscribe(
        (result) => {
        expect(result).toEqual('result');
        done();
      }
    );
  });

  it('should throw an error if authentication fails or session errors', () => {
    expect(() => xmppClientFactory.client.emit('auth:failed')).toThrow();
    expect(() => xmppClientFactory.client.emit('session:error')).toThrow();
    expect(() => xmppClientFactory.client.emit('session:end')).not.toThrow();
  });
});
