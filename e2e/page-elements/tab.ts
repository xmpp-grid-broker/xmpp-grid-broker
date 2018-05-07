import {Page} from './page';
import {by, element} from 'protractor';

export abstract class Tab extends Page {

  get tabElement() {
    return this.parentElement.element(by.tagName('xgb-tabs'));
  }

  abstract get linkText();
  get linkElement() {
    return this.tabElement.element(by.linkText(this.linkText));
  }

  protected constructor(public parentElement = element(by.tagName('body'))) {
    super();
  }
}
