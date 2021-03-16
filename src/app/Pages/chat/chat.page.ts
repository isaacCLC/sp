import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ChatService } from 'src/app/Helpers/chat.service';
import { DriverDetails, iServiceRequest } from 'src/app/models/appModels';
import { ApiGateWayService } from 'src/app/Providers/api-gate-way.service';
import { PusherProvider } from 'src/app/Providers/pusher/pusher';
import { v4 } from 'uuid';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  jobDetails: iServiceRequest;
  spDetails: DriverDetails;
  messages: [];scrolled = false;
  @ViewChild('content') private content: any;
  @ViewChild('messagesDiv') private messagesDiv: any;
  constructor(
    private chatService: ChatService, public _zone: NgZone) {

    }

  ngOnInit() {
    
  }


  scrollBottom(){
    setTimeout(() => {
      this.scrolled?"":this.content.scrollToBottom(1000);
      this.scrolled = true;
    }) 
  }


  async ionViewDidEnter() {
    console.log("Scrolled")
    this.chatService.chatsUpdated.subscribe(()=>{
      this.scrolled = false;
      this.scrollBottom()
    })
    // this.messagesDiv.changes.subscribe(t => {
    //   console.log('NgFor is Rendered');
    // })
  }

  sendMessage(message){
    this.chatService.sendMessage(message).then(res=>{
      console.log(res)
    })
  }

}
