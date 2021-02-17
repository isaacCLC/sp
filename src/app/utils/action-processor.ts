// import { Injectable, NgZone } from '@angular/core';
// import { Router } from '@angular/router';
// import { NavigationOptions } from '@ionic/angular/dist/providers/nav-controller';
// import { AppEvents } from "./app-events";
// import { PopupHelper } from './popup-helper';

// @Injectable({
//     providedIn: 'root',
// })
// export class ActionProcessor {
//     public static readonly notificationOpenedEventKey = "pushNotificationOpened";
//     private actionQueue: Action[] = [];
//     private initialized: boolean = false;
//     private processing: boolean = false;

//     private router: Router;
//     constructor(public events: AppEvents, public ngZone: NgZone, private popup: PopupHelper) {


//     }

//     /**Init the action processor to start listening for events */
//     public init() {
//         console.log('action processor listening for events...');
//         //listen for events from push plugin and add to the queue
//         this.events.subscribe(ActionProcessor.notificationOpenedEventKey, (action: Action) => {
//             this.actionQueue.push(action);
//             if (this.initialized)
//                 this.processActions();
//         });
//     }

//     /**In order for the action processor to be able to route, we need to give it a reference to the NavController. */
//     public setup(router: Router) {
//         //console.log('init action processor');
//         this.router = router;
//         this.initialized = true;
//     }

//     public loggedOut() {
//         this.router = null;
//         this.initialized = false;
//         this.actionQueue = [];
//     }

//     public processActions(): void {
//         //  console.log('processing actions');
//         if (!this.initialized || !this.router) {
//             return;
//         }

//         if (this.processing)
//             return; // someone else is already processing

//         this.processing = true;

//         let navAction: Action = null;

//         for (let action of this.actionQueue) {
//             // console.log("action");
//             console.log(action, action.route, action.timestamp, action.navigationOptions);

//             if (!this.hasOperation(action)) {
//                 //   if (moment(action.timestamp).isAfter(moment().subtract(30, 'seconds'))) {
//                 navAction = action;
//                 //   }
//                 //  else {
//                 //      console.log('ignoring routing action because it is too old');
//                 //  }
//             }
//             this.ngZone.run(() => {
//                 if (this.hasOperation(action)) {
//                     action.performOperation(this.popup);
//                 }
//             });
//         }

//         this.actionQueue = [];
//         this.processing = false;

//         if (navAction && navAction.route) {
//             //hopefully get around the async nav guards taking us to other pages
//             setTimeout(() => {
//                 this.ngZone.run(() => {
//                     this.router.navigate([navAction.route], navAction.navigationOptions);
//                 });
//             }, 500);

//         }
//     }

//     private hasOperation(action: Action | IActionOperation): action is IActionOperation { //magic happens here
//         return (<IActionOperation>action).performOperation !== undefined;
//     }
// }

// export interface IActionOperation {
//     performOperation(popup: PopupHelper): void;
// }

// export class Action {
//     timestamp: string
//     route: string;
//     navigationOptions: NavigationOptions = {};
// }

// export class ViewETA extends Action {
//     constructor(callRef: string) {
//         super();
//         this.route = `/service-request/arrive-eta?callRef=` + callRef;
//     }
// }

// export class ViewHome extends Action {
//     constructor() {
//         super();
//         this.route = '/home';
//     }
// }


