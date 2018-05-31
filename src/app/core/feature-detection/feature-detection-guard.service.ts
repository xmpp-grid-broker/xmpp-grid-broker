import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {ConfigLoaderService} from '../config/config-loader';
import {NotificationService} from '../notifications/';
import {FeatureService} from './feature.service';
import {Injectable} from '@angular/core';

@Injectable()
export class FeatureDetectionGuardService implements CanActivate {
  // noinspection TypeScriptFieldCanBeMadeReadonly
  private checkWasSuccessfulOnce: boolean;


  constructor(private xmppFeatureService: FeatureService,
              private configService: ConfigLoaderService,
              private notificationService: NotificationService) {
    this.checkWasSuccessfulOnce = false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    if (this.checkWasSuccessfulOnce) {
      return true;
    }
    return this.configService.loadConfig()
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
      ).catch(() => {
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
