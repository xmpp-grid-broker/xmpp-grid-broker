import {UrlAddressableComponent} from '../page-elements/urlAddressableComponent';
import {Locatable} from '../page-elements/locatable';
import {by, element, ElementFinder} from 'protractor';

export class AppPage extends UrlAddressableComponent implements Locatable {
  get landingUrl(): string {
    return '/';
  }

  get locator(): ElementFinder {
    return element(by.tagName('xgb-root'));
  }
}
