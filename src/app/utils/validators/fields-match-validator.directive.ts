import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MessageValidator } from './message-validator.interface';

@Directive({
    selector: '[appFieldsMatchValidator]',
    providers: [{ provide: NG_VALIDATORS, useExisting: FieldsMatchValidatorDirective, multi: true }]
})
export class FieldsMatchValidatorDirective implements Validator, MessageValidator {
    @Input('appFieldsMatchValidator') otherControl: AbstractControl;
    @Input('appFieldsMatchMessage') message: string;
    @Input('appFieldsMatchDebounce') debounce: number = 500;
    private control: AbstractControl;
    readonly defaultMessage = "Please ensure the fields match.";

    ngOnInit(): void {
        this.otherControl.valueChanges.pipe(debounceTime(this.debounce)).subscribe(() => {
            if (this.control)
                this.control.updateValueAndValidity();
        });
    }

    validate(control: AbstractControl): ValidationErrors | null {
        this.control = control;
        return fieldsMatchValiator(this.message || this.defaultMessage, this.otherControl)(control);
    }
}

export function fieldsMatchValiator(message: string, otherControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let failed = (otherControl.touched || otherControl.dirty) && control.value != otherControl.value;
        return failed ? { 'fieldsMatchValidator': { value: control.value, message: message } } : null;
    };
}