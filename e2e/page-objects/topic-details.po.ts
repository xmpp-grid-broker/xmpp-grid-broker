import {UrlAddressableComponent} from '../page-elements/urlAddressableComponent';
import {by, element, ElementFinder} from 'protractor';
import {Tab} from '../page-elements/tab';
import {Spinner} from '../page-elements/spinner';
import {Form} from '../page-elements/form';
import {Locatable} from '../page-elements/locatable';
import {Toast} from '../page-elements/toast';
import {List} from '../page-elements/list';

type TopicDetailsTab = TopicDetailsConfigurationTab | TopicDetailsAffiliationTab;

export class AffiliationListElement {
  constructor(
    readonly jid: string,
    readonly affiliation: ElementFinder,
    readonly removeButton: ElementFinder
  ) {
  }

  public clickRemoveButton(): Promise<void> {
    return this.removeButton.click();
  }

  get affiliationText(): Promise<string> {
    return this.affiliation.getText();
  }

  public setAffiliation(affiliation: 'Owner' | 'Publisher' | 'PublishOnly' | 'Member' | 'Outcast'): Promise<void> {
    return this.affiliation
      .element(by.cssContainingText('option', affiliation))
      .click();
  }
}



export class TopicDetailsConfigurationTab extends Tab {
  get landingUrl(): string {
    return `/topics/details/${encodeURIComponent(this.topicId)}/configuration`;
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

  public  formSubmit(): Promise<void> {
    return this.locator.element(by.cssContainingText('button[type=submit]', 'Update'))
      .click();
  }

  constructor(readonly topicId: string, parentElement: Locatable) {
    super(parentElement);
  }
}

export class TopicDetailsAffiliationTab extends Tab {
  get landingUrl(): string {
    return `/topics/details/${encodeURIComponent(this.topicId)}/affiliations`;
  }

  get linkText(): string {
    return 'Affiliations';
  }

  get list(): List {
    return new List(this);
  }

  get listObjects(): Promise<AffiliationListElement[]> {
    // noinspection TypeScriptValidateTypes
    return this.list.listElements
      .map(listElement => TopicDetailsAffiliationTab.listElementToObjectMapper(listElement));
  }

  public getListObjectsByJid(jid: string): Promise<AffiliationListElement[]> {
    return this.listObjects
      .then(affiliations => {
        return affiliations.filter(affiliation => affiliation.jid === jid);
      });
  }

  get firstAffiliation(): Promise<AffiliationListElement> {
    return this.listObjects.then(list => list[0]);
  }

  get form(): Form {
    return new Form(this.list);
  }

  public formSubmit(): Promise<void> {
    return this.locator.element(by.cssContainingText('button[type=submit]', 'add'))
      .click();
  }

  constructor(readonly topicId: string, parentElement: Locatable) {
    super(parentElement);
  }

  private static async listElementToObjectMapper(listElement: ElementFinder): AffiliationListElement | undefined {
    const isNewAffiliation = await listElement.element(by.css('jid-affiliation')).isPresent();
    if (isNewAffiliation) {
      return undefined;
    }

    const jid = await listElement.element(by.css('div.jid')).getText();
    const affiliation = await listElement.element(by.css('div.actions select'));
    const removeButton = await listElement.element(by.css('div.actions select'));

    return {
      jid: jid,
      affiliation: affiliation,
      removeButton: removeButton
    };
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
