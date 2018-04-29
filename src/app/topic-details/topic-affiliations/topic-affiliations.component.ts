import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'xgb-topic-affiliations',
  templateUrl: './topic-affiliations.component.html'
})
export class TopicAffiliationsComponent implements OnInit {

  hasError = false;
  errorMessage = 'NOT IMPLEMENTED';

  isLoaded = true;
  affiliations = ['aff1', 'aff2'];


  constructor() {
  }

  ngOnInit() {
  }

  addAffiliation() {

  }
}
