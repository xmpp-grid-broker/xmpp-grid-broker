import {UrlAddressableComponent} from '../page-elements';
import {browser, by, element, ElementFinder, ExpectedConditions} from 'protractor';
import {toPromise} from '../helpers';

export class CreateTopicPage extends UrlAddressableComponent {
  get landingUrl(): string {
    return '/topics/new/topic';
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
