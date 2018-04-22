import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'xgb-topic-details',
  templateUrl: './topic-details.component.html'
})
export class TopicDetailsComponent implements OnInit {
  topicIdentifier: string;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.topicIdentifier = this.route.snapshot.params.id;
  }

}
