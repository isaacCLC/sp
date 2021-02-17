import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: 'app-icon-img',
  templateUrl: './icon-img.component.html',
  styleUrls: ['./icon-img.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class IconImgComponent implements OnInit {
  @Input() white: boolean = false;
  @Input() brightRed: boolean = false;
  @Input() red: boolean = false;
  @Input() circle: boolean = false;
  @Input() green: boolean = false;
  @Input() yellow: boolean = false; 

  @Input() set width(value: number) {
    this.iconWidth = value - 10;
    this.circleWidth = value + 10;
  }
  @Input() set height(value: number) {
    this.iconHeight = value - 10;
    this.circleHeight = value + 10;
  }


  @Input() set image(value: string) {
    this.img = null; // clear from dom
    setTimeout(() => this.img = value, 50);
  }

  img: string = '';

  iconWidth: number = 50;
  iconHeight: number = 50;
  circleWidth: number = this.iconWidth + 10;
  circleHeight: number = this.iconHeight + 10;

  ngOnInit() {

  }
}
