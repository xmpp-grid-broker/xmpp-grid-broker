import {Locatable} from './locatable';
import {browser, by, ElementArrayFinder, ElementFinder, ExpectedConditions} from 'protractor';

export class ToastContent {
  constructor(
    readonly text: string,
    readonly success: boolean
  ) {
  }
}

export class Toast implements Locatable {

  get locator(): ElementFinder {
    return this.parentElement.locator;
  }

  get toastLocators(): ElementArrayFinder {
    return this.locator.all(by.css('div.toast'));
  }

  get messages(): Promise<ToastContent[]> {
    const waitConditions = ExpectedConditions.and(
      ExpectedConditions.presenceOf(this.toastLocators.first()),
      ExpectedConditions.visibilityOf(this.toastLocators.first())
    );
    return browser.wait(waitConditions)
      .then(() => this.toastLocators.map(async toastElement => {
        const text = await toastElement.getText();
        const success = await this.elementHasClass(toastElement, 'toast-success');
        return new ToastContent(text, success);
      }));
  }

  constructor(public parentElement: Locatable) {
  }

  private elementHasClass(element: ElementFinder, cls: string): Promise<boolean> {
    return element.getAttribute('class').then((classes) => {
      return classes.split(' ').includes(cls);
    });
  }

}
