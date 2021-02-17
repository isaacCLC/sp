import { ValidatorFn, AbstractControl, NG_VALIDATORS, Validator, ValidationErrors, Validators } from '@angular/forms';
import { Directive, Input } from '@angular/core';
import { MessageValidator } from './message-validator.interface';

@Directive({
  selector: '[appRequiredValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: RequiredValidatorDirective, multi: true }]
})
export class RequiredValidatorDirective implements Validator, MessageValidator {
  @Input('appRequiredValidator') message: string;
  readonly defaultMessage = "This field is required.";
  validate(control: AbstractControl): ValidationErrors | null {
    return requiredValidator(this.message || this.defaultMessage)(control);
  }
}

export function requiredValidator(message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    var failedRequired = Validators.required(control);
    return failedRequired != null ? { 'requiredValidator': { value: control.value, message: message } } : null;
  };
}