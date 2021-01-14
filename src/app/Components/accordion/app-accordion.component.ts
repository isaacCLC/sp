import { Component, Input, OnInit } from '@angular/core';


@Component({
    selector: 'app-accordion',
    templateUrl: './app-accordion.component.html',
    styleUrls: ['./app-accordion.component.scss']
})
export class AccordionComponent implements OnInit {
    @Input() items: FaqItem[] = [];

    constructor() {
    }

    ngOnInit() {

    }

    expand(item: FaqItem) {
        for (let x of this.items) {

            if (x === item)
                x.expanded = !item.expanded;
            else
                x.expanded = false;

        }
    }
}

export class FaqItem {
    expanded: boolean;
    heading: string;
    body: string;
}
