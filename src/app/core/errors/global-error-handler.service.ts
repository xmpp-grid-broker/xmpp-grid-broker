import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {ErrorLogService} from './error-log.service';
import {NotificationService} from '../notifications';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private injector: Injector) {
  }

  handleError(error: any) {
    const notificationService = this.injector.get(NotificationService);
    const errorLog = this.injector.get(ErrorLogService);
    if (error == null) {
      // ignore "null" errors
      return;
    }

    if (error instanceof Error) {
      errorLog.error(error);
      notificationService.reportError(`${error.stack}`);
    } else if (error != null) {
      notificationService.reportError(error.toString());
    }

  }

}
