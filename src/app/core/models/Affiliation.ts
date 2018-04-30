/**
 * The names of possible affiliations as
 * defined in xep-0060.
 */
export enum Affiliation {
  Owner = 'owner',
  Publisher = 'publisher',
  PublishOnly = 'publish-only',
  Member = 'member',
  None = 'none',
  Outcast = 'outcast'
}

/**
 * A class that represents the affiliation
 * of a JID (to a node).
 */
export class JidAffiliation {
  constructor(public jid: string,
              public affiliation: Affiliation) {

  }
}
