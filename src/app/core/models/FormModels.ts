// TODO: Implement validators to conform to XEP-0004, XEP-0060 and XEP-0248.
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

export class Option {
  label: string;
  value: string;
}

export abstract class XmppDataFormField {
  constructor(public readonly type: XmppDataFormFieldType,
              public readonly prefixedVariable: string,
              public readonly label: string) {
  }

  get variable(): string {
    return this.prefixedVariable.substr(
      this.prefixedVariable.indexOf('#') + 1,
      this.prefixedVariable.length);
  }
}

// export class XmppDataListFormField extends XmppDataFormField {
//   constructor(type: XmppDataFormFieldType,
//               variable: string,
//               public readonly options: Option[],
//               label: string = null) {
//     super(type, variable, label);
//   }
// }

// TODO: value for multi text should be an array of strings...

export class XmppDataValueFormField extends XmppDataFormField {
  constructor(type: XmppDataFormFieldType,
              variable: string,
              public readonly value: string,
              label: string = null) {
    super(type, variable, label);
  }
}


export class XmppDataForm {
  constructor(public readonly fields: XmppDataFormField[]) {
  }

  // title: string;  // TODO: Optional, we will ignore this for now...
  // instructions: string; // TODO:  Optional, we will ignore this for now...

}
