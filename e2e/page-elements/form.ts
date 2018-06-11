import {browser, by, ElementFinder, ExpectedConditions} from 'protractor';
import {Locatable} from './locatable';
import {Presence} from './presence';
import {toPromise} from '../helpers';


export class Form implements Locatable, Presence {
  constructor(readonly parentElement: Locatable & Presence, readonly _locator: (parent: Locatable) => ElementFinder) {
  }

  get locator(): ElementFinder {
    return this._locator(this.parentElement);
  }

  public awaitPresence(): Promise<void> {
    return this.parentElement.awaitPresence()
      .then(() => toPromise(browser.wait(ExpectedConditions.presenceOf(this.locator))));
  }

  public awaitFullPresence(): Promise<void> {
    return this.awaitPresence();
  }

  public async getFieldValue(fieldId: string): Promise<string> {
    return toPromise(this.getInputElement(fieldId).getAttribute('value').then(v => v));
  }

  public async setFieldValue(fieldId: string, newValue: any): Promise<void> {
    return toPromise(this.getInputElement(fieldId).sendKeys(newValue).then(v => v));
  }

  private getInputElement(fieldId: string): ElementFinder {
    return this.locator.element(by.id(fieldId));
  }
}
