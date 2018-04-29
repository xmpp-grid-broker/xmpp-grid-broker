import {Component, OnInit} from '@angular/core';
import {TopicDetailsService} from '../topic-details.service';
import {Affiliation, JidAffiliation} from '../../core/models/Affiliation';

@Component({
  selector: 'xgb-topic-affiliations',
  templateUrl: './topic-affiliations.component.html',
  styleUrls: ['./topic-affiliations.component.css']
})
export class TopicAffiliationsComponent implements OnInit {

  /**
   * If a service method call is pending, this field is set to false,
   * otherwise true. Used for the spinner.
   */
  isLoaded: boolean;

  /**
   * will be set to true if the a service method call has failed.
   */
  hasError: boolean;
  /**
   * If `hasError` is true, this is the error message to display
   * to the user.
   */
  errorMessage: string;

  /**
   * An array of the affiliations to manage.
   */
  jidAffiliations: JidAffiliation[];

  /**
   * Used within template because Object.keys cannot be used directly in
   * angular templates.
   */
  readonly affiliations = Object.keys(Affiliation).reduce((acc, key) => {
    acc.push({label: key, value: Affiliation[key]});
    return acc;
  }, []);

  constructor(private topicDetailsService: TopicDetailsService) {
  }

  ngOnInit() {
    // TODO: inject topic
    this.isLoaded = false;
    this.hasError = false;
    this.topicDetailsService.loadJidAffiliations('todo')
      .then((loadedAffiliations: JidAffiliation[]) => {
        this.isLoaded = true;
        this.jidAffiliations = loadedAffiliations;
      })
      .catch((error) => {
        this.isLoaded = true;
        this.hasError = true;
        if (error && error.condition) {
          // TODO: handle according to the error codes...
          this.errorMessage = 'TODO: Better Message';
        } else {
          // TODO: handle according to the error codes...
        }

      });
  }

  addAffiliation() {

  }

  removeAffiliation(affiliation: JidAffiliation) {

  }
}
