import {Component, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {distinctUntilChanged, filter, map} from 'rxjs/operators';

import {ErrorLogService} from '../../errors';
import {XmppService} from '../../xmpp';
import {BreadCrumb, BreadCrumbs} from './bread-crumb';
import {getAllUrlParameters, getUrlFromRoute, placeParamsIn} from './bread-crumb-utils';

/**
 * Component that renders bread crumbs based on the
 * values of the currently active route.
 */
@Component({
  selector: 'xgb-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BreadCrumbComponent {
  /**
   * Observable of the current bread crumbs.
   * Is updated whenever the URL changes.
   */
  breadcrumbs: Observable<BreadCrumbs>;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private xmppService: XmppService,
              private errorLogService: ErrorLogService) {
    // noinspection SuspiciousInstanceOfGuard
    this.breadcrumbs = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
      map(() => this.activatedRoute.root),
      map(route => this.getBreadCrumbs(route))
    );
  }

  /**
   * Reconstructs BreadCrumbs recursively from tree path root
   */
  private getBreadCrumbs(route: ActivatedRoute): BreadCrumbs {
    const url = getUrlFromRoute(route);

    // ActiveRoute can only have one child
    const breadCrumbs = route.firstChild ? this.getBreadCrumbs(route.firstChild) : [];

    const isRouteConfigured = route.routeConfig && route.routeConfig.data && route.routeConfig.data['breadcrumb'] !== undefined;
    const crumb: any = isRouteConfigured ? route.routeConfig.data['breadcrumb'] : undefined;

    if (route === route.root) {
      breadCrumbs.unshift(new BreadCrumb(url, of(this.xmppService.getServerTitle())));

    } else if (crumb && typeof crumb === 'string') {
      const crumbLabel = getAllUrlParameters(route).pipe(placeParamsIn(crumb));
      breadCrumbs.unshift(new BreadCrumb(url, crumbLabel));

    } else if (crumb !== null) {
      this.errorLogService.warn(
        'This route has no properly configured breadcrumb. Should either be a string or null.',
        route
      );
    }

    return breadCrumbs;
  }
}
