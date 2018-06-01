import {OperatorFunction} from 'rxjs/interfaces';
import {map} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {combineLatest} from 'rxjs/observable/combineLatest';

export class BreadCrumbUtils {
  /**
   * Replace all ":key" occurrences in {@param value}
   */
  public static placeParamsIn(value: string): OperatorFunction<Map<string, string>, string> {
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
  public static getUrlFromRoute(currentRoute: ActivatedRoute): Observable<string> {
    // filter out root and empty path parts (usually only root route)
    const routesFromRoot = currentRoute.pathFromRoot.filter(route => route.routeConfig && route.routeConfig.path);

    // return root path immediately
    if (routesFromRoot.length === 0) {
      return of('');
    }

    // map routes to url fragment with substituted parameters
    const urlFragments = routesFromRoot.map(route => route.paramMap.pipe(
      this.convertParamMapToMap(),
      this.placeParamsIn(route.routeConfig.path),
    ));

    return combineLatest(urlFragments, (...fragments: string[]) => {
      return fragments.join('/');
    });
  }

  /**
   * Get all url Parameters from a {@type ActivatedRoute}.
   */
  public static getAllUrlParameters(currentRoute: ActivatedRoute): Observable<Map<string, string>> {
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
}
