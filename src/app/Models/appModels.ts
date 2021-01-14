import { Geoposition } from "@ionic-native/geolocation/ngx";
import { Marker } from "@ionic-native/google-maps";

export interface BaseMessage {
  status: boolean;
  data: any;
  error: ErrorMessageData;
}

export interface ErrorMessageData {
  errorMessage: string;
  errorCode: number;
  errorTechMessage: string;
}
export interface getJobHistory extends BaseMessage {
  status: boolean;
  data: {
    driverId;
    jobHistory:iJobHistory[];
  };
}
export interface iJobHistory{
  id: number;
  desc: string; 
  service: string;
  date: any;
}

export interface iFinalDest{
  lat:number;
  lng:number;
  corpName:string;

}

export interface iServiceRequest{
  status: boolean,
  data:{
      driverId: number,
      serviceRequests:{
          callId: number,
          dateSent:{
              date:string,
              timezone_type: any,
              timezone: string
          },
          status: number,
          sub_sub_product_name: string,
          callRef: number,
      },
      driverVehicle: {
          vehicleId: string,
          vehicleDescription:string,
          vehicleRegistration:string
      },
      clientLocation: {
        latitude: number,
        longitude: number
      },
      finalDestination: string,
      driverStatus: boolean,
      client: any
  }
}


export class iClaimDetails{
  dateOfIncident:string;
  timeOfIncident:string;
  incidentLocation:string;
  incidentDescription:string;
  clientVehicle:VehicleDetails;
  sceneDetails:iSceneDetails;
}

export interface iSceneDetails{
 numOfVehs:number;
 propDamahe:string;
 roadType:string
 roadConditions:string; 
 numofOccupants:number;
 driverLic:iPhotos[];
 vehPhotos:iPhotos[];
 damageDesc:string;
 scenePhotos:iPhotos[]
 sceneDesc:string;
 vehCheckList:iCheckListInformation[];
 clientSignature:any;
 driverSignature:any;
}

export interface iPhotos{
  imageUrl:string
}
export interface iCheckListInformation{
  imageUrl:string
  productName:string;
  isAvailable:string;
}

export interface myLoc {
  lat?: any;
  lng?: any;
}
export interface ServiceProviderDetails {
  location?: Geoposition;
  name?: string;
  surname?: string;
  fullAddress?: string;
  deviceId?: string;
  marker?: Marker;
  driverAddressDescription?: string;
  driverAddressId?: number;
  driverAddressProvinceId?: number;
  driverAddressStreetName?: string;
  driverAddressSuburb?: string;
  driverAddressTownId?: number;
  driverAddressUnitNumber?: string;
  driverContactNumber?: string;
  driverEmailAddress?: string;
  driverFirstName?: string;
  driverFlagLicenceEndorsed?: boolean;
  driverFlagPhysicalDisabilities?: boolean;
  driverFlagSober?: boolean;
  driverFlagUnderEmployment?: boolean;
  driverId?: number;
  driverIdNumber?: string;
  driverImageUrl?: string;
  driverLastName?: string;
  driverLicenceCode?: string;
  driverLicenceDateIssued?: string;
  driverLicenceNumber?: string;
  driverLicenceType?: string;
  driverOccupation?: string;
  driverPreviousMotorOffences?: boolean;
  driverSpId?: number;
  driverValid?: number;
}

export interface UserProfile {
  address: string;
  cell: string;
  name: string;
  surname: string;
  password: string;
}
export interface InsuredDetails {
  policyNum?: string;
  idNum?: number;
  name?: string;
  surname?: string;
  address?: string;
  cellNum?: number;
  email?: string;
  occupation?: string;
}
export interface DriverDetails {
  name?: string;
  surname?: string;
  address?: string;
  cellNum?: number;
  email?: string;
  occupation?: string;
  driverLicenceImg?: string;
  driverLicenceNum?: string;
  driverLicenceCode?: string;
  driverLicenceDateIssue?: string;
  driverLicenceLearners?: string;
  samaAsInsured?: string;
}
export interface TripDetails {
  Distance: string;
  Eta: string; 
  finalDestination;
}

export interface ClientDetails {
  name?: string;
  surname?: string;
  lat?: number;
  lng?: number;
  address?: string;
  callID?: any;
  requestDate?: string;
  distance?: any;
  number?: string;
  callRef?: number;
  sub_sub_product_name?: string;
  finallocation?: string;
}

export class VehicleDetails {
  car_hire_group?: string;
  clientId?: number;
  makeDescription?: string;
  makeId?: number;
  model?: string;
  registrationNumber?: string;
  valid?: number;
  vehId?: number;
  vehicleChassisNumber?: string;
  vehicleColour?: string;
  vehicleDescription?: string;
  vehicleImageUrl?: string;
  vehicleSpId? :number;
  vehicleTransmission?: string;
  vehicleType?: number;
  vehicleTypeDescription?: string;
  vehicleUnderWarrantee?: number;
  vehicleUnderWarranteeDescription?: string;
  vehicleVinNumber?: string;
  vehicleYear?: string;
  vehicleEngineNumber?:string;
}

export interface JobCall {}
