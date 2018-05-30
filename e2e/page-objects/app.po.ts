import {BreadCrumbs, Locatable, UrlAddressableComponent} from '../page-elements';
import {by, element, ElementFinder} from 'protractor';

export class AppPage extends UrlAddressableComponent implements Locatable {
  get landingUrl(): string {
    return '/';
  }

  get locator(): ElementFinder {
    return element(by.tagName('xgb-root'));
  }

  get breadCrumbs(): BreadCrumbs {
    return new BreadCrumbs(this);
  }
}
