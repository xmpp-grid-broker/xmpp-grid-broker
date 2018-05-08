import {PersistedItemsService} from './persisted-items.service';
import {XmppService} from '../core/xmpp/xmpp.service';

describe('PersistedItemsService', () => {
  let service: PersistedItemsService;

  let xmppService: jasmine.SpyObj<XmppService>;

  beforeEach(() => {
    xmppService = jasmine.createSpyObj('XmppService', ['executeIqToPubsub']);
    service = new PersistedItemsService(xmppService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should yield persistedItems', () => {
    expect(service).toBeTruthy();
  });


});
