import {Component, OnInit} from '@angular/core';
import {TopicDetailsService} from '../topic-details.service';
import {Affiliation, JidAffiliation} from '../../core/models/Affiliation';
import {ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';
import {XmppService} from '../../core/xmpp/xmpp.service';

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
    if (Affiliation[key] === Affiliation.None) { // because none means delete
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
              private xmppService: XmppService,
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
      .catch(this.handleFailedJidModification);
  }

  changeAffiliation(affiliation: JidAffiliation, newAffiliation, selectBox) {
    // TODO: TEST AND TEST CONFIRM!
    this.xmppService.isJidCurrentUser(affiliation.jid).then((doChangeOwnConfig) => {
      if (doChangeOwnConfig && !confirm('You are modifying you own rights. Are you sure to proceed?')) {
        selectBox.value = affiliation.affiliation;
        return;
      }
      this.isLoaded = false;
      affiliation.affiliation = newAffiliation;
      this.topicDetailsService.modifyJidAffiliation(this.nodeId, affiliation)
        .then(() => {
          this.refresh();
        })
        .catch(this.handleFailedJidModification);
    });

  }

  removeAffiliation(affiliation: JidAffiliation) {
    // TODO: TEST CONFIRM!
    this.xmppService.isJidCurrentUser(affiliation.jid).then((doChangeOwnConfig) => {
      if (doChangeOwnConfig && !confirm('YOU ARE IN THE PROCESS OF REMOVING YOUR MANAGEMENT PERMISSIONS. Are you sure to proceed?')) {
        return;
      }
      affiliation.affiliation = Affiliation.None;
      this.isLoaded = false;
      this.topicDetailsService.modifyJidAffiliation(this.nodeId, affiliation)
        .then(() => {
          this.refresh();
        })
        .catch(this.handleFailedJidModification);
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
          // TODO: IMPLEMENT AND TEST PROPER ERROR HANDLING
          this.errorMessage = 'TODO: Better Message';
        } else {
          // TODO: IMPLEMENT AND TEST PROPER ERROR HANDLING
        }

      });
  }

  private handleFailedJidModification(err) {
    // TODO: IMPLEMENT AND TEST PROPER ERROR HANDLING
    console.log(err);
    this.refresh();
  }
}
