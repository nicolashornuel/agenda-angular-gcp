import { Component, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({ template: '' })
export class AbstractNgModelComponent<T = any> implements ControlValueAccessor {

  @Input()
  disabled!: boolean;

  @Input()
  set value(value: T) {
    this._value = value;
    this.notifyValueChange();
  }

  get value(): T {
    return this._value;
  }

  onChange!: (value: T) => {};
  onTouched!: () => {};

  protected _value!: T;

  constructor() {}

  notifyValueChange(): void {
    if (this.onChange) {
      this.onChange(this.value);
    }
  }

  writeValue(value: T): void {
    this._value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
  }

}
