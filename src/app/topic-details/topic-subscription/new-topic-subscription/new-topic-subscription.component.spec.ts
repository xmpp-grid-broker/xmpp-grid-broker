import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ActivatedRoute} from '@angular/router';
import {TopicSubscriptionService} from '../topic-subscription.service';
import {SharedModule} from '../../../shared/shared.module';
import {NewTopicSubscriptionComponent} from './new-topic-subscription.component';
import {FormsModule} from '@angular/forms';
import {NavigationService} from '../../../core/navigation.service';
import {XmppError, XmppErrorCondition} from '../../../core/errors';

describe('NewTopicSubscriptionComponent', () => {
  let component: NewTopicSubscriptionComponent;
  let fixture: ComponentFixture<NewTopicSubscriptionComponent>;
  let el: HTMLElement;
  let service: jasmine.SpyObj<TopicSubscriptionService>;
  let navigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async(() => {
    service = jasmine.createSpyObj('TopicSubscriptionService', ['subscribe']);
    navigationService = jasmine.createSpyObj('NavigationService', ['goToSubscriptions']);
    TestBed.configureTestingModule({
      declarations: [NewTopicSubscriptionComponent],
      imports: [FormsModule, SharedModule],
      providers: [
        {provide: TopicSubscriptionService, useValue: service},
        {provide: NavigationService, useValue: navigationService},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: 'testing'}}}}
      ]
    });
  }));

  let inputField: HTMLInputElement;
  let submitButton: HTMLButtonElement;

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(NewTopicSubscriptionComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;

    // ngOnInit
    fixture.detectChanges();
    tick();

    // trigger initial validation
    fixture.detectChanges();
    tick();

    inputField = el.querySelector('#jid') as HTMLInputElement;
    submitButton = el.querySelector('button[primary]') as HTMLButtonElement;

  }));


  it('should render topic name in title', fakeAsync(() => {
    expect(el.querySelector('h2').innerHTML).toBe('New Subscription for testing');
  }));

  fit('should render input filed', fakeAsync(() => {
    expect(inputField).toBeDefined();
    expect(inputField.placeholder).toBe('Enter Subscription JID');
  }));


  fit('should render disabled submit button', fakeAsync(() => {
    expect(submitButton).toBeDefined();
    expect(submitButton.disabled).toBeTruthy();
  }));

  describe('given some input values', () => {
    beforeEach(fakeAsync(() => {
      inputField.value = 'eva@exampe.com';
      inputField.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick();
    }));

    fit('the submit button shoud be enabled', fakeAsync(() => {
      expect(submitButton.disabled).toBeFalsy();
    }));

    fit('should disable the form while submitting the form', fakeAsync(() => {
      service.subscribe.and.returnValue(Promise.resolve());
      submitButton.click();

      fixture.detectChanges();
      tick();

      expect(submitButton.disabled).toBeTruthy();
      expect(inputField.disabled).toBeTruthy();
    }));

    fit('should render error message when subscription fails', fakeAsync(() => {
      service.subscribe.and.returnValue(Promise.reject(new XmppError('timeout', XmppErrorCondition.Timeout)));
      submitButton.click();

      // submit
      fixture.detectChanges();
      tick();
      // get result
      fixture.detectChanges();
      tick();

      expect(el.querySelector('[toast-error]').innerHTML).toBe('timeout');
      expect(submitButton.disabled).toBeFalsy();
      expect(inputField.disabled).toBeFalsy();
    }));

    fit('should render redirect when subscription succeeds', fakeAsync(() => {
      service.subscribe.and.returnValue(Promise.resolve());
      submitButton.click();

      // submit
      fixture.detectChanges();
      tick();
      // get result
      fixture.detectChanges();
      tick();

      expect(navigationService.goToSubscriptions).toHaveBeenCalledTimes(1);
      expect(navigationService.goToSubscriptions).toHaveBeenCalledWith('testing');
    }));

  });


});
