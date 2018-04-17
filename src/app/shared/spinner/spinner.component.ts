import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'xgb-spinner',
  templateUrl: './spinner.component.html',
  // No change detection required...
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {
}
