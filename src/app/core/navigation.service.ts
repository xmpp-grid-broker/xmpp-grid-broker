import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class NavigationService {

  public goToUrl(url: string): void {
    this.router.navigateByUrl(url);
  }

  public goToNewTopic(): void {
    this.goToUrl('/topics/new');
  }

  constructor(private router: Router) {
  }
}
