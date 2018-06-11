import {browser, by, ElementArrayFinder, ElementFinder, ExpectedConditions} from 'protractor';
import {Locatable} from './locatable';
import {Presence} from './presence';
import {toPromise} from '../helpers';

export class ToastContent {
  constructor(
    readonly text: string,
    readonly success: boolean
  ) {
  }
}

export class Toast implements Locatable, Presence {

  constructor(public parentElement: Locatable & Presence) {
  }

  get locator(): ElementFinder {
    return this.parentElement.locator;
  }

  get toastLocators(): ElementArrayFinder {
    return this.locator.all(by.css('div.toast'));
  }

  get messages(): Promise<ToastContent[]> {
    const waitOnToast = toPromise(browser.wait(ExpectedConditions.and(
      ExpectedConditions.presenceOf(this.toastLocators.first()),
      ExpectedConditions.visibilityOf(this.toastLocators.first())
    )));


    return waitOnToast
      .then(() => toPromise(this.toastLocators
        .map<ToastContent>(async toastElement => {
          const text = await toPromise(toastElement.getText().then(v => v));
          const success = await this.elementHasClass(toastElement, 'toast-success');
          return new ToastContent(text, success);
        })
      ));
  }

  public awaitPresence(): Promise<void> {
    return this.parentElement.awaitPresence()
      .then(() => toPromise(browser.wait(ExpectedConditions.presenceOf(this.locator))));
  }

  public awaitFullPresence(): Promise<void> {
    return this.awaitPresence();
  }

  private elementHasClass(element: ElementFinder, cls: string): Promise<boolean> {
    return toPromise(element.getAttribute('class')).then((classes) => {
      return classes.split(' ').includes(cls);
    });
  }

}
