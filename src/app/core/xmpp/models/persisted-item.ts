export class PersistedItem {
  /**
   * The XML payload of the persisted item in the form of a plain xml string.
   */
  public rawXML: string;

  constructor(public readonly id: string) {
  }
}
