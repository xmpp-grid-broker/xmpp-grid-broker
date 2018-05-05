import {$, browser, element, protractor} from 'protractor';

export class Helpers {
  /**
   * Returns promise that resolves as soon as no `xgb-spinner`-tags are visible.
   */
  static noSpinners(retryMs?: number = 20000): Promise<void> {
    const EC = protractor.ExpectedConditions;
    return new Promise(resolve => {
      setTimeout(() => {
        const spinner = $('xgb-spinner');
        browser.wait(EC.not(EC.presenceOf(spinner)), retryMs)
          .then(() => resolve());
      }, 5000); // wait a second to give the spinner time to initialise
    });
  }
}
