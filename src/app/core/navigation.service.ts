import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Topic} from './models/topic';

@Injectable()
export class NavigationService {

  public goToUrl(url: string): void {
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigateByUrl(url);
  }

  public goToNewTopic(): void {
    this.goToUrl('/topics/new/topic');
  }

  public goToNewCollection(): void {
    this.goToUrl('/topics/new/collection');
  }

  public goToSubscriptions(topic: string | Topic) {
    this.goToUrl(`${NavigationService.topicUrl(topic)}/subscriptions`);
  }

  public goToSubscription(topic: string | Topic, jid: string, subid: string) {
    this.goToUrl(`${NavigationService.topicUrl(topic)}/subscriptions/${encodeURIComponent(jid)}/${encodeURIComponent(subid)}`);
  }

  public goToNewSubscription(topic: string | Topic) {
    this.goToUrl(`${NavigationService.topicUrl(topic)}/subscriptions/new`);
  }

  public goToTopic(topic: string | Topic): void {
    this.goToUrl(NavigationService.topicUrl(topic));
  }

  public goToPersistedItems(topic: string | Topic): void {
    this.goToUrl(`${NavigationService.topicUrl(topic)}/items`);
  }

  private static topicUrl(topic: string | Topic): string {
    // The topic title might contain a "/" character, so prior URI encoding is required.
    if (topic instanceof Topic) {
      return `/topics/details/${encodeURIComponent(topic.title)}`;
    } else {
      return `/topics/details/${encodeURIComponent(topic)}`;
    }
  }

  public goToHome(): void {
    this.goToUrl('/');
  }


  constructor(private router: Router) {
  }


}
