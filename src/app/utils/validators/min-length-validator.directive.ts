import { ValidatorFn, AbstractControl, NG_VALIDATORS, Validator, ValidationErrors, Validators } from '@angular/forms';
import { Directive, Input, OnInit } from '@angular/core';
import { MessageValidator } from './message-validator.interface';

@Directive({
  selector: '[appMinLengthValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MinLengthValidatorDirective, multi: true }]
})
export class MinLengthValidatorDirective implements Validator, MessageValidator, OnInit {
  @Input('appMinLengthValidator') minLength: number;
  @Input('appMinLengthValidatorMessage') message: string;
  defaultMessage: string;

  ngOnInit(): void {
    this.defaultMessage = "Please ensure the field is more than " + this.minLength + " characters.";
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return minLengthValidator(this.minLength, this.message || this.defaultMessage)(control);
  }
}

export function minLengthValidator(minLength: number, message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    var failedMinLength = Validators.minLength(minLength)(control);
    return failedMinLength != null ? { 'minLengthValidator': { value: control.value, message: message } } : null;
  };
}