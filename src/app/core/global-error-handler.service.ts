import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {NotificationService} from './notification.service';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private injector: Injector) {
  }

  handleError(error: any) {
    const notificationService = this.injector.get(NotificationService);
    if (error == null) {
      // ignore "null" errors
      return;
    }

    if (error instanceof Error) {
      console.log(error.stack);
      notificationService.notify(error.stack.toString());
    } else if (error != null) {
      notificationService.notify(error.toString());
    }

  }

}
