import {Page} from './page';
import {by, element} from 'protractor';

export abstract class Tab extends Page {
  get parentElement() {
    return element(by.tagName('xgb-tabs'));
  }

  abstract get linkText();
  get linkElement() {
    return this.parentElement.element(by.linkText(this.linkText));
  }

}
