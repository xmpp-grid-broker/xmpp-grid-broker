import {XmppFeatureService} from './xmpp-feature.service';
import {ErrorLogService} from '../errors/error-log.service';

class FakeXmppService {

  executeIq(cmd: any): Promise<any> {
    return Promise.resolve({});
  }
  executeIqToPubsub(cmd: any): Promise<any> {
    return this.executeIq(cmd);
  }
  getServerTitle(): string {
    return 'openfire';
  }
}

describe('XmppFeatureService', () => {
  let service: XmppFeatureService, xmppSpy, logSpy: jasmine.SpyObj<ErrorLogService>;

  const PUBSUB_IQ_DISCOVERY_RESULT = {
    discoInfo: {
      features: XmppFeatureService.REQUIRED_PUBSUB_FEATURES
        .map(feature => `http://jabber.org/protocol/pubsub#${feature}`)
    }
  };
  PUBSUB_IQ_DISCOVERY_RESULT.discoInfo.features.push('http://jabber.org/protocol/pubsub');

  const xmppService: any = new FakeXmppService();

  beforeEach(() => {
    xmppSpy = spyOn(xmppService, 'executeIq');
    logSpy = jasmine.createSpyObj('ErrorLog', ['warn']);
    service = new XmppFeatureService(xmppService, logSpy);
  });

  it('should detect a supported feature', done => {
    xmppSpy.and.returnValue(Promise.resolve(PUBSUB_IQ_DISCOVERY_RESULT));
    service.checkFeature('pubsub', 'subscribe').then(result => {
      expect(xmppSpy).toHaveBeenCalled();
      expect(result).toBe(true);
      done();
    });
  });

  it('should detect a supported protocol', done => {
    xmppSpy.and.returnValue(Promise.resolve(PUBSUB_IQ_DISCOVERY_RESULT));
    service.checkFeature('pubsub').then(result => {
      expect(xmppSpy).toHaveBeenCalled();
      expect(result).toBe(true);
      done();
    });
  });

  it('should detect an unsupported feature', done => {
    xmppSpy.and.returnValue(Promise.resolve(PUBSUB_IQ_DISCOVERY_RESULT));
    const protocol = 'pubsub';
    const feature = 'do-magic';
    service.checkFeature(protocol, feature).then(result => {
      expect(xmppSpy).toHaveBeenCalled();
      expect(result).toBe(false);
      expect(logSpy.warn).toHaveBeenCalledWith(`XMPP feature ${feature} of protocol ${protocol} is not supported.`);
      done();
    });
  });

  it('should detect if one of multiple features is unsupported', done => {
    xmppSpy.and.returnValue(Promise.resolve(PUBSUB_IQ_DISCOVERY_RESULT));
    const protocol = 'pubsub';
    const feature = 'do-magic';
    service.checkFeatures(protocol, [feature, 'subscribe']).then(result => {
      expect(xmppSpy).toHaveBeenCalled();
      expect(result.length).toBe(1);
      expect(result).toContain('do-magic(pubsub)');
      expect(logSpy.warn).toHaveBeenCalledWith(`XMPP feature ${feature} of protocol ${protocol} is not supported.`);
      done();
    });
  });

  it('should detect if all of multiple features are supported', done => {
    xmppSpy.and.returnValue(Promise.resolve(PUBSUB_IQ_DISCOVERY_RESULT));
    service.checkFeatures('pubsub', ['collections', 'subscribe']).then(result => {
      expect(xmppSpy).toHaveBeenCalled();
      expect(result.length).toBe(0);
      done();
    });
  });

  it('should check if all required features are supported', done => {
    const discovery_result = PUBSUB_IQ_DISCOVERY_RESULT;
    discovery_result.discoInfo.features = discovery_result.discoInfo.features
      .filter(feature => !feature.endsWith('collections'));

    xmppSpy.and.returnValue(Promise.resolve(discovery_result));
    service.getMissingRequiredFeatures().then(result => {
      expect(xmppSpy).toHaveBeenCalled();
      expect(result.length).toBe(1);
      expect(result).toContain('collections(pubsub)');

      done();
    });
  });
});
