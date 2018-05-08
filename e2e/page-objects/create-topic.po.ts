import {UrlAddressableComponent} from '../page-elements/urlAddressableComponent';

export class CreateTopicPage extends UrlAddressableComponent {
  get landingUrl(): string {
    return '/topics/new/topic';
  }
}
