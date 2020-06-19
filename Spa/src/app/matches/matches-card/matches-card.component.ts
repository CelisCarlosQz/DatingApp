import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/User';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-matches-card',
  templateUrl: './matches-card.component.html',
  styleUrls: ['./matches-card.component.css']
})
export class MatchesCardComponent implements OnInit {

  @Input() user: User;

  constructor(private authService: AuthService, private userService: UserService, 
      private alertify: AlertifyService) { }

  ngOnInit() {
  }

  sendLike(recipientId: number) {
    this.userService.sendLike(this.authService.getUserId(), recipientId).subscribe(
      data => {
        this.alertify.success('Te ha gustado ' + this.user.knownAs);
      }, error => {
        this.alertify.error(error);
      }
    );
  }

}