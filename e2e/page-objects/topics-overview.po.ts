import {by, element, ElementFinder} from 'protractor';

import {List, Tab} from '../page-elements';
import {CreateCollectionPage} from './create-collection.po';
import {CreateTopicPage} from './create-topic.po';
import {Component, promisePresenceOf, toPromise, UrlAddressableComponent} from '../utilities';

type TopicsOverviewTab = TopicOverviewRootCollectionsTab | TopicOverviewAllTopicsTab | TopicOverviewAllCollectionsTab;

export class TopicOverviewRootCollectionsTab extends Tab {
  constructor(parentElement: Component) {
    super(parentElement);
  }

  get locator(): ElementFinder {
    return this.parentElement.locator.element(by.tagName('xgb-topics'));
  }

  get list(): List {
    return new List(this);
  }

  get landingUrl(): string {
    return '/topics/root';
  }

  get linkText(): string {
    return 'Root Topics';
  }

  get breadCrumbText(): string {
    return 'Root Topics';
  }

  public awaitFullPresence(): Promise<void> {
    return super.awaitFullPresence()
      .then(() => this.list.awaitFullPresence());
  }
}

export class TopicOverviewAllTopicsTab extends Tab {
  constructor(parentElement: Component) {
    super(parentElement);
  }

  get locator(): ElementFinder {
    return this.parentElement.locator.element(by.tagName('xgb-topics'));
  }

  get list(): List {
    return new List(this);
  }

  get landingUrl(): string {
    return '/topics/all';
  }

  get linkText(): string {
    return 'All Topics';
  }

  public awaitFullPresence(): Promise<void> {
    return super.awaitFullPresence()
      .then(() => this.list.awaitFullPresence());
  }
}

export class TopicOverviewAllCollectionsTab extends Tab {
  constructor(parentElement: Component) {
    super(parentElement);
  }

  get locator(): ElementFinder {
    return this.parentElement.locator.element(by.tagName('xgb-topics'));
  }

  get list(): List {
    return new List(this);
  }

  get landingUrl(): string {
    return '/topics/collections';
  }

  get linkText(): string {
    return 'All Collections';
  }

  public awaitFullPresence(): Promise<void> {
    return super.awaitFullPresence()
      .then(() => this.list.awaitFullPresence());
  }
}

export class TopicsOverviewPage extends UrlAddressableComponent {
  get landingUrl(): string {
    return '/topics';
  }

  get locator(): ElementFinder {
    return element(by.tagName('xgb-topic-overview'));
  }

  private _tab: TopicsOverviewTab = undefined;

  get tab(): TopicsOverviewTab {
    if (this._tab === undefined) {
      // create default tab on first call, as the parent element might not be rendered earlier
      this._tab = new TopicOverviewRootCollectionsTab(this);
    }
    return this._tab;
  }

  set tab(tab: TopicsOverviewTab) {
    this._tab = tab;
  }

  private get newTopicButton(): ElementFinder {
    return element(by.cssContainingText('button', 'New Topic'));
  }

  private get newCollectionButton(): ElementFinder {
    return element(by.cssContainingText('button', 'New Collection'));
  }

  public awaitPresence(): Promise<void> {
    return promisePresenceOf(this.locator);
  }

  public awaitFullPresence(): Promise<void> {
    return this.tab.awaitFullPresence();
  }

  public navigateToTab(tab: TopicsOverviewTab): Promise<void> {
    return toPromise(tab.linkElement.click())
      .then(() => {
        this.tab = tab;
      })
      .then(() => this.tab.awaitFullPresence());
  }

  async clickNewTopic(): Promise<CreateTopicPage> {
    await toPromise(this.newTopicButton.click());

    const newPage = new CreateTopicPage();
    await newPage.awaitFullPresence();

    return newPage;
  }

  async clickNewCollection(): Promise<CreateCollectionPage> {
    await toPromise(this.newCollectionButton.click());

    const newPage = new CreateCollectionPage();
    await newPage.awaitFullPresence();

    return newPage;
  }

}
