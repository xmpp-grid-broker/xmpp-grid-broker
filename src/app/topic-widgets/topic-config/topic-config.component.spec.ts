import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TopicConfigComponent} from './topic-config.component';
import {XmppDataForm, XmppDataFormFieldType, XmppDataValueFormField} from '../../core/models/FormModels';
import {SharedModule} from '../../shared/shared.module';


describe('TopicConfigComponent', () => {

  let component: TopicConfigComponent;
  let fixture: ComponentFixture<TopicConfigComponent>;
  let de: HTMLElement;

  beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        declarations: [TopicConfigComponent],
      });

      fixture = TestBed.createComponent(TopicConfigComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement.nativeElement;
    }
  );
  // TODO: shallow tests: ensure the form-field components are filled up properly and only verify "specific" parts.

  describe('given a hidden field', () => {

    beforeEach(() => {
      component.form = new XmppDataForm([
        new XmppDataValueFormField(
          XmppDataFormFieldType.hidden,
          'FORM_TYPE',
          'http://jabber.org/protocol/pubsub#node_config'
        ),
      ]);
      fixture.detectChanges();
    });

    it('should not render it', (() => {
      expect(de.querySelector('form').childElementCount).toBe(0);
    }));

  });

  describe('given a text-single field', () => {
    const TEST_FIELD = new XmppDataValueFormField(
      XmppDataFormFieldType.textSingle,
      'pubsub#title',
      'Princely Musings (Atom)',
      'A friendly name for the node'
    );

    beforeEach(() => {
      component.form = new XmppDataForm([
        TEST_FIELD
      ]);
      fixture.detectChanges();
    });
    it('should render it', (() => {
      expect(de.querySelector('form').childElementCount).toBe(1);
    }));

    it('should render variable name as field label', (() => {
      expect(de.querySelector('.form-label').innerHTML).toBe('title');
    }));

    it('should render variable name in placeholder', (() => {
      expect(de.querySelector('#title')
        .getAttribute('placeholder'))
        .toBe(`Enter title`);
    }));

    it('should render the label in the popover box', (() => {
      expect(de.querySelector('.popover-container .card-body').textContent)
        .toBe(TEST_FIELD.label);
    }));
  });

  describe('given a text-multi field', () => {
    const TEST_FIELD = new XmppDataValueFormField(
      XmppDataFormFieldType.textMulti,
      'pubsub#children',
      '',
      'The child nodes (leaf or collection) associated with a collection'
    );

    beforeEach(() => {
      component.form = new XmppDataForm([
        TEST_FIELD
      ]);
      fixture.detectChanges();
    });
    it('should render it', (() => {
      expect(de.querySelector('form').childElementCount).toBe(1);
    }));

    it('should render variable name as field label', (() => {
      expect(de.querySelector('.form-label').innerHTML).toBe('children');
    }));

    it('should render variable name in placeholder', (() => {
      expect(de.querySelector('textarea#children')
        .getAttribute('placeholder'))
        .toBe(`List children`);
    }));

    it('should render the label in the popover box', (() => {
      expect(de.querySelector('.popover-container .card-body').textContent)
        .toBe(TEST_FIELD.label);
    }));
  });


  describe('given a boolean field', () => {
    const TEST_FIELD = new XmppDataValueFormField(
      XmppDataFormFieldType.boolean,
      'pubsub#deliver_notifications',
      'true',
      'Whether to deliver event notifications'
    );

    beforeEach(() => {
      component.form = new XmppDataForm([
        TEST_FIELD
      ]);
      fixture.detectChanges();
    });
    it('should render it', (() => {
      expect(de.querySelector('form').childElementCount).toBe(1);
    }));

    it('should render variable name as field label', (() => {
      expect(de.querySelector('.form-switch').textContent.trim())
        .toBe('deliver_notifications');
    }));

    it('should render the label in the popover box', (() => {
      expect(de.querySelector('.popover-container .card-body').textContent)
        .toBe(TEST_FIELD.label);
    }));
  });


});
