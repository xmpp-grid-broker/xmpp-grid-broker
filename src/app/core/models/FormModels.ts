// TODO: Implement validators to conform to XEP-0004, XEP-0060 and XEP-0248...if this is possible...
export enum XmppDataFormFieldType {
  hidden,
  boolean,

  textSingle,
  textMulti,

  jidMulti,
  listMulti,
  listSingle,

  // others, that will be ignored...
  jidSingle,
  fixed,
  textPrivate,
}

export class ListOption {
  constructor(public readonly value: string,
              public readonly label: string = null) {
  }
}

export class XmppDataFormField {
  constructor(public readonly type: XmppDataFormFieldType,
              public readonly variable: string,
              public readonly value: any,
              public readonly label: string = null,
              public readonly options: ListOption[] = null) {
  }
}

export class XmppDataForm {
  constructor(public readonly fields: XmppDataFormField[]) {
  }
}
