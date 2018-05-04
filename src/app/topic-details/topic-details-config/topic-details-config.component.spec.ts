import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {XmppDataForm, XmppDataFormField, XmppDataFormFieldType} from '../../core/models/FormModels';
import {TopicDetailsConfigComponent} from './topic-details-config.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TopicWidgetsModule} from '../../topic-widgets/topic-widgets.module';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {ToastDirective} from '../../shared/toast.directive';
import {LoadConfigurationFormErrorCodes, TopicDeletionErrorCodes, TopicDetailsService} from '../topic-details.service';
import {NavigationService} from '../../core/navigation.service';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import {NotificationService} from '../../core/notifications/notification.service';

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
  loadConfigurationForm(): Promise<XmppDataForm> {
    return Promise.resolve(new XmppDataForm([
      FORM_TYPE,
      TEST_FIELD_TEXT_SINGLE,
      TEST_FIELD_BOOLEAN
    ]));
  }

  // noinspection JSMethodCanBeStatic, JSMethodCanBeStatic
  updateTopicConfiguration(identifier, form): Promise<XmppDataForm> {
    return this.loadConfigurationForm();
  }

  deleteTopic(topicIdentifier: string): Promise<void> {
    return Promise.resolve();
  }
}

describe('TopicDetailsConfigComponent', () => {

  let component: TopicDetailsConfigComponent;
  let fixture: ComponentFixture<TopicDetailsConfigComponent>;
  let de: DebugElement;
  let mockService: MockTopicDetailsService;
  let submitButton: HTMLElement;
  let navigationService: SpyObj<NavigationService>;
  let notificationService: SpyObj<NotificationService>;

  beforeEach(fakeAsync(() => {
      mockService = new MockTopicDetailsService();
      navigationService = createSpyObj('NavigationService', ['goToHome']);
      notificationService = createSpyObj('NotificationService', ['confirm']);
      TestBed.configureTestingModule({
        imports: [SharedModule, FormsModule, ReactiveFormsModule, TopicWidgetsModule],
        declarations: [TopicDetailsConfigComponent],
        providers: [{provide: TopicDetailsService, useValue: mockService},
          {provide: ActivatedRoute, useValue: {parent: {snapshot: {params: {id: 'testing'}}}}},
          {provide: NavigationService, useValue: navigationService},
          {provide: NotificationService, useValue: notificationService}
        ]
      });

      fixture = TestBed.createComponent(TopicDetailsConfigComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;

    }
  ));

  const waitUntilLoaded = () => {
    // Render for the first time, the spinner will be shown
    fixture.detectChanges();
    tick();

    expect(de.query(By.css('xgb-spinner')).nativeElement).toBeDefined();

    // The loading is done, get rid of the spinner...
    fixture.detectChanges();
    tick();

    const deBtn = de.query(By.css('button[type="submit"][primary]'));
    submitButton = (deBtn) ? deBtn.nativeElement : undefined;
  };

  [
    {condition: LoadConfigurationFormErrorCodes.ItemNotFound, message: 'Node with NodeID testing does not exist!'},
    {condition: LoadConfigurationFormErrorCodes.Unsupported, message: 'Node configuration is not supported by the XMPP server'},
    {condition: LoadConfigurationFormErrorCodes.Forbidden, message: 'Insufficient Privileges to configure node testing'},
    {condition: LoadConfigurationFormErrorCodes.NotAllowed, message: 'There are no configuration options available'},
    {condition: 'other', message: 'An unknown error occurred: other!'},
  ].forEach(({condition, message}) => {
    it('should show an error message when loading the for fails', fakeAsync(() => {
      spyOn(mockService, 'loadConfigurationForm').and.callFake(() => {
        return Promise.reject({condition});
      });
      waitUntilLoaded();
      const notificationDivs = de.queryAll(By.directive(ToastDirective));
      expect(notificationDivs.length).toBe(1);
      expect(notificationDivs[0].nativeElement.innerText).toBe(
        message
      );
      expect(notificationDivs[0].attributes['toast-error']).toBeDefined();
      expect(submitButton).toBeUndefined();
    }));
  });

  describe('given some advanced fields', () => {


    beforeEach(fakeAsync(() => {
      waitUntilLoaded();

      // show advanced collapsible
      de.query(By.css('xgb-collapsible')).componentInstance.isVisible = true;

      // Re-Render
      fixture.detectChanges();
      tick();
    }));

    it('advanced form entries are not included if nothing has changed', () => {
      const serviceSpy = spyOn(mockService, 'updateTopicConfiguration').and.callThrough();

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
      const serviceSpy = spyOn(mockService, 'updateTopicConfiguration').and.callThrough();

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

  describe('concerning the danger zone', () => {

    let collapsible;
    let deleteTopicButton;

    beforeEach(fakeAsync(() => {
      waitUntilLoaded();

      collapsible = de.query(By.css('xgb-collapsible[title="Danger Zone"]'));
      deleteTopicButton = collapsible.query(By.css('button'));
    }));

    it('should render the danger zone as collapsible', fakeAsync(() => {
      expect(collapsible).toBeTruthy();
    }));

    it('should render the delete button', fakeAsync(() => {
      expect(deleteTopicButton).toBeTruthy();
      expect(deleteTopicButton.nativeElement.innerHTML).toBe('Delete Topic testing');
    }));

    it('should show a confirm dialog when clicking delete', fakeAsync(() => {
      notificationService.confirm.and.returnValue(Promise.resolve(true));
      const serviceCallSpy = spyOn(mockService, 'deleteTopic').and.callThrough();

      deleteTopicButton.nativeElement.click();
      fixture.detectChanges();
      tick();

      expect(notificationService.confirm).toHaveBeenCalledTimes(1);
    }));
    it('should not call the service and not redirect when delete was not confirmed', fakeAsync(() => {
      notificationService.confirm.and.returnValue(Promise.resolve(false));
      const serviceCallSpy = spyOn(mockService, 'deleteTopic').and.callThrough();

      deleteTopicButton.nativeElement.click();
      fixture.detectChanges();
      tick();

      expect(serviceCallSpy).toHaveBeenCalledTimes(0);
      expect(navigationService.goToHome).toHaveBeenCalledTimes(0);
    }));


    it('should call the service and redirect when clicking delete', fakeAsync(() => {
      notificationService.confirm.and.returnValue(Promise.resolve(true));
      const serviceCallSpy = spyOn(mockService, 'deleteTopic').and.callThrough();

      deleteTopicButton.nativeElement.click();
      fixture.detectChanges();
      tick();

      expect(serviceCallSpy).toHaveBeenCalledTimes(1);
      expect(serviceCallSpy.calls.mostRecent().args[0]).toBe('testing');
      expect(navigationService.goToHome).toHaveBeenCalledTimes(1);
    }));

    it('should not redirect when the delete service method fails', fakeAsync(() => {
      notificationService.confirm.and.returnValue(Promise.resolve(true));
      const serviceCallSpy = spyOn(mockService, 'deleteTopic')
        .and.returnValue(Promise.reject({condition: TopicDeletionErrorCodes.Forbidden}));

      deleteTopicButton.nativeElement.click();
      fixture.detectChanges();
      tick();

      expect(serviceCallSpy).toHaveBeenCalledTimes(1);
      expect(serviceCallSpy.calls.mostRecent().args[0]).toBe('testing');
      expect(navigationService.goToHome).toHaveBeenCalledTimes(0);
    }));

    [
      {condition: TopicDeletionErrorCodes.NotAllowed, message: 'You are not allowed to delete the root node testing!'},
      {condition: TopicDeletionErrorCodes.Forbidden, message: 'Insufficient Privileges to delete node testing'},
      {condition: TopicDeletionErrorCodes.ItemNotFound, message: 'Node with NodeID testing does not exist!'},
      {condition: 'other', message: 'An unknown error occurred: other!'},
    ].forEach(({condition, message}) => {
      it(`should render an error message when the delete service method fails (${condition})`, fakeAsync(() => {
        notificationService.confirm.and.returnValue(Promise.resolve(true));
        const serviceCallSpy = spyOn(mockService, 'deleteTopic')
          .and.returnValue(Promise.reject({condition}));

        deleteTopicButton.nativeElement.click();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        const notificationDivs = de.queryAll(By.directive(ToastDirective));
        expect(notificationDivs.length).toBe(1);
        expect(notificationDivs[0].attributes['toast-error']).toBeDefined();
        expect(notificationDivs[0].nativeElement.innerText).toBe(message);
      }));
    });

  });

  describe('given a changed title', () => {

    beforeEach(fakeAsync(() => {
      waitUntilLoaded();

      const inputField = de.query(By.css('#title')).nativeElement;
      inputField.value = 'ChangedTitle';
      inputField.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }));


    it('should show a message after success update', fakeAsync(() => {
      const serviceSpy = spyOn(mockService, 'updateTopicConfiguration').and.callThrough();

      submitButton.click();

      // Hello Spinner
      fixture.detectChanges();
      tick();

      // Is spinner rendered?
      expect(de.query(By.css('xgb-spinner')).nativeElement).toBeDefined();

      // Good bye spinner...
      fixture.detectChanges();
      tick();

      const notificationDivs = de.queryAll(By.directive(ToastDirective));
      expect(notificationDivs.length).toBe(1);
      expect(notificationDivs[0].nativeElement.innerText).toBe('Form successfully updated!');
      expect(notificationDivs[0].attributes['toast-success']).toBeDefined();

    }));

    it('should show a message on error when submission fails', fakeAsync(() => {
      const serviceSpy = spyOn(mockService, 'updateTopicConfiguration').and.callFake(() => Promise.reject({
        condition: 'not-acceptable'
      }));

      submitButton.click();

      // Hello Spinner
      fixture.detectChanges();
      tick();

      // Is spinner rendered?
      expect(de.query(By.css('xgb-spinner')).nativeElement).toBeDefined();

      // Good bye spinner...
      fixture.detectChanges();
      tick();

      const notificationDivs = de.queryAll(By.directive(ToastDirective));
      expect(notificationDivs.length).toBe(1);
      expect(notificationDivs[0].nativeElement.innerText).toBe(
        'Failed to update the configuration (Server responded with: not-acceptable)'
      );
      expect(notificationDivs[0].attributes['toast-error']).toBeDefined();
    }));

  });

});
