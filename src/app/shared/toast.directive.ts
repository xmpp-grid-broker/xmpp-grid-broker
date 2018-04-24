import {Directive, ElementRef} from '@angular/core';


/**
 * This directive can be applied to buttons or links
 * to style them as action buttons.
 *
 */
@Directive({
  selector: '[xgbToast]'
})
export class ToastDirective {
  constructor(private el: ElementRef) {
    el.nativeElement.classList.add('toast');
    if (el.nativeElement.hasAttribute('toast-success')) {
      el.nativeElement.classList.add('toast-success');
    } else if (el.nativeElement.hasAttribute('toast-error')) {
      el.nativeElement.classList.add('toast-error');
    }
  }

}
