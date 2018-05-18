import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TopicSubscriptionComponent} from './topic-subscription.component';
import {ActivatedRoute} from '@angular/router';
import {TopicSubscriptionService} from '../topic-subscription.service';
import {SharedModule} from '../../../shared/shared.module';
import {RouterTestingModule} from '@angular/router/testing';
import {Subscription, SubscriptionState} from '../../../core/models/Subscription';
import {XmppError} from '../../../core/errors';

describe('TopicSubscriptionComponent', () => {
  let component: TopicSubscriptionComponent;
  let fixture: ComponentFixture<TopicSubscriptionComponent>;
  let el: HTMLElement;
  let service: jasmine.SpyObj<TopicSubscriptionService>;

  beforeEach(async(() => {
    service = jasmine.createSpyObj('TopicSubscriptionService', ['loadSubscriptions']);
    TestBed.configureTestingModule({
      declarations: [TopicSubscriptionComponent],
      imports: [RouterTestingModule, SharedModule],
      providers: [
        {provide: TopicSubscriptionService, useValue: service},
        {provide: ActivatedRoute, useValue: {parent: {snapshot: {params: {id: 'testing'}}}}}
      ]
    });
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(TopicSubscriptionComponent);
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
    service.loadSubscriptions.and.returnValue(Promise.resolve([]));

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
    service.loadSubscriptions.and.returnValue(Promise.reject(new XmppError('Sth went wrong!', 'any')));

    waitUntilLoaded();

    expect(el.querySelector('[toast-error').innerHTML).toBe('Sth went wrong!');

  }));

  it('should show empty message if no subscriptions exist', fakeAsync(() => {
    service.loadSubscriptions.and.returnValue(Promise.resolve([]));

    waitUntilLoaded();

    expect(el.querySelector('.empty-title').innerHTML).toBe('No Subscriptions found');

  }));
  it('should render New Subscription when no subscriptions exist', fakeAsync(() => {
    service.loadSubscriptions.and.returnValue(Promise.resolve([]));

    waitUntilLoaded();

    expect(el.querySelector('xgb-action-bar button').innerHTML).toBe('New Subscription');

  }));

  it('should render New Subscription when subscriptions exist', fakeAsync(() => {
    service.loadSubscriptions.and.returnValue(Promise.resolve([
      new Subscription('test@example')
    ]));

    waitUntilLoaded();

    expect(el.querySelector('xgb-action-bar button').innerHTML).toBe('New Subscription');

  }));

  it('should render subscription list', fakeAsync(() => {
    service.loadSubscriptions.and.returnValue(Promise.resolve([
      new Subscription('test1@example'),
      new Subscription('test2@example'),
    ]));

    waitUntilLoaded();


    const listElements = el.querySelectorAll('xgb-list-item');
    expect(listElements.length).toBe(2);
    expect(listElements[0].querySelector('.jid').innerHTML).toBe('test1@example');
    expect(listElements[1].querySelector('.jid').innerHTML).toBe('test2@example');

  }));


  it('should render an icon for pending states', fakeAsync(() => {
    service.loadSubscriptions.and.returnValue(Promise.resolve([
      new Subscription('test1@example', undefined, undefined, SubscriptionState.Pending),
      new Subscription('test2@example', undefined, undefined, SubscriptionState.Subscribed),
    ]));

    waitUntilLoaded();


    const listElements = el.querySelectorAll('xgb-list-item');
    expect(listElements[0].querySelector('.icon').classList).toContain('icon-time');
    expect(listElements[1].querySelector('.icon')).toBeNull();

  }));

  it('should render an icon for unconfigured states', fakeAsync(() => {
    service.loadSubscriptions.and.returnValue(Promise.resolve([
      new Subscription('test1@example', undefined, undefined, SubscriptionState.Unconfigured),
      new Subscription('test2@example', undefined, undefined, SubscriptionState.Subscribed),
    ]));

    waitUntilLoaded();


    const listElements = el.querySelectorAll('xgb-list-item');
    expect(listElements[0].querySelector('.icon').classList).toContain('icon-cross');
    expect(listElements[1].querySelector('.icon')).toBeNull();

  }));

});
