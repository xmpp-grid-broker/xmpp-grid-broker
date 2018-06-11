import {browser, by, ElementFinder, ExpectedConditions} from 'protractor';
import {Locatable} from './locatable';
import {UrlAddressableComponent} from './urlAddressableComponent';
import {Presence} from './presence';
import {toPromise} from '../helpers';

export abstract class Tab extends UrlAddressableComponent implements Locatable, Presence {

  protected constructor(public parentElement: Locatable & Presence) {
    super();
  }

  abstract get linkText(): string;

  abstract get locator(): ElementFinder;


  get tabBarLocator(): ElementFinder {
    return this.parentElement.locator.element(by.tagName('xgb-tabs'));
  }

  get linkElement(): ElementFinder {
    return this.tabBarLocator.element(by.linkText(this.linkText));
  }

  public awaitPresence(): Promise<void> {
    return this.parentElement.awaitPresence()
      .then(() => toPromise(browser.wait(ExpectedConditions.presenceOf(this.locator))))
      .then(() => toPromise(browser.wait(ExpectedConditions.presenceOf(this.tabBarLocator))));
  }

  public awaitFullPresence(): Promise<void> {
    return this.awaitPresence();
  }
}
