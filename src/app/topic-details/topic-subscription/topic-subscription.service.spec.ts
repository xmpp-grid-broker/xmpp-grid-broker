import {TopicSubscriptionService} from './topic-subscription.service';
import {XmppService} from '../../core/xmpp/xmpp.service';
import {JID} from 'xmpp-jid';
import {SubscriptionState} from '../../core/models/Subscription';
import {XmppErrorCondition} from '../../core/errors';

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

      const subscriptions = await service.loadSubscriptions('test-topic');
      expect(subscriptions.length).toBe(0);

      await expect(xmppService.executeIqToPubsub).toHaveBeenCalledTimes(1);
      const cmd = xmppService.executeIqToPubsub.calls.mostRecent().args[0];
      await expect(cmd.pubsubOwner.subscriptions.node).toBe('test-topic');
    });

    it('it can handle unset subscriptions list', async () => {
      xmppService.executeIqToPubsub.and.returnValue(Promise.resolve({pubsubOwner: {subscriptions: {}}}));

      const subscriptions = await service.loadSubscriptions('test-topic');

      expect(subscriptions.length).toBe(0);
      await expect(xmppService.executeIqToPubsub).toHaveBeenCalledTimes(1);
      const cmd = xmppService.executeIqToPubsub.calls.mostRecent().args[0];
      await expect(cmd.pubsubOwner.subscriptions.node).toBe('test-topic');
    });


    it('it map the results to subscription objects', async () => {
      const rawSubscriptions = [
        {jid: new JID('foo@openfire'), type: 'subscribed', expiry: '2006-02-28T23:59:59Z', subid: '123-123-123'},
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
        {condition: XmppErrorCondition.FeatureNotImplemented}
      ));

      try {
        await service.loadSubscriptions('test-topic');
        fail(`expected an error`);
      } catch (e) {
        await expect(e.message).toBe('Node or service does not support subscription management');
      }
    });
  });
  describe('when calling subscribe', () => {
    it('it should call the xmpp service', async () => {
      xmppService.executeIqToPubsub.and.returnValue(Promise.resolve({}));

      await service.subscribe('test-topic', 'test-jid');

      await expect(xmppService.executeIqToPubsub).toHaveBeenCalledTimes(1);
      const cmd = xmppService.executeIqToPubsub.calls.mostRecent().args[0];
      await expect(cmd.pubsub.subscribe.node).toBe('test-topic');
      await expect(cmd.pubsub.subscribe.jid).toBe('test-jid');

    });

    it('should reject when executeIqToPubsub fails', async () => {
      xmppService.executeIqToPubsub.and.returnValue(Promise.reject(
        {condition: XmppErrorCondition.FeatureNotImplemented}
      ));

      try {
        await service.subscribe('test-topic', 'test-jid');
        fail(`expected an error`);
      } catch (e) {
        await expect(e.message).toBe('Topic test-topic does not support subscriptions.');
      }
    });
  });
});
