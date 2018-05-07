import {by, ElementArrayFinder} from 'protractor';

export class List {
  get listElements(): ElementArrayFinder {
    const listElement = this.parentElement.element(by.tagName('xgb-list'));
    return listElement.all(by.tagName('xgb-list-item'));
  }

  async listContent() {
    const elements = await this.listElements;
    return Promise.all(elements.map(listElement => listElement.getText()));
  }

  async length(): number {
    const list = await this.listElements;
    return list.length;
  }


  constructor(readonly parentElement) {
  }



}
