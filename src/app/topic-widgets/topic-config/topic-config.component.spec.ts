import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TopicConfigComponent} from './topic-config.component';
import {ListOption, XmppDataForm, XmppDataFormField, XmppDataFormFieldType} from '../../core/models/FormModels';
import {SharedModule} from '../../shared/shared.module';
import {By} from '@angular/platform-browser';
import {FormFieldComponent} from '../../shared/form/form-field.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FormFieldNamePipe} from './form-field-name.pipe';

const TEST_FIELD_TEXT_SINGLE = new XmppDataFormField(
  XmppDataFormFieldType.textSingle,
  'pubsub#title',
  'Princely Musings (Atom)',
  'A friendly name for the node'
);
const TEST_FIELD_TEXT_MULTI = new XmppDataFormField(
  XmppDataFormFieldType.textMulti,
  'pubsub#children',
  '',
  'The child nodes (leaf or collection) associated with a collection'
);
const TEST_FIELD_BOOLEAN = new XmppDataFormField(
  XmppDataFormFieldType.boolean,
  'pubsub#deliver_notifications',
  true,
  'Whether to deliver event notifications'
);
const TEST_FIELD_LIST_SINGLE = new XmppDataFormField(
  XmppDataFormFieldType.listSingle,
  'pubsub#access_model',
  null,
  'Specify the subscriber model',
  [
    new ListOption('authorize', 'Subscription requests must be approved and only subscribers may retrieve items'),
    new ListOption('open', 'Anyone may subscribe and retrieve items'),
    new ListOption('presence', 'Anyone with a presence subscription of both or from may subscribe and retrieve items'),
    new ListOption('roster', 'Anyone in the specified roster group(s) may subscribe and retrieve items'),
    new ListOption('whitelist', 'Only those on a whitelist may subscribe and retrieve items'),
  ],
);
const TEST_FIELD_LIST_MULTI = new XmppDataFormField(
  XmppDataFormFieldType.listMulti,
  'pubsub#show-values',
  null,
  'The presence states for which an entity wants to receive notifications',
  [
    new ListOption('away', 'XMPP Show Value of Away'),
    new ListOption('chat', 'XMPP Show Value of Chat'),
    new ListOption('dnd', 'XMPP Show Value of DND (Do Not Disturb)'),
    new ListOption('online', 'Mere Availability in XMPP (No Show Value)'),
    new ListOption('xa', 'XMPP Show Value of XA (Extended Away)'),
  ]
);

describe('TopicConfigComponent', () => {

  let component: TopicConfigComponent;
  let fixture: ComponentFixture<TopicConfigComponent>;
  let de: HTMLElement;
  let formFieldComponent: FormFieldComponent;

  beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule, ReactiveFormsModule],
        declarations: [FormFieldNamePipe, TopicConfigComponent],
      });

      fixture = TestBed.createComponent(TopicConfigComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement.nativeElement;
    }
  );

  describe('given a hidden field', () => {
    beforeEach(() => {
      component.form = new XmppDataForm([
        new XmppDataFormField(
          XmppDataFormFieldType.hidden,
          'FORM_TYPE',
          'http://jabber.org/protocol/pubsub#node_config'
        ),
      ]);
      fixture.detectChanges();
    });

    it('should not render it', (() => {
      expect(de.querySelector('form').childElementCount).toBe(1); // the submit Button
    }));

  });

  describe('given a text-single field', () => {
    beforeEach(() => {
      component.form = new XmppDataForm([
        TEST_FIELD_TEXT_SINGLE
      ]);
      fixture.detectChanges();
      formFieldComponent = fixture.debugElement.query(By.css('xgb-form-field')).componentInstance;
    });

    it('should render it', (() => {
      expect(de.querySelector('form').childElementCount).toBe(2); // The field + the submit Button
    }));

    it('should render variable name as field label', (() => {
      expect(formFieldComponent.fieldLabel).toBe('title');
    }));

    it('should render variable name in placeholder', (() => {
      expect(de.querySelector('#title')
        .getAttribute('placeholder'))
        .toBe(`Enter title`);
    }));

    it('should render the label as help message', (() => {
      expect(formFieldComponent.fieldHelp).toBe('A friendly name for the node');
    }));

    it('should update the form binding when changed', (() => {
      const input = de.querySelector('input');
      input.value = 'Foo baa';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      const formControl = component.configForm.get('pubsub#title');
      expect(formControl.value).toBe('Foo baa');
    }));
  });

  describe('given a text-multi field', () => {
    beforeEach(() => {
      component.form = new XmppDataForm([
        TEST_FIELD_TEXT_MULTI
      ]);
      fixture.detectChanges();
      formFieldComponent = fixture.debugElement.query(By.css('xgb-form-field')).componentInstance;
    });

    it('should render it', (() => {
      expect(de.querySelector('form').childElementCount).toBe(2); // The field + the submit Button
    }));

    it('should render variable name as field label', (() => {
      expect(formFieldComponent.fieldLabel).toBe('children');
    }));

    it('should render variable name in placeholder', (() => {
      expect(de.querySelector('textarea#children')
        .getAttribute('placeholder'))
        .toBe(`List children`);
    }));

    it('should render the label as help message', (() => {
      expect(formFieldComponent.fieldHelp).toBe('The child nodes (leaf or collection) associated with a collection');
    }));

    it('should update the form binding when changed', (() => {
      const input = de.querySelector('textarea');
      input.value = 'Foo\nbaa';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      const formControl = component.configForm.get('pubsub#children');
      expect(formControl.value).toBe('Foo\nbaa');
    }));

  });


  describe('given a boolean field', () => {
    beforeEach(() => {
      component.form = new XmppDataForm([
        TEST_FIELD_BOOLEAN
      ]);
      fixture.detectChanges();
      formFieldComponent = fixture.debugElement.query(By.css('xgb-form-field')).componentInstance;
    });

    it('should render it', (() => {
      expect(de.querySelector('form').childElementCount).toBe(2); // The field + the submit Button
    }));

    it('should render variable name as field label', (() => {
      expect(de.querySelector('.form-switch').textContent.trim())
        .toBe('deliver_notifications');
    }));

    it('should render the label as help message', (() => {
      expect(formFieldComponent.fieldHelp).toBe('Whether to deliver event notifications');
    }));

    it('should update the form binding when changed', (() => {
      const formControl = component.configForm.get('pubsub#deliver_notifications');
      expect(formControl.value).toBeTruthy();

      const input = de.querySelector('input');
      input.checked = false;
      input.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(formControl.value).toBeFalsy();
    }));
  });

  describe('given a list-single field', () => {
    beforeEach(() => {
      component.form = new XmppDataForm([
        TEST_FIELD_LIST_SINGLE
      ]);
      fixture.detectChanges();
      formFieldComponent = fixture.debugElement.query(By.css('xgb-form-field')).componentInstance;
    });

    it('should render it', (() => {
      expect(de.querySelector('form').childElementCount).toBe(2); // The field + the submit Button
    }));

    it('should render variable name as field label', (() => {
      expect(formFieldComponent.fieldLabel).toBe('access_model');
    }));

    it('should use the variable name as field id', (() => {
      expect(de.querySelector('select').getAttribute('id')).toBe('access_model');
      expect(formFieldComponent.fieldId).toBe('access_model');
    }));

    it('should render options in a select field', (() => {
      expect(de.querySelector('select').querySelectorAll('option').length)
        .toBe(6); // 5 + "empty"
      expect(de.querySelector('select').querySelectorAll('option')[2].textContent)
        .toBe('open');
    }));

    it('should render the label plus all option labels as help message', (() => {
      const dl = de.querySelector('[xgbFieldHelp] dl');

      expect(formFieldComponent.fieldHelp).toBe(TEST_FIELD_LIST_SINGLE.label);
      expect(dl.childElementCount).toBe(10);
      expect(dl.firstElementChild.innerHTML).toBe('authorize');
      expect(dl.lastElementChild.innerHTML).toBe('Only those on a whitelist may subscribe and retrieve items');
    }));

    it('should update the form binding when changed', (() => {
      const selectBox = de.querySelector('select');
      selectBox.querySelectorAll('option')[5].selected = true;
      selectBox.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      const valueInForm = component.configForm.get('pubsub#access_model').value;
      expect(valueInForm).toBe('whitelist');
    }));

    it('should update the form binding to null when first element is selected', (() => {
      const selectBox = de.querySelector('select');

      selectBox.querySelectorAll('option')[1].selected = true;
      selectBox.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(component.configForm.get('pubsub#access_model').value).toBe('authorize');
      selectBox.querySelectorAll('option')[0].selected = true;
      selectBox.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(component.configForm.get('pubsub#access_model').value).toBe('null');
    }));
  });

  describe('given a list-multi field', () => {
    beforeEach(() => {
      component.form = new XmppDataForm([
        TEST_FIELD_LIST_MULTI
      ]);
      fixture.detectChanges();
      formFieldComponent = fixture.debugElement.query(By.css('xgb-form-field')).componentInstance;
    });

    it('should render it', (() => {
      expect(de.querySelector('form').childElementCount).toBe(2); // The field + the submit Button
    }));

    it('should render variable name as field label', (() => {
      expect(formFieldComponent.fieldLabel).toBe('show-values');
    }));

    it('should use the variable name as field id', (() => {
      expect(de.querySelector('select').getAttribute('id')).toBe('show-values');
      expect(formFieldComponent.fieldId).toBe('show-values');
    }));

    it('should render options in a select field', (() => {
      expect(de.querySelector('select').querySelectorAll('option').length)
        .toBe(5);
      expect(de.querySelector('select').querySelectorAll('option')[1].textContent)
        .toBe('chat');
    }));

    it('should render the label plus all option labels as help message', (() => {
      const dl = de.querySelector('[xgbFieldHelp] dl');

      expect(formFieldComponent.fieldHelp).toBe(TEST_FIELD_LIST_MULTI.label);
      expect(dl.childElementCount).toBe(10);
      expect(dl.firstElementChild.innerHTML).toBe('away');
      expect(dl.lastElementChild.innerHTML).toBe('XMPP Show Value of XA (Extended Away)');
    }));

    it('should update the form binding when changed', (() => {
      const selectBox = de.querySelector('select');
      selectBox.querySelectorAll('option')[1].selected = true;
      selectBox.querySelectorAll('option')[2].selected = true;
      selectBox.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      const valueInForm = component.configForm.get('pubsub#show-values').value;
      expect(valueInForm).toContain('chat');
      expect(valueInForm).toContain('dnd');
      expect(valueInForm.length).toBe(2);
    }));
  });

  describe('given a three fields', () => {

    let submitButton: HTMLElement;

    beforeEach(() => {
      component.form = new XmppDataForm([
        TEST_FIELD_BOOLEAN,
        TEST_FIELD_TEXT_SINGLE,
        TEST_FIELD_TEXT_MULTI,
        TEST_FIELD_LIST_SINGLE,
        TEST_FIELD_LIST_MULTI
      ]);
      fixture.detectChanges();
      submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    });

    it('should emmit an empty form if nothing has changed', ((done) => {
      component.formSubmitted.subscribe((form: XmppDataForm) => {
        expect(form.fields.length).toBe(0);
        done();
      });

      submitButton.click();
      fixture.detectChanges();
    }));

    it('should emmit the changed fields and values', ((done) => {
      component.formSubmitted.subscribe((form: XmppDataForm) => {
        expect(form.fields[0].variable).toBe('pubsub#deliver_notifications');
        expect(form.fields[0].value).toBe(false);

        expect(form.fields.length).toBe(2);
        expect(form.fields[1].variable).toBe('pubsub#title');
        expect(form.fields[1].value).toBe('Foo baa');

        done();
      });

      const titleInput = de.querySelector('#title');
      titleInput['value'] = 'Foo baa';
      titleInput.dispatchEvent(new Event('input'));

      const notificationCheckbox = de.querySelector('#deliver_notifications');
      notificationCheckbox['checked'] = false;
      notificationCheckbox.dispatchEvent(new Event('change'));

      submitButton.click();
      fixture.detectChanges();
    }));
  });
});
