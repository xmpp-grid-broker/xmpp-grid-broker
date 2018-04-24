export enum XmppDataFormFieldType {
  hidden = 'hidden',
  boolean = 'boolean',

  textSingle = 'text-single',
  textMulti = 'text-multi',

  jidMulti = 'jid-multi',
  listMulti = 'list-multi',
  listSingle = 'list-single',

  jidSingle = 'jid-single',
  // others, that will are currently ignored...
  fixed = 'fixed',
  textPrivate = 'text-private',
}

export class ListOption {
  constructor(public readonly value: string,
              public readonly label: string = null) {
  }

  static optionsFromJSON(options: any) {
    if (options) {
      return options.map((option) =>
        new ListOption(option.value, option.label)
      );
    } else {
      return [];
    }
  }

}

export class XmppDataFormField {
  constructor(public readonly type: XmppDataFormFieldType,
              public readonly name: string,
              public readonly value: any,
              public readonly label: string = null,
              public readonly options: ListOption[] = null) {
  }

  static fromJSON(field: any) {
    return new XmppDataFormField(
      field.type,
      field.name,
      (field.value) ? field.value : null,
      field.label,
      (field.type === 'list-multi' || field.type === 'list-single') ? ListOption.optionsFromJSON(field.options) : null
    );
  }

  toJSON(): object {
    return {
      name: this.name,
      value: this.value
    };
  }

  cloneWithNewValue(newValue: any): XmppDataFormField {
    return new XmppDataFormField(
      this.type,
      this.name,
      newValue,
      this.label,
      this.options
    );
  }
}

export class XmppDataForm {
  constructor(public readonly fields: XmppDataFormField[]) {
  }

  static fromJSON(jsonForm: any) {
    return new XmppDataForm(jsonForm.fields.map((field) => {
      return XmppDataFormField.fromJSON(field);
    }));
  }

  toJSON(type = 'submit'): object {
    return {fields: this.fields.map((field: XmppDataFormField) => field.toJSON()), type};
  }
}
