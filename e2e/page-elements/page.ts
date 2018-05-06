import {browser} from 'protractor';
import {Spinner} from './spinner';

export abstract class Page {

  abstract get landingUrl();

  get fullUrl() {
    return browser.baseUrl + this.landingUrl;
  }

  /**
   * Navigate to {@param path} and wait until
   * the page loads and there are no waiting spinners.
   */
  async navigateTo() {
    browser.waitForAngularEnabled(false);
    await browser.get(this.landingUrl);
    await Spinner.waitOnNone();
  }
}
