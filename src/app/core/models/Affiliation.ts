/**
 * The names of possible affiliations as
 * defined in xep-0060.
 */
export enum Affiliation {
  Owner = 'Owner',
  Publisher = 'Publisher',
  PublishOnly = 'Publish-Only',
  Member = 'Member',
  None = 'None',
  Outcast = 'Outcast'
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
