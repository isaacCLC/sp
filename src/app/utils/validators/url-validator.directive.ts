import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { CommonUtils } from '../common-utils';
import { MessageValidator } from './message-validator.interface';
import { Patterns } from './patterns';

@Directive({
  selector: '[appUrlValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: UrlValidatorDirective, multi: true }]
})
export class UrlValidatorDirective implements Validator, MessageValidator {
  @Input('appUrlValidator') message: string;
  readonly defaultMessage = "Please enter a valid url.";
  validate(control: AbstractControl): ValidationErrors | null {
    return urlValidator(this.message || this.defaultMessage)(control);
  }
}

export function urlValidator(message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    //JN: empty/null values are valid, use a required validator to force a field value to exist
    let failed = !CommonUtils.isNullOrWhiteSpace(control.value) && !Patterns.UrlPattern.test(control.value);
    return failed ? { 'urlValidator': { value: control.value, message: message } } : null;
  };
}