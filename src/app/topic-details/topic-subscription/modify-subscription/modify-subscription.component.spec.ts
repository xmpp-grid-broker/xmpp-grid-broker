import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ActivatedRoute} from '@angular/router';
import {TopicSubscriptionService} from '../topic-subscription.service';
import {SharedModule} from '../../../shared/shared.module';
import {XmppError} from '../../../core/errors';
import {NavigationService} from '../../../core/navigation.service';
import {ModifySubscriptionComponent} from './modify-subscription.component';
import {XmppDataForm, XmppDataFormField, XmppDataFormFieldType} from '../../../core/models/FormModels';
import {ReactiveFormsModule} from '@angular/forms';
import {TopicWidgetsModule} from '../../../topic-widgets/topic-widgets.module';
import {ErrorLogService} from '../../../core/errors/error-log.service';

describe('ModifySubscriptionComponent', () => {
  let component: ModifySubscriptionComponent;
  let fixture: ComponentFixture<ModifySubscriptionComponent>;
  let el: HTMLElement;
  let service: jasmine.SpyObj<TopicSubscriptionService>;
  let navigationService: jasmine.SpyObj<NavigationService>;
  let errorLogService: jasmine.SpyObj<ErrorLogService>;

  beforeEach(async(() => {
    service = jasmine.createSpyObj('TopicSubscriptionService', ['loadConfiguration', 'updateConfiguration']);
    navigationService = jasmine.createSpyObj('NavigationService', ['goToSubscriptions']);
    errorLogService = jasmine.createSpyObj('ErrorLogService', ['error']);

    TestBed.configureTestingModule({
      declarations: [ModifySubscriptionComponent],
      imports: [SharedModule, TopicWidgetsModule, ReactiveFormsModule],
      providers: [
        {provide: TopicSubscriptionService, useValue: service},
        {provide: NavigationService, useValue: navigationService},
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {params: {subId: 'testsub', jid: 'eva@example'}},
            parent: {snapshot: {params: {id: 'testing'}}}
          }
        },
        {provide: ErrorLogService, useValue: errorLogService}
      ]
    });
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(ModifySubscriptionComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;
  }));


  // Waits until the spinner is gone...
  const waitUntilLoaded = () => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  };

  it('should show spinner until loaded', fakeAsync(() => {
    service.loadConfiguration.and.returnValue(Promise.resolve(new XmppDataForm([])));

    // ngOnInit
    fixture.detectChanges();
    tick();

    expect(el.querySelector('xgb-spinner')).toBeDefined();

    // it's loaded now
    fixture.detectChanges();
    tick();

    expect(el.querySelector('xgb-spinner')).toBeDefined();

  }));

  it('should show error when loading fails', fakeAsync(() => {
    const error = new XmppError('Sth went wrong!', 'any');
    service.loadConfiguration.and.returnValue(Promise.reject(error));

    waitUntilLoaded();

    expect(el.querySelector('[toast-error]').innerHTML).toBe(error.message);
    expect(errorLogService.error).toHaveBeenCalledWith(error.message, error);
  }));

  it('should render disabled jid field', fakeAsync(() => {
    service.loadConfiguration.and.returnValue(Promise.resolve(new XmppDataForm([])));

    waitUntilLoaded();

    const jidField = el.querySelector('#jid') as HTMLInputElement;
    expect(jidField.value).toBe('eva@example');
    expect(jidField.disabled).toBeTruthy();

  }));

  it('should render disabled subid field', fakeAsync(() => {
    service.loadConfiguration.and.returnValue(Promise.resolve(new XmppDataForm([])));

    waitUntilLoaded();

    const subIdField = el.querySelector('#subId') as HTMLInputElement;
    expect(subIdField.value).toBe('testsub');
    expect(subIdField.disabled).toBeTruthy();

  }));

  it('should render generic form fields', fakeAsync(() => {
    service.loadConfiguration.and.returnValue(Promise.resolve(new XmppDataForm([
      new XmppDataFormField(XmppDataFormFieldType.boolean, 'deliver', true)
    ])));

    waitUntilLoaded();

    const genericField = el.querySelector('#deliver') as HTMLInputElement;
    expect(genericField.value).toBe('on');
    expect(genericField.disabled).toBeFalsy();

  }));

  it('should call the service on update', fakeAsync(() => {
    service.loadConfiguration.and.returnValue(Promise.resolve(new XmppDataForm([])));
    service.updateConfiguration.and.returnValue(Promise.resolve());

    waitUntilLoaded();

    const submitButton = el.querySelector('[xgbActionButton][primary]') as HTMLButtonElement;
    submitButton.click();

    fixture.detectChanges();
    tick();

    expect(service.updateConfiguration).toHaveBeenCalledTimes(1);
    expect(service.updateConfiguration).toHaveBeenCalledWith('testing', 'eva@example', 'testsub', new XmppDataForm([]));

  }));


  it('should call the redirect when update successful', fakeAsync(() => {
    service.loadConfiguration.and.returnValue(Promise.resolve(new XmppDataForm([])));
    service.updateConfiguration.and.returnValue(Promise.resolve());

    waitUntilLoaded();

    const submitButton = el.querySelector('[xgbActionButton][primary]') as HTMLButtonElement;
    submitButton.click();

    fixture.detectChanges();
    tick();

    expect(navigationService.goToSubscriptions).toHaveBeenCalledTimes(1);
    expect(navigationService.goToSubscriptions).toHaveBeenCalledWith('testing');

  }));

  it('should render an error when update was unsuccessful', fakeAsync(() => {
    const error = 'err';
    service.loadConfiguration.and.returnValue(Promise.resolve(new XmppDataForm([])));
    service.updateConfiguration.and.callFake(() => Promise.reject(error));

    waitUntilLoaded();

    const submitButton = el.querySelector('[xgbActionButton][primary]') as HTMLButtonElement;
    submitButton.click();

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    const expectedErrorMessage = 'An unknown error has occurred: "err"';
    expect(navigationService.goToSubscriptions).toHaveBeenCalledTimes(0);
    expect(el.querySelector('[toast-error]').innerHTML).toBe(expectedErrorMessage);
    expect(errorLogService.error).toHaveBeenCalledWith(expectedErrorMessage, error);
  }));
});
