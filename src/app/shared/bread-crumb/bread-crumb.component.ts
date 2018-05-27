import {Component, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {BreadCrumb, BreadCrumbs} from '../../core/models/bread-crumb';
import {ErrorLogService} from '../../core/errors/error-log.service';
import {XmppService} from '../../core/xmpp/xmpp.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';

@Component({
  selector: 'xgb-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BreadCrumbComponent {
  // noinspection SuspiciousInstanceOfGuard
  breadcrumbs = this.router.events
    .filter(event => event instanceof NavigationEnd)
    .distinctUntilChanged()
    .map(() => this.getBreadFromRoute(this.activatedRoute.root));

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private xmppService: XmppService,
              private errorLogService: ErrorLogService) {
  }

  /**
   * Reconstructs BreadCrumbs recursively from tree path root
   *
   * @param {ActivatedRoute} route The root from where to reconstruct BreadCrumbs
   * @param {string[]} parentUrlFragments URL fragments of the current path
   * @returns {BreadCrumbs}
   */
  private getBreadFromRoute(route: ActivatedRoute, parentUrlFragments: string[] = []): BreadCrumbs {

    // routeConfig is undefined on the root route
    const urlFragments = route.routeConfig ? [...parentUrlFragments, route.routeConfig.path] : parentUrlFragments;
    const url = this.substituteParamStrings(route, urlFragments.join('/'));

    // ActiveRoute can only have one child
    const crumbs = route.firstChild ? this.getBreadFromRoute(route.firstChild, urlFragments) : [];

    const isRouteConfigured = route.routeConfig && route.routeConfig.data && route.routeConfig.data['breadcrumb'] !== undefined;
    const crumb = isRouteConfigured ? route.routeConfig.data['breadcrumb'] : undefined;

    if (route === route.root) {
      crumbs.unshift(new BreadCrumb(url, Observable.fromPromise(this.xmppService.getServerTitle())));

    } else if (crumb && typeof crumb === 'string') {
      crumbs.unshift(new BreadCrumb(url, this.substituteParamStrings(route, crumb)));

    } else if (crumb !== null) {
      this.errorLogService.warn(
        'This route has no properly configured breadcrumb. Should either be a string or null.',
        route
      );
    }

    return crumbs;
  }

  /**
   * Substitutes all route parameters (e.g. :id) in the string text.
   *
   * @param {ActivatedRoute} route
   * @param {string} text
   * @returns {Observable<string>}
   */
  private substituteParamStrings(route: ActivatedRoute, text: string): Observable<string> {
    return route.params.map(params => {
      for (const paramKey of Object.keys(params)) {
        text = text.replace(`:${paramKey}`, params[paramKey]);
      }
      return text;
    });
  }
}
