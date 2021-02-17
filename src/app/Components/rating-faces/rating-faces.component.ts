import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'app-rating-faces',
  templateUrl: './rating-faces.component.html',
  styleUrls: ['./rating-faces.component.scss']
})
export class RatingFacesComponent implements OnInit {

  @Input() rating: number = 0;
  @Input() reason: string = '';

  constructor() {

  }

  ngOnInit() {

  }


}

