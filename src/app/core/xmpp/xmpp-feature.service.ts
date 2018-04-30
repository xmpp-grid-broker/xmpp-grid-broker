import {Injectable} from '@angular/core';
import {ConfigService} from '../config.service';
import {IqType, XmppService} from './xmpp.service';

//@Injectable()
export class XmppFeatureService {
  private _protocolFeatures: Map<string, Promise<string[]>> = new Map();

  constructor(private xmppService: XmppService, private configService: ConfigService) {
  }

  /**
   * Queries the XMPP server for the support of a specific feature.
   * Unsupported features are logged to the console.
   */
  checkFeature(protocol: string, feature: string): Promise<boolean> {
    return this._getProtocolFeatures(protocol)
      .then(features => {
        const supported = features.includes(feature);

        if (!supported) {
          console.warn(`XMPP feature ${feature} of protocol ${protocol} is not supported.`);
        }
        return supported;
      });
  }

  /**
   * Queries the XMPP server for supported feature of a protocol,
   * and returns whether all requested features are supported.
   */
  checkFeatures(protocol: string, features: string[]): Promise<boolean> {
      const featureSupport = features
        .map((feature => this.checkFeature(protocol, feature)));

      // check that _every_ requested feature is supported.
      return Promise.all(featureSupport).then(resolvedFeatures => {
        return resolvedFeatures.every((resolvedFeature) => resolvedFeature);
      });
  }

  /**
   * Queries the features of a specific protocol (e.g. 'pubsub')
   * from the XMPP server.
   */
  private _getProtocolFeatures(protocol: string): Promise<string[]> {
    if (this._protocolFeatures.has(protocol)) {
      return this._protocolFeatures.get(protocol);
    }

    const cmd = {
      type: IqType.Get,
      to: ''
    }; // TODO: Define query command

    const query = this.configService.getConfig().then(config => {
      cmd.to = `${protocol}.${config.xmpp.jid.domain}`; // TODO: Can we assume a non '' protocol?
      return this.xmppService.executeIq(cmd);
    })
      .then(rawFeatures => {
        // TODO: Map raw features
        console.error(rawFeatures);
        return ['none'];
      });

    this._protocolFeatures.set(protocol, query);
    return query;
  }
}
