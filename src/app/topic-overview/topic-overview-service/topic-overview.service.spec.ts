import {TopicOverviewService} from './topic-overview.service';
import {XmppService} from '../../core/xmpp/xmpp.service';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import {JID} from 'xmpp-jid';

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
        'last': 'pubsub.xmppserver#leaf2'
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

  let xmppService: SpyObj<XmppService>;
  let service: TopicOverviewService;

  beforeEach(() => {
    xmppService = createSpyObj('XmppService', ['executeIqToPubsub']);
    service = new TopicOverviewService(xmppService);

    xmppService.executeIqToPubsub.and.callFake(
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

  it('should return an iterator of all topics', async () => {
    const iterator = service.allTopics();
    expect((await iterator.next()).value.title).toBe('leaf1');
    expect((await iterator.next()).value.title).toBe('leaf2');
    expect((await iterator.next()).done).toBe(true);
  });


  it('should return an iterator of all root topics', async () => {
    const iterator = service.rootTopics();
    expect((await iterator.next()).value.title).toBe('leaf1');
    expect((await iterator.next()).value.title).toBe('collection1');
    expect((await iterator.next()).done).toBe(true);
  });
  it('should return an iterator of all collections', async () => {
    const iterator = service.allCollections();
    expect((await iterator.next()).value.title).toBe('collection1');
    expect((await iterator.next()).done).toBe(true);
  });
});

