import {LoadConfigurationFormErrorCodes, TopicDetailsService} from './topic-details.service';
import {XmppDataForm, XmppDataFormField, XmppDataFormFieldType} from '../core/models/FormModels';


describe('TopicDetailsService', () => {

  let service: TopicDetailsService;
  let client, xmppService;
  beforeEach(() => {
    client = {
      sendIq: (cmd, cb) => {
        cb(undefined, {'pubsubOwner': {'config': {'form': {fields: []}}}});
      }
    };
    xmppService = jasmine.createSpyObj('XmppService', {
      'getClient': Promise.resolve(client),
    });
    service = new TopicDetailsService(xmppService);
  });

  it('should be created', () => {
      expect(service).toBeTruthy();
    }
  );

  describe('concerning the topic configuration', function () {

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
});
