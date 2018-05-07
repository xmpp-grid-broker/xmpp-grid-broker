import {by, element} from 'protractor';
import {Page} from '../page-elements/page';
import {Tab} from '../page-elements/tab';
import {CreateTopicPage} from './create-topic.po';
import {Spinner} from '../page-elements/spinner';
import {CreateCollectionPage} from './create-collection.po';
import {List} from '../page-elements/list';

type TopicsOverviewTab = TopicOverviewRootCollectionsTab | TopicOverviewAllTopicsTab | TopicOverviewAllCollectionsTab;

export class TopicsOverviewPage extends Page {
  get landingUrl() {
    return '/topics';
  }

  get elementLocator() {
    return element(by.tagName('xgb-topic-overview'));
  }

  private _tab: TopicsOverviewTab;
  get tab() {
    if (this._tab === undefined) {
      // create default tab on first call, as the parent element might not be rendered earlier
      this._tab = new TopicOverviewRootCollectionsTab(this.elementLocator);
    }
    return this._tab;
  }
  set tab(tab) {
    tab.parentElement = this.elementLocator;
    this._tab = tab;
  }


  get newTopicButton() {
    return element(by.cssContainingText('button', 'New Topic'));

  }

  get newCollectionButton() {
    return element(by.cssContainingText('button', 'New Collection'));
  }

  async navigateToTab(tab: TopicsOverviewTab) {
    this.tab = tab;
    await tab.linkElement.click();
    return Spinner.waitOnNone();
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

export class TopicOverviewRootCollectionsTab extends Tab {
  get content() {
    return element(by.tagName('xgb-topics'));
  }

  get list() {
    return new List(this.content);
  }

  get landingUrl() {
    return '/topics/root';
  }

  get linkText() {
    return 'Root Collections';
  }
}

export class TopicOverviewAllTopicsTab extends Tab {
  list = new List(element(by.tagName('xgb-topics')));

  get landingUrl() {
    return '/topics/all';
  }

  get linkText() {
    return 'All Topics';
  }
}

export class TopicOverviewAllCollectionsTab extends Tab {
  list = new List(element(by.tagName('xgb-topics')));

  get landingUrl() {
    return '/topics/collections';
  }

  get linkText() {
    return 'All Collections';
  }
}
