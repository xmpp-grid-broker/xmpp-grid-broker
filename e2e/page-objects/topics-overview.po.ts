import {by, element, ElementFinder} from 'protractor';
import {UrlAddressableComponent} from '../page-elements/urlAddressableComponent';
import {Tab} from '../page-elements/tab';
import {CreateTopicPage} from './create-topic.po';
import {Spinner} from '../page-elements/spinner';
import {CreateCollectionPage} from './create-collection.po';
import {List} from '../page-elements/list';

type TopicsOverviewTab = TopicOverviewRootCollectionsTab | TopicOverviewAllTopicsTab | TopicOverviewAllCollectionsTab;

export class TopicOverviewRootCollectionsTab extends Tab {
  get list(): List {
    return new List(element(by.tagName('xgb-topics')));
  }

  get landingUrl(): string {
    return '/topics/root';
  }

  get linkText(): string {
    return 'Root Collections';
  }

  constructor(parentElement?: ElementFinder) {
    super(parentElement);
  }

}

export class TopicOverviewAllTopicsTab extends Tab {
  get list(): List {
    return new List(element(by.tagName('xgb-topics')));
  }

  get landingUrl(): string {
    return '/topics/all';
  }

  get linkText(): string {
    return 'All Topics';
  }

  constructor(parentElement?: ElementFinder) {
    super(parentElement);
  }
}

export class TopicOverviewAllCollectionsTab extends Tab {
  get list(): List {
    return new List(element(by.tagName('xgb-topics')));
  }

  get landingUrl(): string {
    return '/topics/collections';
  }

  get linkText(): string {
    return 'All Collections';
  }

  constructor(parentElement?: ElementFinder) {
    super(parentElement);
  }
}

export class TopicsOverviewPage extends UrlAddressableComponent {
  get landingUrl(): string {
    return '/topics';
  }

  private get elementLocator(): ElementFinder {
    return element(by.tagName('xgb-topic-overview'));
  }

  private _tab: TopicsOverviewTab = undefined;

  get tab(): TopicsOverviewTab {
    if (this._tab === undefined) {
      // create default tab on first call, as the parent element might not be rendered earlier
      this._tab = new TopicOverviewRootCollectionsTab(this.elementLocator);
    }
    return this._tab;
  }

  set tab(tab: TopicsOverviewTab) {
    tab.parentElement = this.elementLocator;
    this._tab = tab;
  }

  async navigateToTab(tab: TopicsOverviewTab): Promise<void> {
    this.tab = tab;
    await tab.linkElement.click();
    return Spinner.waitOnNone();
  }

  async clickNewTopic(): Promise<CreateTopicPage> {
    await this.newTopicButton.click();
    await Spinner.waitOnNone();

    return new CreateTopicPage();
  }

  async clickNewCollection(): Promise<CreateCollectionPage> {
    await this.newCollectionButton.click();
    await Spinner.waitOnNone();

    return new CreateCollectionPage();
  }

  private get newTopicButton(): ElementFinder {
    return element(by.cssContainingText('button', 'New Topic'));
  }

  private get newCollectionButton(): ElementFinder {
    return element(by.cssContainingText('button', 'New Collection'));
  }

}
