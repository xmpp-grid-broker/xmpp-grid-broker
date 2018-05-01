import {Paged, TopicOverviewService} from './topic-overview.service';
import {Topic, Topics} from '../../core/models/topic';
import {JID} from 'stanza.io';

class FakeClient {
  public getDiscoInfo() {
  }

  public getDiscoItems() {
  }
}

class FakeXmppService {
  public _client = new FakeClient();
  public pubSubJid = Promise.resolve(new JID('pubsub.xmppserver'));


  getClient(): Promise<any> {
    return Promise.resolve(this._client);
  }

  executeIqToPubsub(cmd): Promise<any> {
    return Promise.resolve();
  }
}

describe('TopicOverviewService', () => {
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
      ],
      'rsm': {
        'count': 2,
        'firstIndex': 0,
        'first': 'pubsub.xmppserver#leaf1',
        'last': 'pubsub.xmppserver#collection1'
      }
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
        },
      ],
      'rsm': {
        'count': 1,
        'firstIndex': 0,
        'first': 'pubsub.xmppserver#leaf2',
        'last':  'pubsub.xmppserver#leaf2'
      }
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

  let xmppService;
  let service: TopicOverviewService;

  beforeEach(() => {
    xmppService = new FakeXmppService();
    service = new TopicOverviewService(xmppService);

    spyOn(xmppService, 'executeIqToPubsub').and.callFake(
      (cmd) => {
        if (cmd.discoItems) {
          switch (cmd.discoItems.node) {
            case 'collection1':
              return Promise.resolve(DISCO_ITEMS_NODE_COLLECTION1);
            default:
              return Promise.resolve(DISCO_ITEMS_NODE_ROOT);
          }
        } else if (cmd.discoInfo) {
          switch (cmd.discoInfo.node) {
            case 'leaf1':
              return Promise.resolve(DISCO_INFO_NODE_LEAF1);
            case 'leaf2':
              return Promise.resolve(DISCO_INFO_NODE_LEAF2);
            case 'collection1':
              return Promise.resolve(DISCO_INFO_NODE_COLLECTION1);
          }
        }

        return Promise.reject('No clever impl found...');
      }
    );
  });

  it('should return a fake set of all topics', (done) => {
    service.allTopics().then((topics: Topics) => {
        expect(topics.length).toBe(2);
        expect(topics[0].title).toBe('leaf1');
        expect(topics[1].title).toBe('leaf2');
        done();
      },
      (error) => {
        throw error;
      }
    );
  });

  it('should return a fake set of root topics', (done) => {
    service.rootTopics().then((topics: Paged<Topic>) => {
        expect(topics.items.length).toBe(2);
        expect(topics.items[0].title).toBe('leaf1');
        expect(topics.items[1].title).toBe('collection1');
        done();
      },
      (error) => {
        throw error;
      }
    );
  });

  it('should return a fake set of collections', (done) => {
    service.allCollections().then((topics: Topics) => {
        expect(topics.length).toBe(1);
        expect(topics[0].title).toBe('collection1');
        done();
      },
      (error) => {
        throw error;
      }
    );
  });
});

