import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'xgb-topic-details',
  templateUrl: './topic-details.component.html'
})
export class TopicDetailsComponent implements OnInit {
  topicIdentifier: string;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    // this.specificFormFields['pubsub#node_type'] = new FormControl(this.route.snapshot.data.type);
    // this.specificFormFields['pubsub#children'] = new FormControl(null);
    // this.specificFormFields['pubsub#collection'] = new FormControl(null);
    this.topicIdentifier = this.route.snapshot.params.id;
  }

}
