import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {TopicService} from './topic.service';
import {Topics} from '../../core/models/topic';
import {JID} from 'stanza.io';

class FakeClient {
  readonly user = new JID('admin@xmppserver');

  public getDiscoInfo(jid: any, node: string, cb: (err?: any, data?: any) => void) {}
  public getDiscoItems(jid: any, node: string, cb: (err?: any, data?: any) => void) {}
}

class FakeXmppService {
  public client = new FakeClient;
  readonly jid = new JID('test@xmppserver');
  public query<T>(cb: (client: any, observer: Observer<T>) => void): Observable<T> {
    return new Observable((observer) => cb(this.client, observer));
  }
}

describe('RootTopicService', () => {
  const DISCO_ITEMS_NODE_ROOT = {
    'discoItems': {
      'items': [
        {
          'jid': new JID('pubsub.xmppserver'),
          'node': 'leaf1'
        },
        {
          'jid': new JID('pubsub.xmppserver'),
          'node': 'collection1'
        }
      ]
    },
    'lang': 'en',
    'id': '72977f2f-8db8-47f9-8a46-78c001905a12',
    'to': new JID('admin@xmppserver'),
    'from': new JID('pubsub.xmppserver'),
    'type': 'result'
  };

  const DISCO_ITEMS_NODE_COLLECTION1 = {
    'discoItems': {
      'items': [
        {
          'jid': new JID('pubsub.xmppserver'),
          'node': 'leaf2'
        }
      ]
    },
    'lang': 'en',
    'id': '99999999-8db8-47f9-8a46-78c999999912',
    'to': new JID('admin@xmppserver'),
    'from': new JID('pubsub.xmppserver'),
    'type': 'result'
  };

  const DISCO_INFO_NODE_LEAF1 = {
    'discoInfo': {
      'form': {
        'type': 'result',
      },
      'node': 'leaf1',
      'features': [
        'http://jabber.org/protocol/pubsub',
        'http://jabber.org/protocol/disco#info'
      ],
      'identities': [
        {
          'category': 'pubsub',
          'type': 'leaf'
        }
      ],
    },
    'lang': 'en',
    'id': '81d6b074-6069-4a78-a624-fffc5eada672',
    'to': new JID('admin@xmppserver'),
    'from': new JID('pubsub.xmppserver'),
    'type': 'result'
  };

  const DISCO_INFO_NODE_LEAF2 = {
    'discoInfo': {
      'form': {
        'type': 'result',
      },
      'node': 'leaf2',
      'features': [
        'http://jabber.org/protocol/pubsub',
        'http://jabber.org/protocol/disco#info'
      ],
      'identities': [
        {
          'category': 'pubsub',
          'type': 'leaf'
        }
      ],
    },
    'lang': 'en',
    'id': '81d6b074-6069-4a78-a624-fffc5eada672',
    'to': new JID('admin@xmppserver'),
    'from': new JID('pubsub.xmppserver'),
    'type': 'result'
  };

  const DISCO_INFO_NODE_COLLECTION1 = {
    'discoInfo': {
      'form': {
        'type': 'result',
      },
      'node': 'collection1',
      'features': [
        'http://jabber.org/protocol/pubsub',
        'http://jabber.org/protocol/disco#info'
      ],
      'identities': [
        {
          'category': 'pubsub',
          'type': 'collection'
        }
      ],
    },
    'lang': 'en',
    'id': '31d6b074-6069-4a78-a624-aaac5eada671',
    'to': new JID('admin@xmppserver'),
    'from': new JID('pubsub.xmppserver'),
    'type': 'result'
  };

  let xmppService, service;

  beforeEach(() => {
    xmppService = new FakeXmppService();
    service = new TopicService(xmppService);

    spyOn(xmppService.client, 'getDiscoItems')
      .and.callFake((jid: any, node: string, cb: (err?: any, data?: any) => void) => {
        switch (node) {
          case 'collection1':
            cb(null, DISCO_ITEMS_NODE_COLLECTION1);
            break;
          default:
            cb(null, DISCO_ITEMS_NODE_ROOT);
            break;
        }
      });

    spyOn(xmppService.client, 'getDiscoInfo')
      .and.callFake((jid: any, node: string, cb: (err?: any, data?: any) => void) => {
        switch (node) {
          case 'leaf1': cb(null, DISCO_INFO_NODE_LEAF1); break;
          case 'leaf2': cb(null, DISCO_INFO_NODE_LEAF2); break;
          case 'collection1': cb(null, DISCO_INFO_NODE_COLLECTION1); break;
        }
      });
  });

  it('should set the pubsub server jid', () => {
    expect(service.jid.domain).toBe('pubsub.xmppserver');
  });

  it('should return the xmpp server title', (done) => {
    service.getServerTitle().then((name: string) => {
      expect(name).toBe(xmppService.jid.domain);
      done();
    });
  });
  it('should return a fake set of all topics', (done) => {
    service.allTopics().subscribe(
      (topics: Topics) => {
        expect(topics.length).toBe(2);
        expect(topics[0].title).toBe('leaf1');
        expect(topics[1].title).toBe('leaf2');
        done();
      },
      (error) => { throw error; }
    );
  });

  it('should return a fake set of root topics', (done) => {
    service.rootTopics().subscribe(
      (topics: Topics) => {
        expect(topics.length).toBe(2);
        expect(topics[0].title).toBe('collection1');
        expect(topics[1].title).toBe('leaf1');
        done();
      },
      (error) => { throw error; }
    );
  });

  it('should return a fake set of collections', (done) => {
    service.allCollections().subscribe(
      (topics: Topics) => {
        expect(topics.length).toBe(1);
        expect(topics[0].title).toBe('collection1');
        done();
      },
      (error) => { throw error; }
    );
  });
});

