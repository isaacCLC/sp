import { ValidatorFn, AbstractControl, NG_VALIDATORS, Validator, ValidationErrors, Validators } from '@angular/forms';
import { Directive, Input, OnInit } from '@angular/core';
import { MessageValidator } from './message-validator.interface';

@Directive({
  selector: '[appMaxLengthValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MaxLengthValidatorDirective, multi: true }]
})
export class MaxLengthValidatorDirective implements Validator, MessageValidator, OnInit {
  @Input('appMaxLengthValidator') maxLength: number;
  @Input('appMaxLengthValidatorMessage') message: string;
  defaultMessage: string;

  ngOnInit(): void {
    this.defaultMessage = "Please ensure the field is less than " + this.maxLength + " characters."
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return maxLengthValidator(this.maxLength, this.message || this.defaultMessage)(control);
  }
}

export function maxLengthValidator(maxLength: number, message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    var failedMaxLength = Validators.maxLength(maxLength)(control);
    return failedMaxLength != null ? { 'maxLengthValidator': { value: control.value, message: message } } : null;
  };
}