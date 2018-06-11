import {browser, by, ElementArrayFinder, ElementFinder, ExpectedConditions} from 'protractor';
import {Locatable} from './locatable';
import {Presence} from './presence';
import {toPromise} from '../helpers';

export class List implements Locatable, Presence {

  constructor(readonly parentElement: Locatable & Presence) {
  }

  get locator(): ElementFinder {
    return this.parentElement.locator.element(by.tagName('xgb-list'));
  }

  get listElements(): ElementArrayFinder {
    return this.locator.all(by.tagName('xgb-list-item'));
  }

  public awaitPresence(): Promise<void> {
    return this.parentElement.awaitPresence()
      .then(() => toPromise(browser.wait(ExpectedConditions.presenceOf(this.locator))));
  }

  public awaitFullPresence(): Promise<void> {
    return this.awaitPresence()
      .then(() => toPromise(browser.wait(ExpectedConditions.presenceOf(this.listElements.first()))));
  }

  public async listContent(): Promise<string[]> {
    const elements = await this.listElements;
    return Promise.all(elements.map(listElement => listElement.getText()));
  }

  public async length(): Promise<number> {
    const list = await this.listElements;
    return list.length;
  }
}
