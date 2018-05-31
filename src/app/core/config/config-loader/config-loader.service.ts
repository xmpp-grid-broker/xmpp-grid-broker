import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '../config';
import {XmppService} from '../../xmpp';
import {environment} from '../../../../environments';

@Injectable()
export class ConfigLoaderService {
  /**
   * The URL of the configuration file.
   * @type {string}
   */
  static readonly CONFIG_FILE = environment.config_url;

  constructor(private http: HttpClient,
              private xmppService: XmppService) {
  }

  /**
   * Returns a Promise of the application configuration,
   * that is loaded on this services initialisation.
   * @returns {Promise<Config>}
   */
  public loadConfig(): Promise<Config> {
    return this.http.get(ConfigLoaderService.CONFIG_FILE)
      .toPromise()
      .then(json => {
        const config = Config.fromJson(json);
        this.xmppService.initialize(config);
        return config;
      });
  }

}
