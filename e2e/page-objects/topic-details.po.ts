import {UrlAddressableComponent} from '../page-elements/urlAddressableComponent';
import {by, element, ElementFinder} from 'protractor';
import {Tab} from '../page-elements/tab';
import {Spinner} from '../page-elements/spinner';
import {Form} from '../page-elements/form';
import {Locatable} from '../page-elements/locatable';
import {Toast} from '../page-elements/toast';

type TopicDetailsTab = TopicDetailsConfigurationTab | TopicDetailsAffiliationTab;

export class TopicDetailsConfigurationTab extends Tab {
  get landingUrl(): string {
    return `/topics/details/${encodeURIComponent(this.topicId)}`;
  }

  get linkText(): string {
    return 'Configuration';
  }

  get form(): Form {
    return new Form(this);
  }

  get toast(): Toast {
    return new Toast(this);
  }

  public async formSubmit(): Promise<void> {
    const buttonElement = await this.locator.element(by.cssContainingText('button[type=submit]', 'Update'));
    return buttonElement.click();
  }

  constructor(readonly topicId: string, parentElement: Locatable) {
    super(parentElement);
  }
}

export class TopicDetailsAffiliationTab extends Tab {
  get landingUrl(): string {
    return `/topics/details/${encodeURIComponent(this.topicId)}`;
  }

  get linkText(): string {
    return 'Configuration';
  }

  constructor(readonly topicId: string, parentElement: Locatable) {
    super(parentElement);
  }

}

export class TopicDetailsPage extends UrlAddressableComponent implements Locatable {
  get landingUrl(): string {
    return `/topics/details/${encodeURIComponent(this.topicId)}`;
  }

  private get locator(): ElementFinder {
    return element(by.tagName('xgb-topic-details'));
  }

  constructor(readonly topicId: string) {
    super();
  }

  private _tab: TopicDetailsTab = undefined;

  get tab(): TopicDetailsTab {
    if (this._tab === undefined) {
      // create default tab on first call, as the parent element might not be rendered earlier
      this._tab = new TopicDetailsConfigurationTab(this.topicId, this);
    }
    return this._tab;
  }

  set tab(tab: TopicDetailsTab) {
    this._tab = tab;
  }

  async navigateToTab(tab: TopicDetailsTab): Promise<void> {
    await tab.linkElement.click();
    return Spinner.waitOnNone().then(() => {
      this.tab = tab;
    });
  }

  public async getTitle(): string {
    const titleElement = await this.locator.element(by.css('h2'));
    return titleElement.getText();
  }
}
