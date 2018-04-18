import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

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

  public goToHome(): void {
    this.goToUrl('/');
  }


  constructor(private router: Router) {
  }
}
