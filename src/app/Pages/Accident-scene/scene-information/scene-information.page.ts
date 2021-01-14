import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scene-information',
  templateUrl: './scene-information.page.html',
  styleUrls: ['./scene-information.page.scss'],
})
export class SceneInformationPage implements OnInit {
sceneDetails={
  numVeh:0,
  infraDamage:null,
  roadType:null,
  roadCondition:null,
  numOccupants:0, 
}
roadConditions=[
  {val:"bumpy",isChecked:false}
  , {val:"clear",isChecked:false},
  {val:"potholes",isChecked:false}
]
  constructor(  private route: Router) { }

  ngOnInit() {
  }

  nextPage(){
    this.route.navigate(["accident-scene3"]);
  }

  goBack(){
    this.route.navigateByUrl("accident-scene2");
  }

}
