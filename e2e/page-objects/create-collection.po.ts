import {Locatable, Presence, UrlAddressableComponent} from '../page-elements';
import {browser, by, element, ElementFinder, ExpectedConditions} from 'protractor';
import {toPromise} from '../helpers';

export class CreateCollectionPage extends UrlAddressableComponent implements Locatable, Presence {
  get landingUrl(): string {
    return '/topics/new/collection';
  }

  get locator(): ElementFinder {
    return element(by.tagName('xgb-topic-creation'));
  }

  public awaitPresence(): Promise<void> {
    return toPromise(browser.wait(ExpectedConditions.presenceOf(this.locator)));
  }

  public awaitFullPresence(): Promise<void> {
    return this.awaitPresence();
  }
}
