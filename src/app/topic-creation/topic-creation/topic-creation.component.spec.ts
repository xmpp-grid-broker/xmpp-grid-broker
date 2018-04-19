import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {XmppDataForm, XmppDataFormField, XmppDataFormFieldType} from '../../core/models/FormModels';
import {SharedModule} from '../../shared/shared.module';
import {By} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TopicWidgetsModule} from '../../topic-widgets/topic-widgets.module';
import {TopicCreationComponent} from './topic-creation.component';
import {TopicCreationService} from '../topic-creation.service';
import {LeafTopic} from '../../core/models/topic';
import {NavigationService} from '../../core/navigation.service';
import {DebugElement} from '@angular/core';

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

class MockTopicCreationService {
  // noinspection JSUnusedGlobalSymbols, JSMethodCanBeStatic
  loadForm(): Promise<XmppDataForm> {
    return Promise.resolve(new XmppDataForm([
      TEST_FIELD_TEXT_SINGLE,
      TEST_FIELD_BOOLEAN
    ]));
  }

  // noinspection JSMethodCanBeStatic, JSMethodCanBeStatic
  createTopic(): Promise<LeafTopic> {
    return Promise.resolve(new LeafTopic(null));
  }
}

describe('TopicCreationComponent', () => {

  let component: TopicCreationComponent;
  let fixture: ComponentFixture<TopicCreationComponent>;
  let de: DebugElement;
  let mockService: MockTopicCreationService;

  beforeEach(fakeAsync(() => {
      mockService = new MockTopicCreationService();

      TestBed.configureTestingModule({
        imports: [SharedModule, FormsModule, ReactiveFormsModule, TopicWidgetsModule],
        declarations: [TopicCreationComponent],
        providers: [{provide: TopicCreationService, useValue: mockService},
          {provide: NavigationService, useValue: jasmine.createSpyObj('NavigationService', ['goToHome'])}]
      });

      fixture = TestBed.createComponent(TopicCreationComponent);
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

        // fill in dummy title
        const inputField = de.query(By.css('#title')).nativeElement;
        inputField.value = 'a-node-title';
        inputField.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick();

        // show advanced collapsible
        de.query(By.css('xgb-collapsible')).componentInstance.isVisible = true;

        fixture.detectChanges();
      };

      fixture.whenStable().then(() => {
        fixture.whenRenderingDone().then(fn);
      });

    }));

    it('advanced form entries are not included if nothing has changed', () => {
      const createTopicSpy = spyOn(mockService, 'createTopic').and.callThrough();

      submitButton.click();
      fixture.detectChanges();

      expect(createTopicSpy.calls.count()).toBe(1);
      const form = createTopicSpy.calls.argsFor(0)[0];
      expect(form.fields.length).toBe(1);
    });

    it('should emmit the changed fields and values', (() => {
      const createTopicSpy = spyOn(mockService, 'createTopic').and.callThrough();

      const notificationCheckbox = de.nativeElement.querySelector('#deliver_notifications');
      notificationCheckbox['checked'] = false;
      notificationCheckbox.dispatchEvent(new Event('change'));

      submitButton.click();
      fixture.detectChanges();

      expect(createTopicSpy.calls.count()).toBe(1);
      const form = createTopicSpy.calls.argsFor(0)[0];

      expect(form.fields.length).toBe(2);
      expect(form.fields[0].variable).toBe('pubsub#title');
      expect(form.fields[0].value).toBe('a-node-title');
      expect(form.fields[1].variable).toBe('pubsub#deliver_notifications');
      expect(form.fields[1].value).toBe(false);


    }));
  });

});
