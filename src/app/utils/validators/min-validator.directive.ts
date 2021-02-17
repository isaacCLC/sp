import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';
import { MessageValidator } from './message-validator.interface';

@Directive({
  selector: '[appMinValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MinValidatorDirective, multi: true }]
})
export class MinValidatorDirective implements Validator, MessageValidator {
  @Input('appMinValidator') min: number;
  @Input('appMinValidatorMessage') message: string;
  defaultMessage: string;

  ngOnInit(): void {
    this.defaultMessage = "Please ensure the field is more than " + this.min + ".";
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return minValidator(this.min, this.message || this.defaultMessage)(control);
  }
}

export function minValidator(min: number, message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    var failedMin = Validators.min(min)(control);
    return failedMin != null ? { 'minValidator': { value: control.value, message: message } } : null;
  };
}