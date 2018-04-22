import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/publish';
import {Subject} from 'rxjs/Subject';


@Injectable()
export class NotificationService {
  public readonly notification: Observable<string>;
  private _notification: Subject<string>;

  constructor() {
    this._notification = new Subject();
    this.notification = this._notification.asObservable().publish().refCount();
  }

  public notify(message: string) {
    this._notification.next(message);
  }

}
