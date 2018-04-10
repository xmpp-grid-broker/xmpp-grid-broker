import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'xgb-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.css']
})
export class FormFieldComponent {
  @Input() public fieldId: string;
  @Input() public fieldLabel: string;
  @Input() public fieldHelp: string;
}
