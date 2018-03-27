import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {logger} from 'codelyzer/util/logger';

@Component({
  selector: 'app-not-found',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  errorCode: string;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.errorCode = data['errorCode'];
    });
  }

}
