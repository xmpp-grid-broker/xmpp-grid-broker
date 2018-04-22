import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';

/**
 * This is a specific form control to simplify the management
 * of child topics and parent collections.
 */
@Component({
  selector: 'xgb-topic-chooser',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TopicChooserComponent),
      multi: true
    }
  ],
  templateUrl: './topic-chooser.component.html',
})
export class TopicChooserComponent implements ControlValueAccessor {

  topics: string[] = [];

  form: FormGroup;

  private _propagateChange: any;

  constructor() {
    this.form = new FormGroup({
      'topic': new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    const topicToAdd = this.form.value.topic;

    if (!this.form.valid || this.topics.indexOf(topicToAdd) > -1) {
      return;
    }

    this.topics.push(topicToAdd);
    this.propagateChanges();
    this.form.reset();
  }

  removeTopic(topicName: string) {
    this.topics.splice(this.topics.indexOf(topicName), 1);
    this.propagateChanges();
  }

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.topics = value.split('\n');
    } else {
      this.topics = [];
    }
  }

  registerOnChange(fn: any): void {
    this._propagateChange = fn;
  }

  registerOnTouched(): void {
  }

  private propagateChanges() {
    this._propagateChange(this.topics.join('\n'));
  }

}
