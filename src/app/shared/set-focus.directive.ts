import {Directive, ElementRef, AfterViewInit} from '@angular/core';

@Directive({
  selector: '[xgbSetFocus]'
})
export class SetFocusDirective implements AfterViewInit {
  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    this.el.nativeElement.focus();
  }
}
