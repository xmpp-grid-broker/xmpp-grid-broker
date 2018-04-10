import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'xgb-topic-config',
  templateUrl: './topic-config.component.html',
  styleUrls: ['./topic-config.component.css']
})
export class TopicConfigComponent implements OnInit {
  public configForm: FormGroup;

  ngOnInit() {
    this.configForm = new FormGroup ({
      name: new FormControl()
    });
  }
}
