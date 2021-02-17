import { Component, Input, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { CommonUtils } from "src/app/utils/common-utils";

@Component({
  selector: 'app-motoraccident-claim-step',
  templateUrl: './motoraccident-claim-step.component.html',
  styleUrls: ['./motoraccident-claim-step.component.scss']
})
export class MotorAccidentClaimStepComponent implements OnInit {

  // @Input() set total(value: number) {
  //   this.items = [];
  //   for (let i = 0; i < value; i++) {
  //     this.items.push(i);
  //   }
  // }

  // @Input() route: string;
  @Input() params: string;

  @Input() set thirdParty(tp: boolean) {
    this.items = [];
    for (let i = 0; i < 5; i++) {
      this.items.push(i);
    }
    this.isThirdParty = tp;
  }

  @Input() current: number = 0;
  @Input() set completed(value: number[]) {
    this.itemCompleted = [];
    for (let i = 0; i < this.items.length; i++) {
      let found = false;
      for (let j = 0; j < value.length; j++) {
        if (value[j] == i) {
          found = true;
          break;
        }
      }
      this.itemCompleted.push(found);
    }
  }

  items: number[] = []
  itemCompleted: boolean[] = [];
  isThirdParty: boolean = false;

  constructor(private navController: NavController) {

  }

  ngOnInit() {

  }

  navigate(index: number) {

    if (!this.isThirdParty && index == 7)
      index = 9;

    let r = '/motoraccident/step' + (index + 1);
    if (!CommonUtils.isNullOrWhiteSpace(this.params))
      r += this.params;

    this.navController.navigateForward(r);
  }
}

