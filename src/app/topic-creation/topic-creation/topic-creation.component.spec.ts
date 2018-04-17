import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ListOption, XmppDataForm, XmppDataFormField, XmppDataFormFieldType} from '../../core/models/FormModels';
import {SharedModule} from '../../shared/shared.module';
import {By} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TopicWidgetsModule} from '../../topic-widgets/topic-widgets.module';
import {TopicCreationComponent} from './topic-creation.component';
import {TopicCreationService} from '../topic-creation.service';
import {Topic} from '../../core/models/topic';
import {NavigationService} from '../../core/navigation.service';

const TEST_FIELD_TEXT_SINGLE = new XmppDataFormField(
  XmppDataFormFieldType.textSingle,
  'pubsub#title',
  'Princely Musings (Atom)',
  'A friendly name for the node'
);

const TEST_FIELD_BOOLEAN = new XmppDataFormField(
  XmppDataFormFieldType.boolean,
  'pubsub#deliver_notifications',
  true,
  'Whether to deliver event notifications'
);

class MockTopicCreationService {
  // noinspection JSMethodCanBeStatic
  // noinspection JSUnusedGlobalSymbols
  loadForm(): Promise<XmppDataForm> {
    return Promise.resolve(new XmppDataForm([
      TEST_FIELD_BOOLEAN,
      TEST_FIELD_TEXT_SINGLE,
    ]));
  }

  // noinspection JSMethodCanBeStatic
  // noinspection JSUnusedGlobalSymbols
  createTopic(form: XmppDataForm): Promise<Topic> {
    return Promise.resolve(new Topic(null));
  }
}

describe('TopicCreationComponent', () => {

  let component: TopicCreationComponent;
  let fixture: ComponentFixture<TopicCreationComponent>;
  let de: HTMLElement;
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
      de = fixture.debugElement.nativeElement;

      component.ngOnInit();
      tick();
      fixture.detectChanges();
    }
  ));

  describe('given some advanced fields', () => {

    let submitButton: HTMLElement;

    beforeEach(() => {
      submitButton = fixture.debugElement.query(By.css('button[type="submit"][primary]')).nativeElement;

      // show advanced collapsible
      fixture.debugElement.query(By.css('xgb-collapsible')).componentInstance.isVisible = true;

      fixture.detectChanges();
    });

    it('should emmit an empty form if nothing has changed', (() => {
      const createTopicSpy = spyOn(mockService, 'createTopic').and.callThrough();

      submitButton.click();
      fixture.detectChanges();

      expect(createTopicSpy.calls.count()).toBe(1);
      const form = createTopicSpy.calls.argsFor(0)[0];
      expect(form.fields.length).toBe(0);
    }));

    it('should emmit the changed fields and values', (() => {
      const createTopicSpy = spyOn(mockService, 'createTopic').and.callThrough();

      const titleInput = de.querySelector('#title');
      titleInput['value'] = 'Foo baa';
      titleInput.dispatchEvent(new Event('input'));

      const notificationCheckbox = de.querySelector('#deliver_notifications');
      notificationCheckbox['checked'] = false;
      notificationCheckbox.dispatchEvent(new Event('change'));

      submitButton.click();
      fixture.detectChanges();

      expect(createTopicSpy.calls.count()).toBe(1);
      const form = createTopicSpy.calls.argsFor(0)[0];
      expect(form.fields[0].variable).toBe('pubsub#deliver_notifications');
      expect(form.fields[0].value).toBe(false);
      expect(form.fields.length).toBe(2);
      expect(form.fields[1].variable).toBe('pubsub#title');
      expect(form.fields[1].value).toBe('Foo baa');

    }));
  });

});
