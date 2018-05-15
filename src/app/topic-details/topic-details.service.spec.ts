import {LoadConfigurationFormErrorCodes, TopicDetailsService} from './topic-details.service';
import {XmppDataForm, XmppDataFormField, XmppDataFormFieldType} from '../core/models/FormModels';
import {IqType, XmppService} from '../core/xmpp/xmpp.service';
import {Affiliation, JidAffiliation} from '../core/models/Affiliation';
import {JID} from 'xmpp-jid';


describe('TopicDetailsService', () => {

  let service: TopicDetailsService;
  let xmppService: jasmine.SpyObj<XmppService>;
  beforeEach(() => {
    xmppService = jasmine.createSpyObj('XmppService', ['getClient', 'executeIqToPubsub']);
    service = new TopicDetailsService(xmppService);
  });

  it('should be created', () => {
      expect(service).toBeTruthy();
    }
  );

  describe('concerning the topic configuration', () => {
    beforeEach(() => {
      xmppService.executeIqToPubsub.and.returnValue(Promise.resolve({'pubsubOwner': {'config': {'form': {fields: []}}}}));
    });

    it('should execute an iq to fetch the form', (done) => {
      service.loadConfigurationForm('testing').then(() => {
        expect(xmppService.executeIqToPubsub).toHaveBeenCalled();
        const cmd = xmppService.executeIqToPubsub.calls.mostRecent().args[0];
        expect(cmd.type).toBe('get');
        expect(cmd.pubsubOwner.config.node).toBe('testing');
        done();
      });
    });

    it('should reject the promise if sendIq fails', (done) => {
      xmppService.executeIqToPubsub.and.returnValue(
        Promise.reject({condition: LoadConfigurationFormErrorCodes.Forbidden})
      );
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
        expect(xmppService.executeIqToPubsub).toHaveBeenCalledTimes(2);

        const cmd = xmppService.executeIqToPubsub.calls.first().args[0];
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

    beforeEach(() => {
      xmppService.executeIqToPubsub
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
        expect(xmppService.executeIqToPubsub).toHaveBeenCalledTimes(1);
        const cmd = xmppService.executeIqToPubsub.calls.mostRecent().args[0];
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
    beforeEach(() => {
      xmppService.executeIqToPubsub.and.returnValue(Promise.resolve({}));
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
        expect(xmppService.executeIqToPubsub).toHaveBeenCalledTimes(1);
        const cmd = xmppService.executeIqToPubsub.calls.mostRecent().args[0];
        expect(cmd.type).toBe(IqType.Set);
        expect(cmd.pubsubOwner.affiliations.node).toBe('testing');
        expect(cmd.pubsubOwner.affiliations.affiliation.type).toBe(Affiliation.Publisher);
        expect(cmd.pubsubOwner.affiliations.affiliation.jid).toBe('bard@shakespeare.lit');
        done();
      });
    });
  });

  describe('concerning the deletion of a topic', () => {
    beforeEach(() => {
      xmppService.executeIqToPubsub.and.returnValue(Promise.resolve({}));
    });
    it('should resolve when successful', (done) => {
      service.deleteTopic(
        'testing'
      ).then(() => {
        done();
      });
    });

    it('should execute an iq to delete the topic', (done) => {
      service.deleteTopic(
        'testing'
      ).then(() => {
        expect(xmppService.executeIqToPubsub).toHaveBeenCalledTimes(1);
        const cmd = xmppService.executeIqToPubsub.calls.mostRecent().args[0];
        expect(cmd.type).toBe(IqType.Set);
        expect(cmd.pubsubOwner.del).toBe('testing');
        done();
      });
    });
  });

});
