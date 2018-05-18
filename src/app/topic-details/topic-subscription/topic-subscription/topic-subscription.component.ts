import {Component, OnInit} from '@angular/core';
import {Subscription} from '../../../core/models/Subscription';
import {ActivatedRoute} from '@angular/router';
import {TopicSubscriptionService} from '../topic-subscription.service';
import {ErrorToString} from '../../../core/errors';

@Component({
  selector: 'xgb-topic-subscription',
  templateUrl: './topic-subscription.component.html',
  styleUrls: ['./topic-subscription.component.css']
})
export class TopicSubscriptionComponent implements OnInit {

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
   * An array of the subscriptions to manage.
   */
  subscriptions: Subscription[];

  /**
   * The node on which the subscriptions are managed.
   */
  private nodeId: string;

  constructor(private route: ActivatedRoute,
              private topicSubscriptionService: TopicSubscriptionService) {
  }

  ngOnInit() {
    this.nodeId = this.route.parent.snapshot.params.id;
    this.refresh();
  }

  private refresh() {
    this.isLoaded = false;
    this.topicSubscriptionService.loadSubscriptions(this.nodeId)
      .then((loadedSubscriptions: Subscription[]) => {
        this.isLoaded = true;
        this.subscriptions = loadedSubscriptions;
      })
      .catch((error) => {
        this.isLoaded = true;
        this.errorMessage = ErrorToString(error);
      });
  }

}
