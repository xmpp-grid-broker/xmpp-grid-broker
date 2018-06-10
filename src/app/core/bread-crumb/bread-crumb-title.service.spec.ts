import {Title} from '@angular/platform-browser';
import {fakeAsync, tick} from '@angular/core/testing';
import {Observable} from 'rxjs/Observable';

import {BreadCrumbTitleService} from './bread-crumb-title.service';
import {of} from 'rxjs/observable/of';
import {BreadCrumb, BreadCrumbs} from './bread-crumb';

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
});
