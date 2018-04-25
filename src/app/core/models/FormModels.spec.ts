import {XmppDataForm, XmppDataFormField, XmppDataFormFieldType} from './FormModels';

describe('XmppDataFormField', () => {
  describe('when calling toJSON', () => {
    it('should return key and name as an object', () => {
      const field = new XmppDataFormField(XmppDataFormFieldType.textSingle, 'title', 'fooBaaa');

      const result = field.toJSON();

      expect(Object.keys(result).length).toBe(2);
      expect(result['name']).toBe('title');
      expect(result['value']).toBe('fooBaaa');
    });
  });


  describe('when calling fromJSON', () => {
    const givenJSON = {'type': 'hidden', 'name': 'fieldName', 'value': 'fieldValue', 'label': 'fieldLabel'};

    it('should set type, name and label properly', () => {
      const result = XmppDataFormField.fromJSON(givenJSON);
      expect(result.type).toBe('hidden');
      expect(result.name).toBe('fieldName');
      expect(result.label).toBe('fieldLabel');
    });

    it('should set value when provided', () => {
      const result = XmppDataFormField.fromJSON(givenJSON);
      expect(result.value).toBe('fieldValue');
    });

    it('should set the value to null if not given', () => {
      const result = XmppDataFormField.fromJSON({'type': 'hidden', 'name': 'fieldName'});
      expect(result.value).toBe(null);
    });

    ['hidden', 'boolean', 'text-single', 'text-multi', 'jid-multi', 'jid-single', 'fixed', 'text-private'].forEach((fieldType) => {
      it(`should set options to null for non-list fields: ${fieldType}`, () => {
        const result = XmppDataFormField.fromJSON({'type': fieldType, 'name': 'fieldName'});
        expect(result.value).toBe(null);
      });
    });

    ['list-single', 'list-multi'].forEach((fieldType) => {
      it(`should set options for a '${fieldType}' field`, () => {
        const result = XmppDataFormField.fromJSON({
          'type': fieldType, 'name': 'fieldName',
          'options': [{'value': 'v1', 'label': 'l'}, {'value': 'v2'}]
        });

        expect(result.options[0].value).toBe('v1');
        expect(result.options[1].value).toBe('v2');
        expect(result.options[0].label).toBe('l');
        expect(result.options[1].label).toBe(null);
      });
    });
  });
});

describe('XmppDataForm', () => {
  describe('when calling toJSON on a Form with 2 fields', () => {
    let field1: XmppDataFormField;
    let field2: XmppDataFormField;
    let form: XmppDataForm;

    beforeEach(() => {
      field1 = new XmppDataFormField(XmppDataFormFieldType.hidden, 'FORM_TYPE', 'http://...');
      field2 = new XmppDataFormField(XmppDataFormFieldType.textSingle, 'title', 'fooBaaa');
      form = new XmppDataForm([field1, field2]);

    });
    it('should contain a fields property', () => {
      const jsonObject = form.toJSON();

      expect(jsonObject['fields']).toBeDefined();
    });

    it('should has submit as default type', () => {
      const jsonObject = form.toJSON();

      expect(jsonObject['type']).toBe('submit');
    });

    it('should contain the defined type as property', () => {
      const jsonObject = form.toJSON('result');

      expect(jsonObject['type']).toBe('result');
    });


    it('should contain an entry in the fields array for every field', () => {
      const jsonObject = form.toJSON();

      expect(jsonObject['fields'][0]).toBeDefined();
      expect(jsonObject['fields'][1]).toBeDefined();
    });

    it('Should call `toJSON` on each field and combine the results', () => {
      spyOn(field1, 'toJSON').and.returnValue('F1');
      spyOn(field2, 'toJSON').and.returnValue('F2');

      const jsonObject = form.toJSON();

      expect(field1.toJSON).toHaveBeenCalledTimes(1);
      expect(field2.toJSON).toHaveBeenCalledTimes(1);
      expect(jsonObject['fields'][0]).toBe('F1');
      expect(jsonObject['fields'][1]).toBe('F2');
    });
  });
  describe('when calling fromJSON', () => {
    it('should call `fromJSON` for each field and combine the results', () => {
      spyOn(XmppDataFormField, 'fromJSON').and.callThrough();
      const givenJSON = {
        fields: [
          {'type': 'hidden', 'name': 'fieldName', 'value': 'fieldValue'},
          {'type': 'text-single', 'name': 'single', 'value': 'single'}
        ]
      };

      const result = XmppDataForm.fromJSON(givenJSON);

      expect(XmppDataFormField.fromJSON).toHaveBeenCalledTimes(2);
      expect(result.fields[0]).toBeDefined();
      expect(result.fields[1]).toBeDefined();
    });
  });
});
