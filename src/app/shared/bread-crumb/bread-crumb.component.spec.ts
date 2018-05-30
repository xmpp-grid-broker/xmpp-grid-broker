import {BreadCrumbComponent} from '.';
import {ComponentFixture} from '@angular/core/testing/src/component_fixture';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ErrorLogService, XmppService} from '../../core';
import {Router} from '@angular/router';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe(BreadCrumbComponent.name, () => {

  let component: BreadCrumbComponent;
  let fixture: ComponentFixture<BreadCrumbComponent>;
  let el: HTMLElement;
  let xmppService: SpyObj<XmppService>;
  let errorLogService: SpyObj<ErrorLogService>;
  let router: Router;

  const waitUntilLoaded = () => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  };

  beforeEach(fakeAsync(() => {
    const mockComponent = createSpyObj('root', ['ngOnInit']);
    const routes = [
      {path: '', component: mockComponent, data: {breadcrumb: null}},
      {path: 'topics/all', component: mockComponent, data: {breadcrumb: 'All Topics'}},
      {
        path: 'topics/details/:id', data: {breadcrumb: 'Topic :id'},
        children: [
          {path: 'undef', component: mockComponent},
          {path: '', component: mockComponent, data: {breadcrumb: null}},
          {path: 'subscription/:subid', component: mockComponent, data: {breadcrumb: 'Subscription :subid'}}
        ]
      },
    ];

    xmppService = createSpyObj(XmppService.name, ['getServerTitle']);
    xmppService.getServerTitle.and.returnValue('xmpp.hsr.ch');
    errorLogService = createSpyObj(ErrorLogService.name, ['warn']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [BreadCrumbComponent],
      providers: [
        {provide: ErrorLogService, useValue: errorLogService},
        {provide: XmppService, useValue: xmppService},
      ]
    });

    fixture = TestBed.createComponent(BreadCrumbComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;
    router = TestBed.get(Router);

    // Trigger initial navigation
    router.initialNavigation();

    // Wait until component is fully rendered
    waitUntilLoaded();

  }));


  it('should put the server title for the root route', fakeAsync(() => {
    const breadcrumbs = el.querySelectorAll('.breadcrumb-item > a');
    expect(xmppService.getServerTitle).toHaveBeenCalledTimes(1);
    expect(breadcrumbs.length).toBe(1);
    expect(breadcrumbs[0].innerHTML.trim()).toBe('xmpp.hsr.ch');
  }));

  it('should render root title and first component', fakeAsync(() => {
    router.navigateByUrl('topics/all');
    waitUntilLoaded();

    const breadcrumbs = el.querySelectorAll('.breadcrumb-item > a');
    expect(breadcrumbs.length).toBe(2);
    expect(breadcrumbs[0].innerHTML.trim()).toBe('xmpp.hsr.ch');
    expect(breadcrumbs[1].innerHTML.trim()).toBe('All Topics');
  }));

  it('should not render null breadcrumbs and not log a warning', fakeAsync(() => {
    router.navigateByUrl('topics/details/12');
    waitUntilLoaded();

    const breadcrumbs = el.querySelectorAll('.breadcrumb-item > a');
    expect(breadcrumbs.length).toBe(2);
    expect(breadcrumbs[0].innerHTML.trim()).toBe('xmpp.hsr.ch');
    expect(breadcrumbs[1].innerHTML.trim()).toBe('Topic 12');
    expect(errorLogService.warn).toHaveBeenCalledTimes(0);
  }));

  it('should substitute multiple parameter values', fakeAsync(() => {
    router.navigateByUrl('topics/details/12/subscription/xyz');
    waitUntilLoaded();

    const breadcrumbs = el.querySelectorAll('.breadcrumb-item > a');
    expect(breadcrumbs.length).toBe(3);
    expect(breadcrumbs[0].innerHTML.trim()).toBe('xmpp.hsr.ch');
    expect(breadcrumbs[1].innerHTML.trim()).toBe('Topic 12');
    expect(breadcrumbs[2].innerHTML.trim()).toBe('Subscription xyz');
  }));
  it('should report a warning if a breadcrumb value is undefined', fakeAsync(() => {
    router.navigateByUrl('topics/details/123/undef');
    waitUntilLoaded();

    const breadcrumbs = el.querySelectorAll('.breadcrumb-item > a');
    expect(breadcrumbs.length).toBe(2);
    expect(breadcrumbs[0].innerHTML.trim()).toBe('xmpp.hsr.ch');
    expect(breadcrumbs[1].innerHTML.trim()).toBe('Topic 123');
    expect(errorLogService.warn).toHaveBeenCalledTimes(1);
    expect(errorLogService.warn.calls.mostRecent().args[0])
      .toBe('This route has no properly configured breadcrumb. Should either be a string or null.');
  }));
});
