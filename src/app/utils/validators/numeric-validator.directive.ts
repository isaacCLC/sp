import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { CommonUtils } from "../common-utils";
import { MessageValidator } from './message-validator.interface';
import { Patterns } from "./patterns";

@Directive({
  selector: '[appNumericValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: NumericValidatorDirective, multi: true }]
})
export class NumericValidatorDirective implements Validator, MessageValidator {
  @Input('appNumericValidator') str: string;
  @Input('appMinValidatorMessage') message: string;
  defaultMessage: string;

  ngOnInit(): void {
    this.defaultMessage = "Please ensure the field is more than only contains numbers";
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return minValidator(this.str, this.message || this.defaultMessage)(control);
  }
}

export function minValidator(min: string, message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    //JN: empty/null values are valid, use a required validator to force a field value to exist
    let failedNumeric = !CommonUtils.isNullOrWhiteSpace(control.value) && !Patterns.NumberPattern.test(control.value);
    return failedNumeric ? { 'numericValidator': { value: control.value, message: message } } : null;
  };
}