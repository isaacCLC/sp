import { ValidatorFn, AbstractControl, NG_VALIDATORS, Validator, ValidationErrors, Validators } from '@angular/forms';
import { Directive, Input, OnInit } from '@angular/core';
import { MessageValidator } from './message-validator.interface';

@Directive({
  selector: '[appMaxValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MaxValidatorDirective, multi: true }]
})
export class MaxValidatorDirective implements Validator, MessageValidator, OnInit {
  @Input('appMaxValidator') max: number;
  @Input('appMaxValidatorMessage') message: string;
  defaultMessage: string;

  ngOnInit(): void {
    this.defaultMessage = "Please ensure the field is less than " + this.max + ".";
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return maxValidator(this.max, this.message || this.defaultMessage)(control);
  }
}

export function maxValidator(max: number, message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    var failedMax = Validators.max(max)(control);
    return failedMax != null ? { 'maxValidator': { value: control.value, message: message } } : null;
  };
}