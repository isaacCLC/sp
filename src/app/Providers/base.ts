import { HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BaseMessage } from "../models/appModels";

export class ClcApiBase {

  // apiUrl: string = 'https://api.lmsystem.co.za';
  apiUrl:string ="https://apidev.lmsystem.co.za";
 
  verfyIDApiUrl: string = "https://www.verifyid.co.za";
  headers = new HttpHeaders({
    // 'Content-Type': 'application/json',
    'Accept': 'application/json'
  });


  createFormData(...params: FormParameter[]) {
    const formData = new FormData();

    for (let item of params)
      formData.append(item.key, item.value);
    return formData;
  }

  parseResponse<T extends BaseMessage>(message: T): T {
    // if this message has an error, move it's properties from data to error objects
    if (!message.status) {
      message.error = {
        errorCode: message.data.errorCode,
        errorMessage: message.data.errorMessage,
        errorTechMessage: message.data.errorTechMessage
      };
      message.data = {};
    }

    return message;
  }


  createStandardErrorMessage(e: HttpErrorResponse): BaseMessage {
    console.log(e)
    try {
      if (e && e.error) {
        return this.parseResponse(e.error);
      }
    }
    catch (e) { }

    return {
      status: false,
      data: {},
      error: {
        "errorMessage": "There was an error and the operation was not successful. Please try again or contact us for assistance.",
        "errorCode": 0,
        "errorTechMessage": e.message
      }
    };
  }
}

export class FormParameter {
  key: string;
  value: string;
}
