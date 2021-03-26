import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiGateWayService } from '../Providers/api-gate-way.service';
import { ServiceRequestsService } from '../utils/service-requests.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  messages: [];
  private _chatsUpdated: EventEmitter<any> = new EventEmitter();
  currentAlert: HTMLIonAlertElement;

  constructor(
    private _api: ApiGateWayService,
    private serviceRequestsService: ServiceRequestsService,
    private route: Router,
    public alertController: AlertController) {
    this.getMessages()
    window.setInterval(() => this.serviceRequestsService.serviceReq ? this.getMessages() : "", 5000);

  }

  public get chatsUpdated(): EventEmitter<any> {
    return this._chatsUpdated;
  }

  getMessages() {
    if (this.serviceRequestsService.serviceReq && this.serviceRequestsService.serviceReq.data.serviceRequests.callId) {
      this._api.getChats(this.serviceRequestsService.serviceReq.data.serviceRequests.callId).then(messages => {
        console.log(!this.messages || this.messages.length != messages.data.length)
        !this.messages || this.messages.length != messages.data.length?this.messages = messages.data:"";
        messages.data.forEach(element => {

          if (this.route.isActive('chat', false) && element.messageRead == 0) {
            if (element.messageRead == 0){
              this.markAsRead(element.chatID)
            }
            this.chatsUpdated.emit(true);
          } else {
            if (element.messageRead == 0 && element.sentBy == 'agent' && (!this.currentAlert)) {
              console.log(this.currentAlert)
              this.alertController.create({
                header: "New Message from CLC",
                subHeader: element.user_first_name + " " + element.user_last_name,
                message: element.chatMessage,
                backdropDismiss: false,
                inputs: [
                  {
                    name: 'message',
                    type: 'text',
                    placeholder: 'Enter a reply message.'
                  },
                ],
                buttons: [
                  {
                    text: 'Mark as read',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (data) => {
                      this.markAsRead(element.chatID).then(read => {
                        this.currentAlert = undefined;
                      })
                    }
                  }, {
                    text: 'Reply',
                    handler: (data) => {
                      console.log(data);
                      this.sendMessage(data.message).then(sent => {
                        this.markAsRead(element.chatID).then(read => {
                          this.currentAlert = undefined;
                        })
                      })
                    }
                  }
                ]
              }).then(alert => {
                this.currentAlert = alert
                this.currentAlert.present()
              })
            }
          }
        });
      })
    }
  }

  async sendMessage(message) {
    await this._api.sendMessage(this.serviceRequestsService.serviceReq.data.serviceRequests.callId, message).then(res => {
      console.log(res)
    })
  }

  async markAsRead(messageID) {
    await this._api.markMessageAsRead(this.serviceRequestsService.serviceReq.data.serviceRequests.callId, messageID).then(res => {
      console.log(res)
    })
  }
}
