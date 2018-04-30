import {XmppFeatureService} from './xmpp-feature.service';

class FakeXmppService {
  public static PUBSUB_IQ_DISCOVERY_RESULT = {}; // TODO

  executeIq(cmd: any): Promise<any> {
    return Promise.resolve({});
  }
}

class FakeConfigService {
  getConfig(): Promise<any> {
    return Promise.resolve({xmpp: {jid: {domain: 'openfire'}}});
  }
}

describe('XmppFeatureService', () => {
  let service: XmppFeatureService;

  const xmppService: any = new FakeXmppService();
  const configService: any = new FakeConfigService();
  const xmppSpy = spyOn(xmppService, 'executeIq');
  xmppSpy.and.returnValue(FakeXmppService.PUBSUB_IQ_DISCOVERY_RESULT);


  beforeEach(() => {
    service = new XmppFeatureService(xmppService, configService);
  });

  it('should detect a supported feature', done => {
    service.checkFeature('pubsub', 'TODO').then((result) => { // TODO
      expect(xmppSpy).toHaveBeenCalled();
      expect(result).toBe(true);
      done();
    });
  });

  it('should detect a unsupported feature', done => {
    service.checkFeature('pubsub', 'inexistent').then((result) => {
      expect(xmppSpy).toHaveBeenCalled();
      expect(result).toBe(false);
      done();
    });
  });

  it('should detect if one of multiple features is unsupported', done => {
    service.checkFeatures('pubsub', ['inexistent1', 'TODO']).then((result) => { // TODO
      expect(xmppSpy).toHaveBeenCalled();
      expect(result).toBe(false);
      done();
    });
  });

  it('should detect if all of multiple features are supported', done => {
    service.checkFeatures('pubsub', ['TODO1', 'TODO2']).then((result) => { // TODO
      expect(xmppSpy).toHaveBeenCalled();
      expect(result).toBe(true);
      done();
    });
  });
});
