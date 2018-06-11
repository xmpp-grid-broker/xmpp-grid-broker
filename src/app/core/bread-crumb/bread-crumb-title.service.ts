import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Observable} from 'rxjs/Observable';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {flatMap, map, take} from 'rxjs/operators';

import {BreadCrumbs} from './bread-crumb';

@Injectable()
export class BreadCrumbTitleService {
  constructor(private title: Title) {
  }

  init(breadcrumbs$: Observable<BreadCrumbs>) {
    const path$ = breadcrumbs$.pipe(
      map(breadcrumbs => breadcrumbs.map(crumb => crumb.label)),
      flatMap(labels$ => combineLatest(labels$).pipe(take(1))),
      map(labels => labels.join(' → '))
    );

    path$.subscribe(path => {
      this.title.setTitle(`XMPP-Grid Broker: ${path}`);
    });

  }
}
