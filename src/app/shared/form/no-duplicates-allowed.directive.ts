import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
  selector: '[xgbNoDuplicatesAllowed]',
  providers: [{provide: NG_VALIDATORS, useExisting: NoDuplicatesAllowedDirective, multi: true}]
})
export class NoDuplicatesAllowedDirective implements Validator {
  @Input('xgbNoDuplicatesAllowed') xgbNoDuplicatesAllowed: any[];
  @Input('xgbDuplicateKey') xgbDuplicateKey: any;

  validate(c: AbstractControl): ValidationErrors | null {
    let list = this.xgbNoDuplicatesAllowed;
    if (this.xgbDuplicateKey) {
      list = this.xgbNoDuplicatesAllowed.map((item) => item[this.xgbDuplicateKey]);
    }
    if (list.indexOf(c.value) >= 0) {
      return {duplicate: true};
    }
    return null;

  }
}
