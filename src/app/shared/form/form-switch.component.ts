import {Component, Input} from '@angular/core';

@Component({
  selector: 'xgb-form-switch',
  templateUrl: './form-switch.component.html'
})
export class FormSwitchComponent {
  @Input() public fieldLabel: string;
}
