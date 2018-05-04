import {$, browser, element, protractor} from 'protractor';

export class Helpers {
  /**
   * Returns promise that resolves as soon as no `xgb-spinner`-tags are visible.
   */
  static noSpinners(retryMs?: number = 5000): Promise<void> {
    const EC = protractor.ExpectedConditions;
    const spinner = $('xgb-spinner');
    return browser.wait(EC.not(EC.presenceOf(spinner)), retryMs);
  }
}
