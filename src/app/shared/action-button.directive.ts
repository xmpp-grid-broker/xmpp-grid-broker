import {Directive, HostBinding} from '@angular/core';

@Directive({
  selector: '[xgbActionButton]'
})
export class ActionButtonDirective {
  @HostBinding('class')
  elementClass = 'btn';

}
