import {PersistedItem, PersistedItemsService} from './persisted-items.service';
import {IqType, XmppService} from '../core/xmpp/xmpp.service';

describe('PersistedItemsService', () => {
  let service: PersistedItemsService;

  let xmppService: jasmine.SpyObj<XmppService>;

  beforeEach(() => {
    xmppService = jasmine.createSpyObj('XmppService', ['executeIqToPubsub']);
    service = new PersistedItemsService(xmppService);

  });

  describe('when calling loadPersistedItemContent', () => {
    it('should call retrieve command on the service', async () => {
      xmppService.executeIqToPubsub.and.returnValue(Promise.resolve({
        pubsub: {
          retrieve: {
            item: {
              rawXML: '<foo><baa></baa></foo>'
            }
          }
        }
      }));

      const testItem = new PersistedItem('001');

      const returnedItem: PersistedItem = await service.loadPersistedItemContent(
        'test-topic',
        testItem);

      // Verify stanza object
      expect(xmppService.executeIqToPubsub).toHaveBeenCalledTimes(1);
      const args = xmppService.executeIqToPubsub.calls.mostRecent().args;
      expect(args[0].type).toBe(IqType.Get);
      expect(args[0].pubsub.retrieve.node).toBe('test-topic');
      expect(args[0].pubsub.retrieve.item.id).toBe('001');

      // Ensure the element is updated inplace
      expect(testItem.rawXML).toBe('<foo><baa></baa></foo>');
      await expect(returnedItem).toBe(testItem);
    });

    it('should reject when executeIqToPubsub fails', async () => {
      xmppService.executeIqToPubsub.and.returnValue(Promise.reject(
        {condition: 'example-error'}
      ));

      try {
        const result = await service.loadPersistedItemContent('test-topic', new PersistedItem('001'));
        fail(`expected an error but got: ${result}`);
      } catch (e) {
        console.log(e);
        expect(e.condition).toBe('example-error');
      }
    });
  });

  describe('when calling persistedItems', () => {

    /**
     * Helper method to generate jxt-xmpp disco responses...
     */
    const createDiscoItemsResponse = (allItems: { name: string }[], firstIdx: number, lastIdx: number) => {
      const subsetToReturn = allItems.slice(firstIdx, lastIdx);
      return Promise.resolve({
        discoItems: {
          items: subsetToReturn,
          rsm: {
            last: subsetToReturn.length === 0 ? undefined : `${subsetToReturn[subsetToReturn.length - 1].name}`,
            firstIndex: `${firstIdx}`,
            count: `${allItems.length}`
          }
        }
      });
    };

    it('should yield no results when service discovery response is empty', async () => {
      xmppService.executeIqToPubsub.and.returnValue(createDiscoItemsResponse([], 0, 0));

      const iterator = service.persistedItems('test-topic');

      expect((await iterator.next()).done).toBeTruthy();
    });

    it('should yield each item loaded using service discovery', async () => {
      xmppService.executeIqToPubsub.and.returnValue(createDiscoItemsResponse([
        {name: '001'},
        {name: '002'},
        {name: '003'},
        {name: '004'}
      ], 0, 4));


      const iterator = service.persistedItems('test-topic');

      expect((await iterator.next()).value.id).toBe('001');
      expect((await iterator.next()).value.id).toBe('002');
      expect((await iterator.next()).value.id).toBe('003');
      expect((await iterator.next()).value.id).toBe('004');
      expect((await iterator.next()).done).toBeTruthy();
    });

    it('should fetch all items using paging (rsm)', async () => {

      // Generate 25 fake results
      const items = [];
      for (let i = 1; i <= 25; i++) {
        items.push({name: `item ${i}`});
      }

      // setup the executeIqToPubsub to return them in tranches of 10
      xmppService.executeIqToPubsub.and.returnValues(
        createDiscoItemsResponse(items, 0, 10),
        createDiscoItemsResponse(items, 10, 20),
        createDiscoItemsResponse(items, 20, 25)
      );

      // Verify that the service yields them all in a sequence
      const iterator = service.persistedItems('test-topic');
      for (let i = 1; i <= 25; i++) {
        expect((await iterator.next()).value.id).toBe(`item ${i}`);
      }
      expect((await iterator.next()).done).toBeTruthy();

      // verify calls rsm calls are correct
      expect(xmppService.executeIqToPubsub).toHaveBeenCalledTimes(3);
      let args = xmppService.executeIqToPubsub.calls.argsFor(0);
      await expect(args[0].discoItems.rsm.max).toBe(10);
      await expect(args[0].discoItems.rsm.after).toBe(undefined);
      args = xmppService.executeIqToPubsub.calls.argsFor(1);
      await expect(args[0].discoItems.rsm.max).toBe(10);
      await expect(args[0].discoItems.rsm.after).toBe('item 10');
      args = xmppService.executeIqToPubsub.calls.argsFor(2);
      await expect(args[0].discoItems.rsm.max).toBe(10);
      await expect(args[0].discoItems.rsm.after).toBe('item 20');
    });
  });
});
