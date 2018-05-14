import {by, ElementFinder} from 'protractor';
import {Locatable} from './locatable';

export class Form implements Locatable {
  constructor(readonly parentElement: Locatable) {
  }

  get locator(): ElementFinder {
    return this.parentElement.locator;
  }

  async getFieldValue(fieldId: string): string  {
    const inputElement = await this.getInputElement(fieldId);
    return inputElement.getAttribute('value');
  }

  async setFieldValue(fieldId: string, newValue: any): Promise<void> {
    const inputElement = await this.getInputElement(fieldId);
    return inputElement.sendKeys(newValue);
  }

  private getInputElement(fieldId: string): ElementFinder {
    return this.getFieldElement(fieldId).element(by.css('input.form-input, select.form-select'));
  }

  private getFieldElement(fieldId: string): ElementFinder {
    return this.locator.element(by.css(`xgb-form-field[fieldid="${fieldId}"]`));
  }
}