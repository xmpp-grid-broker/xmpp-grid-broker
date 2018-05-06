import {browser, by, element} from 'protractor';
import {Page} from '../page-elements/page';
import {Tab} from '../page-elements/tab';
import {CreateTopicPage} from './create-topic.po';
import {Spinner} from '../page-elements/spinner';
import {CreateCollectionPage} from './create-collection.po';

type TopicsOverviewTab = TopicOverviewRootCollectionsTab;

export class TopicsOverviewPage extends Page {
  get landingUrl() {
    return '/topics';
  }

  tab = new TopicOverviewRootCollectionsTab();

  get newTopicButton() {
    return element(by.cssContainingText('button', 'New Topic'));

  }
  get newCollectionButton() {
    return element(by.cssContainingText('button', 'New Collection'));
  };

  navigateToTab(tab: TopicsOverviewTab) {
    this.tab = tab;
    tab.navigateTo();
  }

  async clickNewTopic () {
    await this.newTopicButton.click();
    await Spinner.waitOnNone();

    return new CreateTopicPage();
  }

  async clickNewCollection () {
    await this.newCollectionButton.click();
    await Spinner.waitOnNone();

    return new CreateCollectionPage();
  }
}

export class TopicOverviewRootCollectionsTab extends Tab implements TopicsOverviewTab {
  get landingUrl() {
    return '/topics/root';
  }

}
