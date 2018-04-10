import {Directive, HostBinding} from '@angular/core';

@Directive({
  selector: '[xgbForm]',
})
export class FormDirective {
  @HostBinding('class')
  elementClass = 'form-horizontal';

}
