import {Component, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {XmppService} from '../../xmpp';
import {ErrorLogService} from '../../errors';
import {BreadCrumb, BreadCrumbs} from './bread-crumb';
import {Observable} from 'rxjs/Observable';
import {distinctUntilChanged, filter, map} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import {BreadCrumbUtils} from './bread-crumb-utils';

@Component({
  selector: 'xgb-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BreadCrumbComponent {
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
    const url = BreadCrumbUtils.getUrlFromRoute(route);

    // ActiveRoute can only have one child
    const breadCrumbs = route.firstChild ? this.getBreadCrumbs(route.firstChild) : [];

    const isRouteConfigured = route.routeConfig && route.routeConfig.data && route.routeConfig.data['breadcrumb'] !== undefined;
    const crumb: any = isRouteConfigured ? route.routeConfig.data['breadcrumb'] : undefined;

    if (route === route.root) {
      breadCrumbs.unshift(new BreadCrumb(url, of(this.xmppService.getServerTitle())));

    } else if (crumb && typeof crumb === 'string') {
      const crumbName = BreadCrumbUtils.getAllUrlParameters(route).pipe(BreadCrumbUtils.placeParamsIn(crumb));
      breadCrumbs.unshift(new BreadCrumb(url, crumbName));

    } else if (crumb !== null) {
      this.errorLogService.warn(
        'This route has no properly configured breadcrumb. Should either be a string or null.',
        route
      );
    }

    return breadCrumbs;
  }
}
