import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config, XmppConfig} from './models/config';
import {environment} from '../../environments/environment';
import {NotificationService} from './notifications/notification.service';

@Injectable()
export class ConfigService {
  /**
   * The URL of the configuration file.
   * @type {string}
   */
  static readonly CONFIG_FILE = environment.config_url;
  private readonly _config: Promise<Config>;

  constructor(private http: HttpClient,
              private notificationService: NotificationService) {
    this._config = this.loadConfig();
  }

  loadConfig(): Promise<Config> {
    return this.http.get(ConfigService.CONFIG_FILE)
      .toPromise()
      .then(json => Config.fromJson(json))
      .catch(() => {
        // TODO: FIND A BETTER SOLUTION THAN THIS!!!
        this.notificationService.alert(
          'Failed to load the configuration',
          'Learn how to how to correctly set up this application in the ' +
          '<a href="https://github.com/xmpp-grid-broker/xmpp-grid-broker/blob/master/docs/INSTALL.adoc">' +
          'Installation Guide</a>.',
          false,
          undefined,
          true);
      })
      .then((config: Config | undefined) => {
        // Wait forever as we cannot continue here...
        if (!config) {
          return new Promise<Config>(() => {
          });
        }
        return config;
      });

  }

  /**
   * Returns a Promise of the application configuration,
   * that is loaded on this services initialisation.
   * @returns {Promise<Config>}
   */
  getConfig(): Promise<Config> {
    return this._config;
  }
}
