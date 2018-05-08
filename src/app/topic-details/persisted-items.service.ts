import {Injectable} from '@angular/core';
import {IqType, XmppService} from '../core/xmpp/xmpp.service';
import {JID} from 'xmpp-jid';

export class PersistedItem {
  constructor(public readonly id: string, public readonly publisher: JID, public readonly rawXML: string) {
  }

}

@Injectable()
export class PersistedItemsService {
  private PAGE_SIZE = 10;

  constructor(private xmppService: XmppService) {
  }

  insertPersistedItems(topicIdentifier: string): Promise<void> {
    for (let i = 0; i < 1; i++) {

    }
    const cmd = {
      type: IqType.Get,
      pubsub: {
        publish: {
          node: topicIdentifier,
          item: {
            rawXML: '<entry xmlns=\'http://www.w3.org/2005/Atom\'>' +
            '          <title>Soliloquy ' + new Date().toISOString() + '</title>' +
            '          <summary>' +
            'To be, or not to be: that is the question:' +
            'Whether tis nobler in the mind to suffer' +
            'The slings and arrows of outrageous fortune,' +
            'Or to take arms against a sea of troubles,' +
            'And by opposing end them?' +
            '          </summary>' +
            '          <link rel=\'alternate\' type=\'text/html\'' +
            '                href=\'http://denmark.lit/2003/12/13/atom03\'/>' +
            '          <id>tag:denmark.lit,2003:entry-32397</id>' +
            '          <published>2003-12-13T18:30:02Z</published>' +
            '          <updated>2003-12-13T18:30:02Z</updated>' +
            '        </entry>'
          }
        },
      }
    };
    return this.xmppService.executeIqToPubsub(cmd).then(() => {
    });


  }


  async* persistedItems(topicIdentifier: string, predicate: (value) => boolean): AsyncIterableIterator<PersistedItem> {
    // TODO: openfire returns only the last item...
    const cmd = {
      type: IqType.Get,
      pubsub: {
        retrieve: {
          node: topicIdentifier,
        },
        // TODO: openfire does ignore rsm here...
        rsm: {
          max: this.PAGE_SIZE,
          after: undefined
        }
      }
    };

    // TODO: the response is crap - the published timestamp is missing and the JID is rubbish...
    const response = await this.xmppService.executeIqToPubsub(cmd);
    console.log(response);
    const items = response.pubsub.retrieve.items;
    if (!items) {
      return;
    }
    for (const item of items) {
      yield new PersistedItem(item.id, item.publisher, item.rawXML);
    }
  }
}
