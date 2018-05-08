import {by, ElementArrayFinder} from 'protractor';

export class List {
  private get listElements(): ElementArrayFinder {
    const listElement = this.parentElement.element(by.tagName('xgb-list'));
    return listElement.all(by.tagName('xgb-list-item'));
  }

  async listContent(): Promise<string[]> {
    const elements = await this.listElements;
    return Promise.all(elements.map(listElement => listElement.getText()));
  }

  async length(): Promise<number> {
    const list = await this.listElements;
    return list.length;
  }

  constructor(readonly parentElement) {
  }
}
