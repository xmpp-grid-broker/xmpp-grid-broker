import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config, XmppService} from '.';
import {environment} from '../../environments';

@Injectable()
export class ConfigService {
  /**
   * The URL of the configuration file.
   * @type {string}
   */
  static readonly CONFIG_FILE = environment.config_url;
  private readonly _config: Promise<Config>;

  constructor(private http: HttpClient,
              private xmppService: XmppService) {
    this._config = this.loadConfig();
  }

  /**
   * Returns a Promise of the application configuration,
   * that is loaded on this services initialisation.
   * @returns {Promise<Config>}
   */
  public getConfig(): Promise<Config> {
    return this._config;
  }

  private loadConfig(): Promise<Config> {
    return this.http.get(ConfigService.CONFIG_FILE)
      .toPromise()
      .then(json => {
        const config = Config.fromJson(json);
        this.xmppService.initialize(config);
        return config;
      });
  }

}
