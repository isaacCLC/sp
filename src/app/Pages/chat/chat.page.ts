import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PusherProvider } from 'src/app/Providers/pusher/pusher';
import { v4 } from 'uuid';

interface Message {
  id: string;
  text: string;
  timeStamp?: Date;
  type: string;
}


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  constructor(private http: HttpClient, private pusher: PusherProvider) {}
  messages: Array<Message> = [];
  message: string = '';
  lastMessageId;
  doneLoading = false;
  showEmojis = false;
  score = {
    tone: '',
    score: 0,
  };

  sendMessage() {
    if (this.message !== '') {
      this.lastMessageId = v4();
      this.showEmojis = false;

      const data = {
        id: this.lastMessageId,
        text: this.message,
        type: 'outgoing',
      };
      this.messages = this.messages.concat(data);
      this.message = '';
      this.http
        .post('https://2d42d65a.ngrok.io/messages', data)
        .subscribe((res: Message) => {});
    }
  }

  selectEmoji(e) {
    const emoji = String.fromCodePoint(e);
    this.message += ` ${emoji}`;
    this.showEmojis = false;
  }

  getClasses(messageType) {
    return {
      incoming: messageType === 'incoming',
      outgoing: messageType === 'outgoing',
    };
  }

  ngOnInit() {
    const channel = this.pusher.init();
    channel.bind('message', (data) => {
      if (data.id !== this.lastMessageId) {
        const message: Message = {
          ...data,
          type: 'incoming',
        };
        this.showEmojis = true;
        this.score = data.sentiment;
        this.messages = this.messages.concat(message);
      }
    });
  }

}
