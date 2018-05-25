import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {XmppFeatureService} from './xmpp-feature.service';
import {NotificationService} from '../notifications/notification.service';
import {Injectable} from '@angular/core';
import {ConfigService} from '../config.service';

@Injectable()
export class XmppFeatureGuardService implements CanActivate {
  private checkWasSuccessfulOnce: boolean;


  constructor(private xmppFeatureService: XmppFeatureService,
              private configService: ConfigService,
              private notificationService: NotificationService) {
    this.checkWasSuccessfulOnce = false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    if (this.checkWasSuccessfulOnce) {
      return true;
    }
    return this.configService.getConfig()
      .then(() => this.xmppFeatureService.getMissingRequiredFeatures()
        .then(missingFeatures => {
          const successful = missingFeatures.length === 0;
          if (!successful) {
            this.notificationService.alert(
              'Configuration Problem',
              'Not all required XMPP features are supported. ' +
              'The missing features are listed in the box below:',
              false,
              missingFeatures);
          } else {
            this.checkWasSuccessfulOnce = true;
          }
          return successful;
        })
      ).catch((e) => {
        this.notificationService.alert(
          'Failed to load the configuration',
          'Learn how to how to correctly set up this application in the ' +
          '<a href="https://github.com/xmpp-grid-broker/xmpp-grid-broker/blob/master/docs/INSTALL.adoc">' +
          'Installation Guide</a>.',
          false,
          undefined,
          true);
        return false;
      });

  }

}
