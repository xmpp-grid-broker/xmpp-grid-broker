import {Component, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, NavigationEnd, ParamMap, Router} from '@angular/router';
import {XmppService} from '../../xmpp';
import {ErrorLogService} from '../../errors';
import {BreadCrumb, BreadCrumbs} from './bread-crumb';
import {Observable} from 'rxjs/Observable';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {distinctUntilChanged, filter, map} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import {OperatorFunction} from 'rxjs/interfaces';

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
      map(route => this.getBreadCrumbsFromRoute(route))
    );
  }

  /**
   * Replace all ":key" occurrences in {@param value}
   */
  private static replaceParamsIn(value: string): OperatorFunction<Map<string, string>, string> {
    return map((params: Map<string, string>) => {
      const keys = params.keys();

      // TypeScript does not support Map Iterators to target ES5.
      // see https://github.com/Microsoft/TypeScript/issues/11209#issuecomment-250242946
      let next = keys.next();
      while (!next.done) {
        value = value.replace(`:${next.value}`, params.get(next.value));
        next = keys.next();
      }
      return value;
    });
  }

  /**
   * Converts a {@type ParamMap} into a real, iterable ${@type Map}
   */
  private static convertParamMapToMap(): OperatorFunction<ParamMap, Map<string, string>> {
    return map(paramMap => {
      const realParameterMap = new Map();
      for (const key of paramMap.keys) {
        realParameterMap.set(key, paramMap.get(key));
      }
      return realParameterMap;
    });
  }

  /**
   * Flattens a map array to a single map.
   */
  private static* flatten2dMapIterator<L, R>(maps: Map<L, R>[]): IterableIterator<[L, R]> {
    for (const singleMap of maps) {
      // TypeScript does not support Map Iterators to target ES5.
      // see https://github.com/Microsoft/TypeScript/issues/11209#issuecomment-250242946
      const keys = singleMap.keys();

      let next = keys.next();
      while (!next.done) {
        yield [next.value, singleMap.get(next.value)];
        next = keys.next();
      }
    }
  }

  /**
   * Returns the full url with replaced parameters of a {@type ActivatedRoute}
   */
  private static getUrlFromRoute(currentRoute: ActivatedRoute): Observable<string> {
    // filter out root and empty path parts (usually only root route)
    const routesFromRoot = currentRoute.pathFromRoot.filter(route => route.routeConfig && route.routeConfig.path);

    // return root path immediately
    if (routesFromRoot.length === 0) {
      return of('');
    }

    // map routes to url fragment with substituted parameters
    const urlFragments = routesFromRoot.map(route => route.paramMap.pipe(
      this.convertParamMapToMap(),
      this.replaceParamsIn(route.routeConfig.path),
    ));

    return combineLatest(urlFragments, (...fragments: string[]) => {
      return fragments.join('/');
    });
  }

  /**
   * Get all url Parameters from a {@type ActivatedRoute}.
   */
  private static getAllUrlParameters(currentRoute: ActivatedRoute): Observable<Map<string, string>> {
    // filter out root and empty path parts (usually only root route)
    const routesFromRoot = currentRoute.pathFromRoot;

    // return root path immediately
    if (routesFromRoot.length === 0) {
      return of(new Map());
    }

    // map routes to route parameter maps
    const routeParams = routesFromRoot
      .map(route => route.paramMap)
      .map(paramMap => paramMap.pipe(this.convertParamMapToMap()));

    // flatten parameter maps into one object
    return combineLatest(routeParams, (...paramMaps: Map<string, string>[]) => {
      return new Map(this.flatten2dMapIterator(paramMaps));
    });
  }

  /**
   * Reconstructs BreadCrumbs recursively from tree path root
   */
  private getBreadCrumbsFromRoute(route: ActivatedRoute): BreadCrumbs {
    const url = BreadCrumbComponent.getUrlFromRoute(route);

    // ActiveRoute can only have one child
    const crumbs = route.firstChild ? this.getBreadCrumbsFromRoute(route.firstChild) : [];

    const isRouteConfigured = route.routeConfig && route.routeConfig.data && route.routeConfig.data['breadcrumb'] !== undefined;
    const crumb: any = isRouteConfigured ? route.routeConfig.data['breadcrumb'] : undefined;

    if (route === route.root) {
      crumbs.unshift(new BreadCrumb(url, of(this.xmppService.getServerTitle())));

    } else if (crumb && typeof crumb === 'string') {
      const crumbName = BreadCrumbComponent.getAllUrlParameters(route).pipe(BreadCrumbComponent.replaceParamsIn(crumb));
      crumbs.unshift(new BreadCrumb(url, crumbName));

    } else if (crumb !== null) {
      this.errorLogService.warn(
        'This route has no properly configured breadcrumb. Should either be a string or null.',
        route
      );
    }

    return crumbs;
  }
}
