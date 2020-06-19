import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/Message';
import { User } from 'src/app/_models/User';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-matches-messages',
  templateUrl: './matches-messages.component.html',
  styleUrls: ['./matches-messages.component.css']
})
export class MatchesMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(private userService: UserService, private authService: AuthService,
      private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages(){
    const currentUserIds = +this.authService.getUserId();
    this.userService.getMessageThread(this.authService.getUserId(), this.recipientId)
    .pipe(
      tap( // Do Something Before You Subscribe
        messages => {
          for (let i = 0; i < messages.length; i++) {
            if(messages[i].isRead === false && messages[i].recipientId === currentUserIds){
              this.userService.markAsRead(currentUserIds, messages[i].id);
            }
          }
        }
      )
    )
    .subscribe(
      messages => {
        this.messages = messages
      }, error => {
        this.alertify.error(error);
      }
    );
  }

  sendMessage(){
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.getUserId(), this.newMessage).subscribe(
      (msg:Message) => {
        this.messages.unshift(msg);
        this.newMessage.content = '';
      }, error => {
       this.alertify.error(error);
      }
    );
  }

}
