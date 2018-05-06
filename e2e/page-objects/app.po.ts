import {Page} from '../page-elements/page';

export class AppPage extends Page {
  landingUrl = '/';
  navigateTo() {
    return super.navigateTo(this.landingUrl);
  }
}
