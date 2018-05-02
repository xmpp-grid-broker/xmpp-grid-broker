import {Component, OnInit} from '@angular/core';
import {AffiliationManagementErrorCodes, TopicDetailsService} from '../topic-details.service';
import {Affiliation, JidAffiliation} from '../../core/models/Affiliation';
import {ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';
import {XmppService} from '../../core/xmpp/xmpp.service';
import {NotificationService} from '../../core/notifications/notification.service';

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
   * will be set if a service method call has failed.
   * this is the error message to display
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
              private topicDetailsService: TopicDetailsService,
              private notificationService: NotificationService) {
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
      .catch(this.handleFailedAffiliationAction);
  }

  changeAffiliation(affiliation: JidAffiliation, newAffiliation, selectBox) {
    this.xmppService.isJidCurrentUser(affiliation.jid)
      .then((doChangeOwnConfig) => {
        if (!doChangeOwnConfig) {
          this.doChangeAffiliation(affiliation, newAffiliation);
          return;
        }
        this.notificationService.confirm('Warning', 'You are about to change your own access rights. ' +
          'This means that you may no longer have access rights. Are you sure to proceed?')
          .then((confirmed) => {
            if (confirmed) {
              this.doChangeAffiliation(affiliation, newAffiliation);
            } else {
              selectBox.value = affiliation.affiliation;
            }
          });
      });

  }

  removeAffiliation(affiliation: JidAffiliation) {
    this.xmppService.isJidCurrentUser(affiliation.jid).then((doChangeOwnConfig) => {
      if (!doChangeOwnConfig) {
        this.doRemoveAffiliation(affiliation);
        return;
      }
      this.notificationService.confirm('Warning', 'You\'re about to remove your affiliation with this topic. ' +
        'This means that you may no longer have access rights. Are you sure to proceed?')
        .then((confirmed) => {
          if (confirmed) {
            this.doRemoveAffiliation(affiliation);
          }
        });
    });
  }

  private doRemoveAffiliation(affiliation: JidAffiliation) {
    affiliation.affiliation = Affiliation.None;
    this.isLoaded = false;
    this.topicDetailsService.modifyJidAffiliation(this.nodeId, affiliation)
      .then(() => {
        this.refresh();
      })
      .catch(this.handleFailedAffiliationAction);
  }

  private doChangeAffiliation(affiliation: JidAffiliation, newAffiliation) {
    this.isLoaded = false;
    affiliation.affiliation = newAffiliation;
    this.topicDetailsService.modifyJidAffiliation(this.nodeId, affiliation)
      .then(() => {
        this.refresh();
      })
      .catch(this.handleFailedAffiliationAction);
  }

  private refresh() {
    this.isLoaded = false;
    this.topicDetailsService.loadJidAffiliations(this.nodeId)
      .then((loadedAffiliations: JidAffiliation[]) => {
        this.isLoaded = true;
        this.jidAffiliations = loadedAffiliations;
      })
      .catch((error) => {
        this.isLoaded = true;
        this.handleFailedAffiliationAction(error);
      });
  }

  private handleFailedAffiliationAction(error) {
    if (error && error.condition) {
      switch (error.condition) {
        case AffiliationManagementErrorCodes.Unsupported:
          this.errorMessage = 'Node or service does not support affiliation management';
          break;
        case AffiliationManagementErrorCodes.Forbidden:
          this.errorMessage = 'You are not allowed to modify the affiliations because you are not owner';
          break;
        case AffiliationManagementErrorCodes.ItemNotFound:
          this.errorMessage = `Node ${this.nodeId} does not exist`;
          break;
        default:
          this.errorMessage = `Unknown error "${error.condition}": ${JSON.stringify(error)}`;
      }
    } else {
      this.errorMessage = `Unknown error: ${JSON.stringify(error)}`;
    }
  }
}
