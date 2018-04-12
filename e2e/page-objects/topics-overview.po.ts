import {browser} from 'protractor';

export class TopicsOverviewPage {
  landingUrl = '/topics/root';

  navigateTo() {
    return browser.get(this.landingUrl);
  }
}