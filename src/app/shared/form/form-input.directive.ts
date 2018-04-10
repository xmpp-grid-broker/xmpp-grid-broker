import {Directive, HostBinding} from '@angular/core';

@Directive({
  selector: '[xgbFormInput]',
})
export class FormInputDirective {
  @HostBinding('class')
  elementClass = 'form-input';
}
