import {Page} from '../page-elements/page';

export class CreateTopicPage extends Page {
  get landingUrl() {
    return '/topics/new/topic';
  }
}
