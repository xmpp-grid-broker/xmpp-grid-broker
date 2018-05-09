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


  public goToTopic(topic: string | Topic): void {
    // The topic title might contain a "/" character, so prior URI encoding is required.
    if (topic instanceof Topic) {
      this.goToUrl(`/topics/details/${encodeURIComponent(topic.title)}`);
    } else {
      this.goToUrl(`/topics/details/${encodeURIComponent(topic)}`);
    }
  }

  public goToHome(): void {
    this.goToUrl('/');
  }


  constructor(private router: Router) {
  }
}
