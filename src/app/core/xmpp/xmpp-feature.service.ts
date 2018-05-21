import {Injectable} from '@angular/core';
import {ConfigService} from '../config.service';
import {IqType, XmppService} from './xmpp.service';
import {ErrorLogService} from '../errors/error-log.service';

@Injectable()
export class XmppFeatureService {
  static readonly REQUIRED_PUBSUB_FEATURES = [
    'access-open', 'collections', 'config-node', 'create-and-configure', 'create-nodes', 'delete-nodes', 'get-pending', 'instant-nodes',
    'item-ids', 'meta-data', 'modify-affiliations', 'manage-subscriptions', 'multi-subscribe', 'outcast-affiliation', 'persistent-items',
    'presence-notifications', 'publish', 'publisher-affiliation', 'purge-nodes', 'retract-items', 'retrieve-affiliations',
    'retrieve-default', 'retrieve-items', 'retrieve-subscriptions', 'subscribe', 'subscription-options'
  ];
  private _protocolFeatures: Map<string, Promise<string[]>> = new Map();

  constructor(private xmppService: XmppService, private configService: ConfigService, private errorLogService: ErrorLogService) {
  }

  /**
   * Checks for a basic set of required features and returns
   * a list of all missing features.
   * If all required features are present, the list is empty
   */
  public getMissingRequiredFeatures(): Promise<string[]> {
    return this.checkFeatures('pubsub', XmppFeatureService.REQUIRED_PUBSUB_FEATURES);
  }

  /**
   * Queries the XMPP server for the support of a specific feature.
   * Unsupported features are logged.
   */
  public checkFeature(protocol: string, feature: string = ''): Promise<boolean> {
    return this._getProtocolFeatures(protocol)
      .then(features => {
        const supported = features.includes(feature);

        if (!supported) {
          this.errorLogService.warn(`XMPP feature ${feature} of protocol ${protocol} is not supported.`);
        }
        return supported;
      });
  }

  /**
   * Queries the XMPP server for supported feature of a protocol,
   * and returns a list unsupported features.
   *
   * If all required features are present, the returned list is empty.
   */
  public checkFeatures(protocol: string, features: string[]): Promise<string[]> {
    const featureSupport = features
      .map((feature => this.checkFeature(protocol, feature)));
    // check that _every_ requested feature is supported.
    return Promise.all(featureSupport)
      .then((resolvedFeatures) => {
        return resolvedFeatures
          .map((item, idx) => {
            return {isSuported: item, label: `${features[idx]}(${protocol})`};
          })
          .filter((feature) => !feature.isSuported)
          .map((feature) => feature.label);
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


    const query = this.configService.getConfig()
      .then(config => {
        const cmd = {
          type: IqType.Get,
          to: config.xmpp.server,
          discoInfo: {}
        };

        switch (protocol) {
          case 'pubsub':
            return this.xmppService.executeIqToPubsub(cmd);
          default:
            return this.xmppService.executeIq(cmd);
        }
      })
      .then(rawFeatures => {
        const features = rawFeatures.discoInfo.features
        // Map URLs to feature strings
          .map(url => {
            if (url.startsWith(`http://jabber.org/protocol/${protocol}`)) {
              if (url.includes('#')) {
                return url.split('#', 2).pop();
              } else {
                return ''; // general protocol support
              }
            } else {
              return undefined;
            }
          })
          // Filter features that do not belong to this protocol
          .filter(feature => feature !== undefined);
        return features;
      });

    this._protocolFeatures.set(protocol, query);
    return query;
  }
}
