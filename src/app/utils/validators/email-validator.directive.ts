import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { CommonUtils } from '../common-utils';
import { MessageValidator } from './message-validator.interface';
import { Patterns } from './patterns';

@Directive({
  selector: '[appEmailValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: EmailValidatorDirective, multi: true }]
})
export class EmailValidatorDirective implements Validator, MessageValidator {
  @Input('appEmailValidator') message: string;
  readonly defaultMessage = "Please enter a valid email address.";
  validate(control: AbstractControl): ValidationErrors | null {
    return emailValidator(this.message || this.defaultMessage)(control);
  }
}

export function emailValidator(message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    //JN: empty/null values are valid, use a required validator to force a field value to exist
    let failedEmail = !CommonUtils.isNullOrWhiteSpace(control.value) && !Patterns.EmailPattern.test(control.value);
    return failedEmail ? { 'emailValidator': { value: control.value, message: message } } : null;
  };
}