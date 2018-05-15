import {UrlAddressableComponent} from './urlAddressableComponent';
import {by, ElementFinder} from 'protractor';
import {Locatable} from './locatable';

export abstract class Tab extends UrlAddressableComponent implements Locatable {

  abstract get linkText(): string;

  get locator(): ElementFinder {
    return this.parentElement.locator;
  }

  get tabBarLocator(): ElementFinder {
    return this.parentElement.locator.element(by.tagName('xgb-tabs'));
  }

  get linkElement(): ElementFinder {
    return this.tabBarLocator.element(by.linkText(this.linkText));
  }

  protected constructor(public parentElement: Locatable) {
    super();
  }
}
