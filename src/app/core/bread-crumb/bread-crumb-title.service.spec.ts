import {fakeAsync, tick} from '@angular/core/testing';
import {Title} from '@angular/platform-browser';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';

import {BreadCrumb, BreadCrumbs} from './bread-crumb';
import {BreadCrumbTitleService} from './bread-crumb-title.service';

describe(BreadCrumbTitleService.name, () => {
  let titleService: jasmine.SpyObj<Title>;
  let breadCrumbTitleService: BreadCrumbTitleService;

  beforeEach(() => {
    titleService = jasmine.createSpyObj(Title.name, ['setTitle']);
    breadCrumbTitleService = new BreadCrumbTitleService(titleService);
  });

  it('should translate breadcrumbs into title', fakeAsync(() => {
    const breadCrumbs: Observable<BreadCrumbs> = of([
      new BreadCrumb(of('./'), of('Random')),
      new BreadCrumb(of('./stuff'), of('Stuff'))
    ]);

    breadCrumbTitleService.init(breadCrumbs);

    tick();

    return expect(titleService.setTitle).toHaveBeenCalledWith('XMPP-Grid Broker: Random → Stuff');
  }));

  it('should replace breadcrumbs when they change', fakeAsync(() => {
    // Provide initial values
    const breadCrumbs: BehaviorSubject<BreadCrumbs> = new BehaviorSubject<BreadCrumbs>([
      new BreadCrumb(of('./'), of('Random')),
    ]);
    breadCrumbTitleService.init(breadCrumbs);
    tick();
    expect(titleService.setTitle).toHaveBeenCalledWith('XMPP-Grid Broker: Random');

    // Update breadcrumbs & verify new values
    breadCrumbs.next([
      new BreadCrumb(of('./'), of('Foo')),
      new BreadCrumb(of('./baa'), of('Baa')),
    ]);
    tick();
    expect(titleService.setTitle).toHaveBeenCalledWith('XMPP-Grid Broker: Foo → Baa');

  }));


  it('should change the title when no breadcrumbs are provided', fakeAsync(() => {
    const breadCrumbs: Observable<BreadCrumbs> = of([]);

    breadCrumbTitleService.init(breadCrumbs);

    tick();

    return expect(titleService.setTitle).toHaveBeenCalledTimes(0);
  }));
});
