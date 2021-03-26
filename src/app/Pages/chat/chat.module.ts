import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { MomentModule } from 'ngx-moment';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    Nl2BrPipeModule,
    MomentModule
  ],
  declarations: [ChatPage]
})
export class ChatPageModule {}
