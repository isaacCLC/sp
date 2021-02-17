import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppPipeModule } from "src/app/pipes/app.pipe.module";
import { AccordionComponent } from './app-accordion.component';


@NgModule({
    imports: [
        CommonModule,
        AppPipeModule,
    ],
    declarations: [
        AccordionComponent
    ],
    exports: [
        AccordionComponent
    ],
})
export class AppAccordionModule { }