export enum XmppDataFormFieldType {
  hidden,
  boolean,

  textSingle,
  textMulti,

  jidMulti,
  listMulti,
  listSingle,

  jidSingle,
  // others, that will are currently ignored...
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
