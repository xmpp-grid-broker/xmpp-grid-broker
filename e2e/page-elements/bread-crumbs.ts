import {browser, by, ElementArrayFinder, ElementFinder, ExpectedConditions} from 'protractor';
import {Locatable} from './locatable';
import {Presence} from './presence';
import {toPromise} from '../helpers';

export class BreadCrumbs implements Locatable, Presence {

  constructor(readonly parentElement: Locatable & Presence) {
  }

  get locator(): ElementFinder {
    return this.parentElement.locator.element(by.tagName('xgb-bread-crumb'));
  }

  get crumbElements(): ElementArrayFinder {
    return this.locator.all(by.css('.breadcrumb-item'));
  }

  public awaitPresence(): Promise<void> {
    return this.parentElement.awaitPresence()
      .then(() => toPromise(browser.wait(ExpectedConditions.presenceOf(this.locator))));
  }

  public awaitFullPresence(): Promise<void> {
    return this.awaitPresence()
      .then(() => toPromise(browser.wait(ExpectedConditions.presenceOf(this.crumbElements.first()))));
  }

  public crumbContent(): Promise<string[]> {
    const elementsPromise = toPromise(this.crumbElements
      .map(crumbElement => toPromise(crumbElement.$('a').getText())));
    return elementsPromise.then((elements) => Promise.all(elements));
  }

  public async length(): Promise<number> {
    return toPromise(this.crumbElements.then(arr => arr.length));
  }
}
