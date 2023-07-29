export class PropertyFactory {
  _value;
  options;

  constructor(options: any) {
    const { defaultValue, value } = options;
    this._value = value || defaultValue;
    this.options = options;
  }

  get value() {
    return this._value || this.options.defaultValue;
  }
  set value(value) {
    this._value = value || this._value || this.options.defaultValue;
  }
}
