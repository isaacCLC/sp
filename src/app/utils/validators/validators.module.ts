import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { EmailValidatorDirective } from './email-validator.directive';
import { FieldsMatchValidatorDirective } from "./fields-match-validator.directive";
import { MaxLengthValidatorDirective } from './max-length-validator.directive';
import { MaxValidatorDirective } from './max-validator.directive';
import { MinLengthValidatorDirective } from './min-length-validator.directive';
import { MinValidatorDirective } from './min-validator.directive';
import { NumericValidatorDirective } from "./numeric-validator.directive";
import { RequiredValidatorDirective } from './required-validator.directive';
import { UrlValidatorDirective } from "./url-validator.directive";
import { ValidatedFormControlComponent } from './validated-form-control/validated-form-control.component';


@NgModule({
    imports: [
        CommonModule,
        IonicModule
    ],
    declarations: [
        EmailValidatorDirective,
        RequiredValidatorDirective,
        MinLengthValidatorDirective,
        MaxLengthValidatorDirective,
        MinValidatorDirective,
        MaxValidatorDirective,
        UrlValidatorDirective,
        ValidatedFormControlComponent,
        FieldsMatchValidatorDirective,
        NumericValidatorDirective,
    ],
    exports: [
        EmailValidatorDirective,
        RequiredValidatorDirective,
        MinLengthValidatorDirective,
        MaxLengthValidatorDirective,
        MinValidatorDirective,
        MaxValidatorDirective,
        UrlValidatorDirective,
        ValidatedFormControlComponent,
        FieldsMatchValidatorDirective,
        NumericValidatorDirective,
    ],
})
export class ValidatorsModule { }