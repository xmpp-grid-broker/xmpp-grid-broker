import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from './models/config';

@Injectable()
export class ConfigService {
  static readonly CONFIG_FILE = './configuration.json';
  private readonly _config: Promise<Config>;

  constructor(private http: HttpClient) {
    this._config = this.loadConfig();
  }

  loadConfig(): Promise<Config> {
    return this.http.get(ConfigService.CONFIG_FILE) // TODO: Does this work if in "subdir"?
      .toPromise()
      .then(json => json as Config);
  }

  getConfig(): Promise<Config> {
    return this._config;
  }
}
