import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {XmppDataForm, XmppDataFormField, XmppDataFormFieldType} from '../core/models/FormModels';
import {TopicDetailsComponent} from './topic-details.component';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TopicWidgetsModule} from '../topic-widgets/topic-widgets.module';
import {TopicDetailsService} from './topic-details.service';
import {DebugElement} from '@angular/core';
import {NavigationService} from '../core/navigation.service';
import {By} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';

const FORM_TYPE = new XmppDataFormField(
  XmppDataFormFieldType.hidden,
  'FORM_TYPE',
  'http://jabber.org/protocol/pubsub#node_config'
);

const TEST_FIELD_TEXT_SINGLE = new XmppDataFormField(
  XmppDataFormFieldType.textSingle,
  'pubsub#title',
  null
);

const TEST_FIELD_BOOLEAN = new XmppDataFormField(
  XmppDataFormFieldType.boolean,
  'pubsub#deliver_notifications',
  true,
  'Whether to deliver event notifications'
);

class MockTopicDetailsService {
  // noinspection JSUnusedGlobalSymbols, JSMethodCanBeStatic
  loadForm(): Promise<XmppDataForm> {
    return Promise.resolve(new XmppDataForm([
      FORM_TYPE,
      TEST_FIELD_TEXT_SINGLE,
      TEST_FIELD_BOOLEAN
    ]));
  }

  // noinspection JSMethodCanBeStatic, JSMethodCanBeStatic
  updateTopic(identifier, form): Promise<XmppDataForm> {
    return Promise.resolve(form);
  }
}

describe('TopicDetailsComponent', () => {

  let component: TopicDetailsComponent;
  let fixture: ComponentFixture<TopicDetailsComponent>;
  let de: DebugElement;
  let mockService: MockTopicDetailsService;

  beforeEach(fakeAsync(() => {
      mockService = new MockTopicDetailsService();

      TestBed.configureTestingModule({
        imports: [SharedModule, FormsModule, ReactiveFormsModule, TopicWidgetsModule],
        declarations: [TopicDetailsComponent],
        providers: [{provide: TopicDetailsService, useValue: mockService},
          {provide: NavigationService, useValue: jasmine.createSpyObj('NavigationService', ['goToHome'])},
          {provide: ActivatedRoute, useValue: {snapshot: {params: {id: 'testing'}}}}]
      });

      fixture = TestBed.createComponent(TopicDetailsComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;

      fixture.detectChanges();
    }
  ));

  describe('given some advanced fields', () => {

    let submitButton: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
      const fn = () => {
        submitButton = de.query(By.css('button[type="submit"][primary]')).nativeElement;

        // show advanced collapsible
        de.query(By.css('xgb-collapsible')).componentInstance.isVisible = true;

        fixture.detectChanges();
      };

      fixture.whenStable().then(() => {
        fixture.whenRenderingDone().then(fn);
      });

    }));

    it('advanced form entries are not included if nothing has changed', () => {
      const serviceSpy = spyOn(mockService, 'updateTopic').and.callThrough();

      submitButton.click();
      fixture.detectChanges();

      expect(serviceSpy.calls.count()).toBe(1);
      const args = serviceSpy.calls.argsFor(0);
      const form = args[1];

      expect(args[0]).toBe('testing');
      expect(form.fields.length).toBe(1);
      expect(form.fields[0].name).toBe(FORM_TYPE.name);
      expect(form.fields[0].value).toBe(FORM_TYPE.value);
    });

    it('should emmit the changed fields and values', (() => {
      const serviceSpy = spyOn(mockService, 'updateTopic').and.callThrough();

      const notificationCheckbox = de.nativeElement.querySelector('#deliver_notifications');
      notificationCheckbox['checked'] = false;
      notificationCheckbox.dispatchEvent(new Event('change'));

      submitButton.click();
      fixture.detectChanges();

      expect(serviceSpy.calls.count()).toBe(1);
      const args = serviceSpy.calls.argsFor(0);
      const form = args[1];

      expect(args[0]).toBe('testing');
      expect(form.fields.length).toBe(2);
      expect(form.fields[0].name).toBe(FORM_TYPE.name);
      expect(form.fields[0].value).toBe(FORM_TYPE.value);
      expect(form.fields[1].name).toBe('pubsub#deliver_notifications');
      expect(form.fields[1].value).toBe(false);


    }));
  });

});
