import {Observable} from 'rxjs/Observable';

export class BreadCrumb {
  constructor(readonly url: Observable<string>, readonly name?: Observable<string>) {
  }
}

export type BreadCrumbs = Array<BreadCrumb>;
