import {UrlAddressableComponent} from '../page-elements/urlAddressableComponent';

export class CreateCollectionPage extends UrlAddressableComponent {
  get landingUrl(): string {
    return '/topics/new/collection';
  }
}
