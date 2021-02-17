import { Component, Input } from '@angular/core';
import { NgModel } from '@angular/forms';
import { CommonUtils } from '../../common-utils';

@Component({
  selector: 'app-validated-form-control',
  templateUrl: './validated-form-control.component.html',
  styleUrls: ['./validated-form-control.component.scss'],
})
export class ValidatedFormControlComponent {
  private readonly modelStateKeyPrefix = "modelStateError-"
  @Input() control: NgModel;
  @Input()
  set modelState(value: any) {
    this.parseModelState(value);
  };
  @Input() modelStateKey: string;
  @Input() dark: boolean = false;
  @Input() icon: string;

  private parseModelState(modelState: any) {
    let err = this.control.errors || {};

    //remove all old errors that were added by modelstate
    for (let key in err) {
      if (key.indexOf(this.modelStateKeyPrefix) > -1)
        delete err[key];
    }

    let currentErrors = err;

    // find all modelState errors that match the modelStateKey
    let newErrors = [];
    let counter = 1;
    for (let key in modelState) {
      //JN: only look at the part of the key after the last .
      //This is because we have inner classes in the request
      if (key.substring(key.lastIndexOf('.') + 1).toLowerCase() == this.modelStateKey.toLowerCase())
        newErrors = modelState[key];
    }

    newErrors.forEach(error => {
      currentErrors[this.modelStateKeyPrefix + counter++] = { message: error };
    });

    if (Object.keys(currentErrors).length > 0) {
      this.control.control.setErrors(currentErrors);
    }

    //JN: If there are any modelState errors, mark the control as dirty so the errors show
    if (Object.keys(currentErrors).filter(e => e.indexOf(this.modelStateKeyPrefix) > -1).length > 0) {
      this.control.control.markAsDirty();
    }
  }

  public get errorMessages(): string[] {
    let err = this.control.errors;

    if (!err) {
      return [];
    }

    let keys = [];
    for (let key in err) {
      if (!CommonUtils.isNullOrWhiteSpace(err[key].message)) {
        keys.push(err[key].message);
      }
      else {

        //check the built-in validators
        if (key == "required") {
          keys.push("Field required");
        }
        else if (key == "email") { 
          keys.push("Please enter a valid email address");
        }
        else if (key == "maxLength") {
          keys.push("This field is too long");
        }
        else if (key == "minLength") {
          keys.push("This field is too short");
        }
        else if (key == "max") {
          keys.push("The value is too high");
        }
        else if (key == "min") {
          keys.push("The value is too low");
        }
        else if (key == "requiredTrue") {
          keys.push("Please ensure you've checked this value");
        }

      }
    }
    return keys;
  }
}
