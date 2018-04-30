import {Component, OnInit} from '@angular/core';
import {TopicDetailsService} from '../topic-details.service';
import {Affiliation, JidAffiliation} from '../../core/models/Affiliation';
import {ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';

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
    if (key === Affiliation.None) { // because none means delete
      return acc;
    }
    acc.push({label: key, value: Affiliation[key]});
    return acc;
  }, []);

  /**
   * The node on which the affiliations are managed.
   */
  private nodeId: string;

  constructor(private route: ActivatedRoute,
              private topicDetailsService: TopicDetailsService) {
  }

  ngOnInit() {
    this.nodeId = this.route.parent.snapshot.params.id;
    this.refresh();
  }

  addAffiliation(formRef: NgForm) {
    const form = formRef.form;

    const newAffiliation = new JidAffiliation(
      form.get('jid').value,
      form.get('affiliation').value);

    this.isLoaded = false;
    this.topicDetailsService.modifyJidAffiliation(this.nodeId, newAffiliation)
      .then(() => {
        form.reset();
        this.refresh();
      })
      .catch(() => {
        // TODO
        this.refresh();
      });
  }

  removeAffiliation(affiliation: JidAffiliation) {
    // TODO: SHOW PROMT IF my own rights are degraded!
    affiliation.affiliation = Affiliation.None;

    this.isLoaded = false;
    this.topicDetailsService.modifyJidAffiliation(this.nodeId, affiliation)
      .then(() => {
        this.refresh();
      })
      .catch(() => {
        // TODO:
        this.refresh();
      });
  }

  private refresh() {
    this.isLoaded = false;
    this.hasError = false;
    this.topicDetailsService.loadJidAffiliations(this.nodeId)
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
}
