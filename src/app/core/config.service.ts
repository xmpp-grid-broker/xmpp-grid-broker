import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from './models/config';

@Injectable()
export class ConfigService {
  /**
   * The URL of the configuration file.
   * @type {string}
   */
  static readonly CONFIG_FILE = './configuration.json';
  private readonly _config: Promise<Config>;

  constructor(private http: HttpClient) {
    this._config = this.loadConfig();
  }

  loadConfig(): Promise<Config> {
    return this.http.get(ConfigService.CONFIG_FILE)
      .toPromise()
      .then(json => Config.fromJson(json));
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
