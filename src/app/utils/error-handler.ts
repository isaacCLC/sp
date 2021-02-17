// import { ErrorHandler, Injectable } from '@angular/core';
// declare var AppCenter: any;
// @Injectable()
// export class BrewErrorHandler extends ErrorHandler {

//     constructor() {
//         super();
//     }

//     handleError(error: any): void {
//         console.log(error)
//         AppCenter.Crashes.trackError('Exception', {});
//     }
// }

// src/app/error.service.ts
import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http'
import * as Sentry from "@sentry/browser";
Sentry.init({
    dsn: "https://78425982b0d948a08f69217664753f08@o491676.ingest.sentry.io/5557604"
});
@Injectable({
    providedIn: 'root'
})
export class SentryErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) { }
    handleError(error: any) {
        const router = this.injector.get(Router);
        const eventId = Sentry.captureException(error.originalError || error);
        if (Error instanceof HttpErrorResponse) {
            console.log(error);
            Sentry.captureException(error)
            // Sentry.showReportDialog({ eventId });
        }
        else {
            console.error("an error occured here broo");
            console.log(error)
            Sentry.captureException(error)
            // Sentry.showReportDialog({ eventId });
        }
        // router.navigate(['error']);
    }
}