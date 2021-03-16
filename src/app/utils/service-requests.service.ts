import { EventEmitter, Injectable } from '@angular/core';
import { UserState } from '../Helpers/user-state';
import { iServiceRequest } from '../models/appModels';
import { ApiGateWayService } from '../Providers/api-gate-way.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestsService {
  serviceReq: iServiceRequest
  private _currenServiceRequest: EventEmitter<any> = new EventEmitter();
  
  constructor(private userState: UserState, private _api: ApiGateWayService) {
    console.log("initializing Service requests...");

    // setup a timer to locate the user every 2 mins
    window.setInterval(() => this.getServiceRequest(), 5000);
   }

  private getServiceRequest(){
    // if(this.userState.isOnline){
      this._api.checkServiceRequests().then(serviceRequestResponse => {
        this.serviceReq = serviceRequestResponse
      })
    // } 
  }

}
