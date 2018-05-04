import {by, element} from 'protractor';

export class Helpers {
  private static _waitForNoSpinner(resolve: (value?: any) => void, retryMs?: number = 400) {
    element.all(by.tagName('xgb-spinner')).count()
      .then((count) => {
        if (count === 0) {
          resolve();
        } else {
          setTimeout(() => Helpers._waitForNoSpinner(resolve), retryMs);
        }
      });
  }

  /**
   * Returns promise that resolves as soon as no `xgb-spinner`-tags are visible.
   */
  static noSpinners(retryMs?: number): Promise<void> {
    return new Promise(resolve => Helpers._waitForNoSpinner(resolve, retryMs));
  }
}
