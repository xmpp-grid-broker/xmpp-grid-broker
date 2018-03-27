import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-topic-overview',
  templateUrl: './topic-overview.component.html'
})
export class TopicOverviewComponent implements OnInit {

  server = {'title': 'xmpp.hsr.ch'};

  constructor() {
  }

  ngOnInit() {
  }

}
