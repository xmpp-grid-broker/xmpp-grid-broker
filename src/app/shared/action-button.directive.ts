import {Directive, ElementRef} from '@angular/core';


/**
 * This directive can be applied to buttons or links
 * to style them as action buttons.
 *
 */
@Directive({
  selector: '[xgbActionButton]'
})
export class ActionButtonDirective {
  constructor(private el: ElementRef) {
    el.nativeElement.classList.add('btn');
    if (el.nativeElement.hasAttribute('primary')) {
      el.nativeElement.classList.add('btn-primary');
    }
  }

}