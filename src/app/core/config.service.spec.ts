import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {JID} from 'xmpp-jid';
import {ConfigService} from './config.service';
import {Config, XmppConfig, XmppTransport} from './models/config';


class FakeErrorResponse {
  constructor(readonly message: string, status: number, statusText: string) {}
}

class FakeHttpClient {
  constructor(public fake_url: string, public fake_result: any = {}) {}

  get(url: string): Observable<any> {
    if (url === this.fake_url) {
      return Observable.of({});
    } else {
      return new Observable(({next, error}) => {
        return error(new FakeErrorResponse('not found', 404, 'not found'));
      });
    }
  }
}

describe('ConfigService', () => {
  let httpClient, service: ConfigService;

  const JSON_CONFIG = {
    xmpp: {
      jid: 'admin@openfire',
      jid_domain: 'openfire',
      transport: 'bosh',
      boshURL: 'localhost',
      useStreamManagement: false
    }
  };

  const REFERENCE_CONFIG = new Config(new XmppConfig(
    new JID('admin@openfire'),
    'openfire',
    XmppTransport.Bosh,
    undefined,
    'localhost',
    false
  ));

  it('should request the configuration file', done => {
    httpClient = new FakeHttpClient('./configuration.json');
    spyOn(httpClient, 'get').and.callFake(() => Observable.of(JSON_CONFIG));
    service = new ConfigService(httpClient);

    service.getConfig().then(config => {
      expect(httpClient.get).toHaveBeenCalledWith(httpClient.fake_url);
      done();
    });
  });

  it('should parse the configuration json correctly', done => {
    httpClient = new FakeHttpClient('./configuration.json');
    spyOn(httpClient, 'get').and.callFake(() => Observable.of(JSON_CONFIG));
    service = new ConfigService(httpClient);

    service.getConfig().then((config: Config) => {
      const required =  ['jid_domain', 'transport', 'boshUrl', 'useStreamManagement'];
      for (const name of required) {
        expect(config.xmpp[name]).toBe(REFERENCE_CONFIG.xmpp[name]);
      }

      expect(config.xmpp.jid.full).toBe(REFERENCE_CONFIG.xmpp.jid.full);
      expect(config.xmpp.sasl[0]).toBe(REFERENCE_CONFIG.xmpp.sasl[0]);
      done();
    });
  });

  it('should throw error if configuration file does not exist',  (done) => {
    httpClient = new FakeHttpClient('./bla.json');

    // Catch asynchronously thrown error from ConfigService.constructor
    const initialisation = async() => {
      service = new ConfigService(httpClient);
      await service.getConfig();
    };

    initialisation().then(() => fail('No error thrown!'), () => done());
  });

  it('should throw error if configuration file is invalid', (done) => {
    httpClient = new FakeHttpClient('./configuration.json');
    spyOn(httpClient, 'get').and.callFake(() => Observable.of({}));

    // Catch asynchronously thrown error from ConfigService.constructor
    const initialisation = async() => {
        service = new ConfigService(httpClient);
        return await service.getConfig();
    };

    initialisation().then(() => fail('No error thrown!'), () => done());
  });

  it('should throw error if configuration file is incomplete', (done) => {
    httpClient = new FakeHttpClient('./configuration.json');
    const incomplete_json_config = JSON_CONFIG;
    incomplete_json_config.xmpp.boshURL = undefined;

    spyOn(httpClient, 'get').and.callFake(() => Observable.of(incomplete_json_config));

    // Catch asynchronously thrown error from ConfigService.constructor
    const initialisation = async() => {
      service = new ConfigService(httpClient);
      return await service.getConfig();
    };

    initialisation()
      .then(() => fail('No error thrown!'), () => done());
  });
});
