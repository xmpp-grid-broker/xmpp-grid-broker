import {UrlAddressableComponent} from './urlAddressableComponent';
import {by, element, ElementFinder} from 'protractor';

export abstract class Tab extends UrlAddressableComponent {

  abstract get linkText(): string;

  get tabElement(): ElementFinder {
    return this.parentElement.element(by.tagName('xgb-tabs'));
  }

  get linkElement(): ElementFinder {
    return this.tabElement.element(by.linkText(this.linkText));
  }

  protected constructor(public parentElement = element(by.tagName('body'))) {
    super();
  }
}
