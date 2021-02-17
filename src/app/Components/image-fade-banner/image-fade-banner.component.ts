import { Component, Input, OnDestroy, OnInit } from "@angular/core";

@Component({
  selector: 'app-image-fade-banner',
  templateUrl: './image-fade-banner.component.html',
  styleUrls: ['./image-fade-banner.component.scss'],
})
export class ImageFadeBannerComponent implements OnInit, OnDestroy {

  @Input() set images(value: string[]) {
    if (value && value.length > 0) {
      this.items = value;
    }
    else {
      // default
      this.items = [
      ];
    }
  }

  items: string[] = [];

  ngOnInit() {

  }

  ngOnDestroy() {

  }
}
