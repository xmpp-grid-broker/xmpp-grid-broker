import {TopicSubscriptionService} from './topic-subscription.service';
import {XmppService} from '../core/xmpp/xmpp.service';
import {JID} from 'xmpp-jid';
import {SubscriptionState} from '../core/models/Subscription';

describe('TopicSubscriptionService', () => {
  let service: TopicSubscriptionService;

  let xmppService: jasmine.SpyObj<XmppService>;

  beforeEach(() => {
    xmppService = jasmine.createSpyObj('XmppService', ['executeIqToPubsub']);
    service = new TopicSubscriptionService(xmppService);
  });

  describe('when calling loadSubscriptions', () => {
    it('it should call the xmpp service', async () => {
      xmppService.executeIqToPubsub.and.returnValue(Promise.resolve({pubsubOwner: {subscriptions: {list: []}}}));

      await service.loadSubscriptions('test-topic');

      await expect(xmppService.executeIqToPubsub).toHaveBeenCalledTimes(1);
      const cmd = xmppService.executeIqToPubsub.calls.mostRecent().args[0];
      await expect(cmd.pubsubOwner.subscriptions.node).toBe('test-topic');
    });

    it('it map the results to subscription objects', async () => {
      const rawSubscriptions = [
        {jid: new JID('foo@openfire'), subscription: 'subscribed', expiry: '2006-02-28T23:59:59Z', subid: '123-123-123'},
        {jid: new JID('baa@openfire')}
      ];
      xmppService.executeIqToPubsub.and.returnValue(Promise.resolve({pubsubOwner: {subscriptions: {list: rawSubscriptions}}}));

      const subscriptions = await service.loadSubscriptions('test-topic');

      await expect(subscriptions[0].jid).toBe('foo@openfire');
      await expect(subscriptions[0].state).toBe(SubscriptionState.Subscribed);
      await expect(subscriptions[0].expiry).toBe('2006-02-28T23:59:59Z');
      await expect(subscriptions[0].subid).toBe('123-123-123');

      await expect(subscriptions[1].jid).toBe('baa@openfire');
      await expect(subscriptions[1].state).toBeUndefined();
      await expect(subscriptions[1].expiry).toBeUndefined();
      await expect(subscriptions[1].subid).toBeUndefined();

    });

    it('should reject when executeIqToPubsub fails', async () => {
      xmppService.executeIqToPubsub.and.returnValue(Promise.reject(
        {condition: 'example-error'}
      ));

      try {
        await service.loadSubscriptions('test-topic');
        fail(`expected an error`);
      } catch (e) {
        await expect(e.condition).toBe('example-error');
      }
    });
  });

});
