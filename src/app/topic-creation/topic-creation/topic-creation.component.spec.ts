import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ListOption, XmppDataForm, XmppDataFormField, XmppDataFormFieldType} from '../../core/models/FormModels';
import {SharedModule} from '../../shared/shared.module';
import {By} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TopicWidgetsModule} from '../../topic-widgets/topic-widgets.module';
import {TopicCreationComponent} from './topic-creation.component';
import {TopicCreationService} from '../topic-creation.service';
import {LeafTopic} from '../../core/models/topic';
import {NavigationService} from '../../core/navigation.service';
import {DebugElement} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

const TEST_FIELD_TEXT_SINGLE = new XmppDataFormField(
  XmppDataFormFieldType.textSingle,
  'pubsub#title',
  null
);

const REQUIRED_FILEDS = [new XmppDataFormField(
  XmppDataFormFieldType.listSingle,
  'pubsub#node_type',
  null, null,
  [
    new ListOption('node'),
    new ListOption('leaf'),
  ]
), new XmppDataFormField(
  XmppDataFormFieldType.textMulti,
  'pubsub#children',
  null),
  , new XmppDataFormField(
    XmppDataFormFieldType.textMulti,
    'pubsub#collection',
    null),
];

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
      ...REQUIRED_FILEDS,
      TEST_FIELD_TEXT_SINGLE,
      TEST_FIELD_BOOLEAN
    ]));
  }

  // noinspection JSMethodCanBeStatic, JSMethodCanBeStatic
  createTopic(): Promise<LeafTopic> {
    return Promise.resolve(new LeafTopic(null));
  }
}

class FakeActivatedRoute {

  type = undefined;

  // noinspection JSUnusedGlobalSymbols
  get snapshot() {
    return {data: {type: this.type}};
  }
}

describe('TopicCreationComponent', () => {

  let component: TopicCreationComponent;
  let fixture: ComponentFixture<TopicCreationComponent>;
  let de: DebugElement;
  let mockService: MockTopicCreationService;
  let fakeRoute;

  const waitUntilLoaded = () => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    fixture.whenStable().then(() => {
      fixture.whenRenderingDone().then(() => {
        tick();
      });
    });
  };

  beforeEach(fakeAsync(() => {
      mockService = new MockTopicCreationService();
      fakeRoute = new FakeActivatedRoute();
      TestBed.configureTestingModule({
        imports: [SharedModule, FormsModule, ReactiveFormsModule, TopicWidgetsModule],
        declarations: [TopicCreationComponent],
        providers: [{provide: TopicCreationService, useValue: mockService},
          {provide: NavigationService, useValue: jasmine.createSpyObj('NavigationService', ['goToHome'])},
          {provide: ActivatedRoute, useValue: fakeRoute}]
      });

      fixture = TestBed.createComponent(TopicCreationComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;

    }
  ));
  describe('when creating a new collection', () => {

    beforeEach(fakeAsync(() => {
      fakeRoute.type = 'collection';
      waitUntilLoaded();
    }));

    it('should render "Create New Collection" as title', function () {
      const heading = de.nativeElement.querySelector('h2');
      expect(heading.innerText).toBe('Create New Collection');
    });

    it('should render proper fieldLabel, placeholder and helpText', function () {
      const titleFormField = de.query(By.css('xgb-form-field[fieldId=title]')).componentInstance;
      const titleInput = de.query(By.css('input[id=title]')).nativeElement;

      expect(titleFormField.fieldLabel).toBe('Collection title *');
      expect(titleFormField.fieldHelp).toBe('A short name for the Collection');
      expect(titleInput.getAttribute('placeholder')).toBe('Enter Collection title');
    });

    it('should render Contained Topics collapsible', function () {
      const collapsible = de.queryAll(By.css('xgb-collapsible'))[0].componentInstance;
      expect(collapsible.title).toBe('Contained Topics');
    });


    it('should send the changed fields and values', fakeAsync(() => {
      const createTopicSpy = spyOn(mockService, 'createTopic').and.callThrough();
      const submitButton = de.query(By.css('button[type="submit"][primary]')).nativeElement;

      // fill in dummy title
      const inputField = de.query(By.css('#title')).nativeElement;
      inputField.value = 'a-node-title';
      inputField.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick();

      submitButton.click();
      fixture.detectChanges();

      expect(createTopicSpy.calls.count()).toBe(1);
      const form = createTopicSpy.calls.argsFor(0)[0];

      expect(form.fields.length).toBe(2);
      expect(form.fields[0].variable).toBe('pubsub#node_type');
      expect(form.fields[0].value).toBe('collection');
      expect(form.fields[1].variable).toBe('pubsub#title');
      expect(form.fields[1].value).toBe('a-node-title');


    }));

  });

  describe('when creating a new topic', () => {
    beforeEach(fakeAsync(() => {
      fakeRoute.type = 'leaf';
      waitUntilLoaded();
    }));


    it('should render "Create New Topic" as title', function () {
      const heading = de.nativeElement.querySelector('h2');
      expect(heading.innerText).toBe('Create New Topic');
    });

    it('should render proper fieldLabel, placeholder and helpText', function () {
      const titleFormField = de.query(By.css('xgb-form-field[fieldId=title]')).componentInstance;
      const titleInput = de.query(By.css('input[id=title]')).nativeElement;

      expect(titleFormField.fieldLabel).toBe('Topic title *');
      expect(titleFormField.fieldHelp).toBe('A short name for the Topic');
      expect(titleInput.getAttribute('placeholder')).toBe('Enter Topic title');
    });

    it('should render Parent Collections collapsible', function () {
      const collapsible = de.queryAll(By.css('xgb-collapsible'))[0].componentInstance;
      expect(collapsible.title).toBe('Parent Collections');
    });

    describe('given some advanced fields', () => {

      let submitButton: HTMLElement;

      beforeEach(fakeAsync(() => {
        submitButton = de.query(By.css('button[type="submit"][primary]')).nativeElement;

        // fill in dummy title
        const inputField = de.query(By.css('#title')).nativeElement;
        inputField.value = 'a-node-title';
        inputField.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick();

        // show advanced collapsible
        de.query(By.css('xgb-collapsible[title=Advanced]')).componentInstance.isVisible = true;

        fixture.detectChanges();
      }));

      it('advanced form entries are not included if nothing has changed', () => {
        const createTopicSpy = spyOn(mockService, 'createTopic').and.callThrough();

        submitButton.click();
        fixture.detectChanges();

        expect(createTopicSpy.calls.count()).toBe(1);
        const form = createTopicSpy.calls.argsFor(0)[0];
        expect(form.fields.length).toBe(2);
      });

      it('should send the changed fields and values', (() => {
        const createTopicSpy = spyOn(mockService, 'createTopic').and.callThrough();

        const notificationCheckbox = de.nativeElement.querySelector('#deliver_notifications');
        notificationCheckbox['checked'] = false;
        notificationCheckbox.dispatchEvent(new Event('change'));

        submitButton.click();
        fixture.detectChanges();

        expect(createTopicSpy.calls.count()).toBe(1);
        const form = createTopicSpy.calls.argsFor(0)[0];

        expect(form.fields.length).toBe(3);
        expect(form.fields[0].variable).toBe('pubsub#node_type');
        expect(form.fields[0].value).toBe('leaf');
        expect(form.fields[1].variable).toBe('pubsub#title');
        expect(form.fields[1].value).toBe('a-node-title');
        expect(form.fields[2].variable).toBe('pubsub#deliver_notifications');
        expect(form.fields[2].value).toBe(false);


      }));
    });
  });
});
