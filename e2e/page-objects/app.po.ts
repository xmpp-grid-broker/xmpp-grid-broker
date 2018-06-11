import {browser, by, element, ElementFinder, ExpectedConditions} from 'protractor';
import {BreadCrumbs, Locatable, Presence, UrlAddressableComponent} from '../page-elements';
import {toPromise} from '../helpers';

export class AppPage extends UrlAddressableComponent implements Locatable, Presence {
  get landingUrl(): string {
    return '/';
  }

  get locator(): ElementFinder {
    return element(by.tagName('xgb-root'));
  }

  get breadCrumbs(): BreadCrumbs {
    return new BreadCrumbs(this);
  }

  public awaitPresence(): Promise<void> {
    return toPromise(browser.wait(ExpectedConditions.presenceOf(this.locator)));
  }

  public awaitFullPresence(): Promise<void> {
    return this.breadCrumbs.awaitFullPresence();
  }
}
