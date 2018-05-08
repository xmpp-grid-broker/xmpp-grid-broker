import {UrlAddressableComponent} from '../page-elements/urlAddressableComponent';

export class AppPage extends UrlAddressableComponent {
  get landingUrl(): string {
    return '/';
  }
}
