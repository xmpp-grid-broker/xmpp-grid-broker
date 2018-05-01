import {LoadConfigurationFormErrorCodes, TopicDetailsService} from './topic-details.service';
import {XmppDataForm, XmppDataFormField, XmppDataFormFieldType} from '../core/models/FormModels';
import {IqType, XmppService} from '../core/xmpp/xmpp.service';
import {Affiliation, JidAffiliation} from '../core/models/Affiliation';
import {JID} from 'xmpp-jid';


describe('TopicDetailsService', () => {

  let service: TopicDetailsService;
  let client, xmppService: XmppService;
  beforeEach(() => {
    xmppService = {getClient: null, executeIqToPubsub: null} as XmppService;
    service = new TopicDetailsService(xmppService);
  });

  it('should be created', () => {
      expect(service).toBeTruthy();
    }
  );

  describe('concerning the topic configuration', () => {
    beforeEach(() => {
      client = {
        sendIq: (cmd, cb) => {
          cb(undefined, {'pubsubOwner': {'config': {'form': {fields: []}}}});
        }
      };
      spyOn(xmppService, 'getClient').and.returnValue(Promise.resolve(client));
    });

    it('should execute an iq to fetch the form', (done) => {
      spyOn(client, 'sendIq').and.callThrough();
      service.loadConfigurationForm('testing').then(() => {
        expect(client.sendIq).toHaveBeenCalled();
        const cmd = client.sendIq.calls.mostRecent().args[0];
        expect(cmd.type).toBe('get');
        expect(cmd.pubsubOwner.config.node).toBe('testing');
        done();
      });
    });

    it('should reject the promise if sendIq fails', (done) => {
      spyOn(client, 'sendIq').and.callFake((cmd, cb) => {
        cb({error: {condition: LoadConfigurationFormErrorCodes.Forbidden}}, undefined);
      });
      service.loadConfigurationForm('testing')
        .then(() => {
          fail('Expected an error instead of a successful result!');
        })
        .catch((error) => {
          expect(error.condition).toBe(LoadConfigurationFormErrorCodes.Forbidden);
          done();
        });
    });


    it('should execute an 2 iqs to submit the form', (done) => {
      spyOn(client, 'sendIq').and.callThrough();
      const form = new XmppDataForm([
        new XmppDataFormField(
          XmppDataFormFieldType.hidden,
          'FORM_TYPE',
          '...'
        ),
        new XmppDataFormField(
          XmppDataFormFieldType.boolean,
          'example1',
          true
        ),
      ]);

      service.updateTopicConfiguration('testing', form).then(() => {
        expect(client.sendIq).toHaveBeenCalledTimes(2);

        const cmd = client.sendIq.calls.first().args[0];
        const fields = cmd.pubsubOwner.config.form.fields;
        expect(cmd.type).toBe('set');
        expect(cmd.pubsubOwner.config.node).toBe('testing');
        expect(fields.length).toBe(2);
        expect(fields[0].name).toBe('FORM_TYPE');
        expect(fields[1].name).toBe('example1');

        done();

      });
    });
  });

  describe('concerning loading affiliations', () => {

    let spy: jasmine.Spy;
    beforeEach(() => {
      spy = spyOn(xmppService, 'executeIqToPubsub')
        .and.returnValue(Promise.resolve({
          'pubsubOwner': {
            'affiliations': {
              list: [
                {type: Affiliation.Owner, jid: new JID('hamlet@denmark.lit')},
                {type: Affiliation.Publisher, jid: new JID('bard@shakespeare.lit')}
              ]
            }
          }
        }));
    });

    it('should execute an iq to load the affiliations', (done) => {
      service.loadJidAffiliations('testing').then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        const cmd = spy.calls.mostRecent().args[0];
        expect(cmd.type).toBe(IqType.Get);
        expect(cmd.pubsubOwner.affiliations.node).toBe('testing');
        done();
      });
    });

    it('should return a list of JIDAffiliations', (done) => {
      service.loadJidAffiliations('testing').then((result) => {
        expect(result.length).toBe(2);
        expect(result[0].affiliation).toBe(Affiliation.Owner);
        expect(result[0].jid).toBe('hamlet@denmark.lit');
        expect(result[1].affiliation).toBe(Affiliation.Publisher);
        expect(result[1].jid).toBe('bard@shakespeare.lit');
        done();
      });
    });
  });
  describe('concerning loading affiliations', () => {
    let spy: jasmine.Spy;
    beforeEach(() => {
      spy = spyOn(xmppService, 'executeIqToPubsub')
        .and.returnValue(Promise.resolve({}));
    });
    it('should resolve when successful', (done) => {
      service.modifyJidAffiliation(
        'testing',
        new JidAffiliation('bard@shakespeare.lit', Affiliation.Publisher)
      ).then(() => {
        done();
      });
    });

    it('should execute an iq to update the given affiliation', (done) => {
      service.modifyJidAffiliation(
        'testing',
        new JidAffiliation('bard@shakespeare.lit', Affiliation.Publisher)
      ).then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        const cmd = spy.calls.mostRecent().args[0];
        expect(cmd.type).toBe(IqType.Set);
        expect(cmd.pubsubOwner.affiliations.node).toBe('testing');
        expect(cmd.pubsubOwner.affiliations.affiliation.type).toBe(Affiliation.Publisher);
        expect(cmd.pubsubOwner.affiliations.affiliation.jid).toBe('bard@shakespeare.lit');
        done();
      });
    });
  });
});
